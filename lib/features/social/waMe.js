export function buildWaMeLink(jid,text='') {
 const raw=String(jid||'').replace(/:\d+(?=@)/,'');
 if(!raw.endsWith('@s.whatsapp.net'))return null;
 const number=raw.split('@')[0];
 if(!/^\d{8,15}$/.test(number))return null;
 const message=String(text||'').trim();
 return `https://wa.me/${number}${message?'?text='+encodeURIComponent(message):''}`;
}
