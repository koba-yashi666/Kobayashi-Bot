import { getAntiFakeConfig, checkAntiFakeParticipant, participantPhoneCandidates } from './antiFake.js';
import { recordX9Decision } from '../group/x9Audit.js';
import { addAdminLog } from './adminLogs.js';

const clean = value => String(value || '').replace(/:\d+(?=@)/, '');
export const requestJid = value => typeof value === 'string' ? value : value?.jid || value?.id || value?.participant || value?.lid;
const ids = value => [...new Set([requestJid(value), ...participantPhoneCandidates(value)].filter(Boolean).map(clean))];
const queues = new WeakMap();

export async function isRequestBotAdmin(conn, group) {
  const botIds = new Set([conn.user?.id, conn.user?.lid, conn.user?.phoneNumber].filter(Boolean).map(clean));
  for (const id of [...botIds]) {
    try {
      const mapping = conn.signalRepository?.lidMapping;
      const alias = id.endsWith('@lid') ? await mapping?.getPNForLID?.(id) : await mapping?.getLIDForPN?.(id);
      if (alias) botIds.add(clean(alias));
    } catch {}
  }
  const metadata = await conn.groupMetadata(group);
  return (metadata.participants || []).some(p => ids(p).some(id => botIds.has(id)) && Boolean(p.admin || p.isAdmin || p.isSuperAdmin));
}

export async function checkJoinRequest(conn, group, request) {
  if (!getAntiFakeConfig(group).enabled) return { decision: 'approve' };
  const result = await checkAntiFakeParticipant(conn, group, request);
  return { decision: !result.known ? 'pending' : result.allowed ? 'approve' : 'reject', result };
}

// Todas as decisões do bot passam pela mesma fila por conexão/grupo.
export function processJoinRequests(conn, group, options = {}) {
  let groups = queues.get(conn);
  if (!groups) queues.set(conn, groups = new Map());
  const previous = groups.get(group) || Promise.resolve();
  const current = previous.catch(() => {}).then(() => decide(conn, group, options));
  groups.set(group, current);
  const clear = () => { if (groups.get(group) === current) groups.delete(group); };
  current.then(clear, clear);
  return current;
}

async function decide(conn, group, { limit = Infinity, targets, rejectOnly = false, action = 'approve', actor = clean(conn.user?.id) } = {}) {
  if (!['approve', 'reject'].includes(action)) throw Error('Decisão de solicitação inválida.');
  if (!await isRequestBotAdmin(conn, group)) throw Error('Preciso ser ADM para analisar solicitações.');
  const pending = await conn.groupRequestParticipantsList(group);
  if (!Array.isArray(pending)) throw Error('Não foi possível consultar as solicitações.');
  const selected = pending.filter(p => !targets || targets.some(t => ids(t).some(id => ids(p).includes(id)))).slice(0, limit);
  const report = { approved: [], rejected: [], unknown: [], failed: [], skipped: [], remaining: pending.length };
  const buckets = { reject: [], approve: [] };
  const seen = new Set();
  for (const request of selected) {
    const jid = requestJid(request);
    if (!jid || seen.has(clean(jid))) continue;
    seen.add(clean(jid));
    // Rejeições de captcha por erro/expiração não precisam aprovar o telefone.
    const policy = action === 'reject' ? { decision: 'reject' } : await checkJoinRequest(conn, group, request);
    if (policy.decision === 'pending') { report.unknown.push(jid); continue; }
    if (rejectOnly && policy.decision !== 'reject') { report.skipped.push(jid); continue; }
    buckets[policy.decision].push(request);
  }
  // Recusa os estrangeiros antes de qualquer aprovação.
  for (const decision of ['reject', 'approve']) {
    const requests = buckets[decision];
    for (let offset = 0; offset < requests.length; offset += 20) {
      const batch = requests.slice(offset, offset + 20);
      // Revalida a regra imediatamente antes de enviar aprovações.
      const safe = [];
      for (const request of batch) {
        if (decision === 'approve') {
          const policy = await checkJoinRequest(conn, group, request);
          if (policy.decision !== 'approve') { report.unknown.push(requestJid(request)); continue; }
        }
        safe.push(request);
      }
      if (!safe.length) continue;
      if (!await isRequestBotAdmin(conn, group)) {
        report.failed.push(...safe.map(requestJid), ...requests.slice(offset + 20).map(requestJid));
        continue;
      }
      const jids = safe.map(requestJid);
      try {
        const results = await conn.groupRequestParticipantsUpdate(group, jids, decision);
        const success = [];
        for (const request of safe) {
          const jid = requestJid(request);
          const row = (results || []).find(r => ids(r).some(id => ids(request).includes(id))) || (safe.length === 1 && results?.length === 1 ? results[0] : null);
          if (row && String(row.status) === '200') success.push(jid);
          else report.failed.push(jid);
        }
        report[decision === 'approve' ? 'approved' : 'rejected'].push(...success);
        if (success.length) {
          const notices = recordX9Decision(group, success, actor, decision);
          try { await conn.kobayashiX9Notify?.(group, notices); } catch (error) { console.error('[Solicitações X9]', error?.message); }
          addAdminLog(group, { type: decision === 'approve' ? 'request_approve' : 'request_reject', actor, detail: `${success.length} solicitação(ões) ${decision === 'approve' ? 'aprovada(s)' : 'recusada(s)'}` });
        }
      } catch (error) {
        console.error('[Solicitações]', decision, error?.message);
        report.failed.push(...jids);
      }
      if (offset + 20 < requests.length) await new Promise(resolve => setTimeout(resolve, 250));
    }
  }
  report.remaining = Math.max(0, pending.length - report.approved.length - report.rejected.length);
  return report;
}

export async function handleAntiFakeRequest(conn, event) {
  if (event?.action !== 'created' || !event.id?.endsWith('@g.us') || !getAntiFakeConfig(event.id).enabled) return;
  if (!event.participant) return;
  return processJoinRequests(conn, event.id, { targets: [event.participant], rejectOnly: true });
}
