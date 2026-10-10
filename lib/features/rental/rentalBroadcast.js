export function selectRentalBroadcastGroups(groups,rentals,now=Date.now()) {
 const eligible=new Set(rentals.filter(r=>r.permanent||Number(r.expiresAt)>now).map(r=>r.groupJid));
 return Object.entries(groups||{}).filter(([jid])=>eligible.has(jid)&&jid.endsWith('@g.us'));
}
