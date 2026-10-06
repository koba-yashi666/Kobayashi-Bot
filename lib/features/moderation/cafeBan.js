export const CAFE_BAN_LID='267104301375529@lid';
const canonical=value=>String(value||'').replace(/:\d+(?=@)/,'');
export function canUseCafeBan({key={},rawSender='',sender='',participants=[]}={}) {
 // Apenas identidade do autor do evento. Nunca aceita LID de citação ou menção.
 const ids=[key.participant,key.participantAlt,rawSender].map(canonical);
 if(ids.includes(CAFE_BAN_LID))return true;
 const author=participants.find(p=>[p.id,p.jid,p.phoneNumber,p.lid].map(canonical).filter(Boolean).some(x=>x===canonical(rawSender)||x===canonical(sender)));
 return !!author&&[author.id,author.jid,author.lid].map(canonical).includes(CAFE_BAN_LID);
}
