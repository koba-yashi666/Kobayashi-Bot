const canonical=x=>String(x||'').replace(/:\d+(?=@)/,'').replace(/@c\.us$/,'@s.whatsapp.net');
export async function resolveActivityTarget({info,sender,participants=[],resolvePN}) {
 let message=info?.message||{};
 for(let i=0;i<8;i++){const inner=message.ephemeralMessage?.message||message.viewOnceMessage?.message||message.viewOnceMessageV2?.message||message.documentWithCaptionMessage?.message;if(!inner)break;message=inner;}
 const context=Object.values(message).find(x=>x?.contextInfo)?.contextInfo||{};
 const mentioned=context.mentionedJid?.[0];
 const raw=canonical(mentioned||context.participant||context.participantAlt||sender);
 const aliases=new Set([raw]);
 // participantAlt pertence à citação, não necessariamente à pessoa mencionada.
 if(!mentioned&&context.participantAlt)aliases.add(canonical(context.participantAlt));
 const member=participants.find(p=>[p.id,p.jid,p.phoneNumber,p.lid].map(canonical).some(x=>x&&aliases.has(x)));
 if(member)for(const id of [member.id,member.jid,member.phoneNumber,member.lid])if(id)aliases.add(canonical(id));
 if(resolvePN)for(const id of [...aliases])try{const pn=await resolvePN(id);if(pn)aliases.add(canonical(pn));}catch{}
 return {target:raw,aliases:[...aliases]};
}
