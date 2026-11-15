// Lê somente a mensagem atual. Citações não contam como marcações do autor.
export function inspectSentinelMentions(message = {}) {
  const wrappers = ['ephemeralMessage','viewOnceMessage','viewOnceMessageV2','viewOnceMessageV2Extension','documentWithCaptionMessage','deviceSentMessage'];
  const seen = new Set();
  for(let depth=0;depth<12 && message && !seen.has(message);depth++) {
    seen.add(message);
    const inner=wrappers.map(key=>message[key]?.message).find(Boolean);
    if(inner){message=inner;continue;}
    const mentions=new Set();
    for(const node of Object.values(message).slice(0,64)) {
      const ids=node?.contextInfo?.mentionedJid;
      if(!Array.isArray(ids))continue;
      for(const id of ids.slice(0,4096)) {
        if(typeof id==='string' && /^\d+(?::\d+)?@(s\.whatsapp\.net|lid)$/.test(id))mentions.add(id.replace(/:\d+(?=@)/,''));
      }
    }
    return {count:mentions.size,type:Object.keys(message).find(k=>k.endsWith('Message'))||'unknown'};
  }
  return {count:0,type:'unknown'};
}
