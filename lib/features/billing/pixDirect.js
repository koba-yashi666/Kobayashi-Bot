// QR por pedido, com preço e expiração fixos. Não cria cadastros fictícios de pagador.
export const QR_ID=/^[a-zA-Z0-9_-]{10,100}$/;
export function pixMatches(o,p){return Boolean(p&&/^pay_[\w-]+$/.test(p.id||'')&&p.pixQrCodeId===o.pixQrCodeId&&(!o.paymentId||p.id===o.paymentId)&&p.billingType==='PIX'&&typeof p.value==='number'&&Number.isFinite(p.value)&&Math.round(p.value*100)===o.cents&&!p.deleted&&!p.chargeback&&!p.refunds?.length);}
export function validateQr(o,r){
 if(!QR_ID.test(r.id||'')||r.allowsMultiplePayments!==false||r.externalReference!==o.id)throw Error('QR Code Asaas incompatível com o pedido. Solicite conferência ao criador.');
 if(typeof r.payload!=='string'||r.payload.length<30||r.payload.length>5000||!r.payload.startsWith('000201')||!r.payload.toLowerCase().includes('br.gov.bcb.pix'))throw Error('Pix Copia e Cola não retornado corretamente.');
 if(typeof r.encodedImage!=='string'||r.encodedImage.length>700000||!/^iVBORw0KGgo[A-Za-z0-9+/=]+$/.test(r.encodedImage))throw Error('Imagem do QR Code não retornada corretamente.');
}
export function createDirectPix({store,credentials,patch,request,clock}){
 async function resume(o){
  const c=credentials(o);if(o.pixQrCodeId)return o;
  if(o.creationAttempted)throw Error('Geração Pix inconclusiva. Não repetiremos a cobrança. O criador deve conferir o pedido no Asaas: '+o.id);
  if(c.directPixBinding!==o.binding||!c.pixAddressKey)throw Error('O criador deve ativar /asaaspix ativar antes.');
  const seconds=Math.floor((o.expiresAt-clock())/1000);if(seconds<60)throw Error('Seleção vencida; inicie outro pedido.');
  patch(o,{creationAttempted:true});
  try{
   const r=await request(c,'/pix/qrCodes/static',{method:'POST',body:{addressKey:c.pixAddressKey,description:'Kobayashi '+o.days+'d '+o.quantity+' grupo(s)',value:o.cents/100,format:'ALL',expirationSeconds:seconds,allowsMultiplePayments:false,externalReference:o.id}});
   // Preserve o identificador mesmo se o provedor devolver imagem/payload inválidos.
   if(QR_ID.test(r.id||'')&&r.externalReference===o.id&&r.allowsMultiplePayments===false)patch(o,{pixQrCodeId:r.id});
   validateQr(o,r);patch(o,{qr:r.payload,qrImage:r.encodedImage,status:'pending'});return store.read().orders[o.id];
  }catch(e){patch(o,{status:'uncertain'});throw e;}
 }
 async function payment(o){
  if(!QR_ID.test(o.pixQrCodeId||''))throw Error('QR inconclusivo: o criador deve verificar o Asaas antes de prosseguir.');
  const c=credentials(o),list=await request(c,'/payments?pixQrCodeId='+encodeURIComponent(o.pixQrCodeId)+'&limit=100');
  if(!Array.isArray(list.data)||list.hasMore||list.data.length>1||list.data.some(p=>!pixMatches(o,p)))throw Error('Pagamento Pix incompatível ou ambíguo; nenhum aluguel liberado.');
  if(!list.data.length){if(o.status==='approved')throw Error('Pagamento anteriormente recebido não retornou na consulta.');return null;}
  const p=await request(c,'/payments/'+encodeURIComponent(list.data[0].id));
  if(!pixMatches(o,p)||p.id!==list.data[0].id)throw Error('Detalhes do Pix incompatíveis; nenhum aluguel liberado.');
  patch(o,{paymentId:p.id,providerStatus:p.status});return p;
 }
 async function verify(o){const p=await payment(o);
  if(p?.status==='RECEIVED')patch(o,{status:'approved'});
  else if(o.status==='approved'&&p?.status!=='RECEIVED')patch(o,{status:'review'});
  else if(o.status!=='approved')patch(o,{status:clock()>=o.expiresAt?'expired':'pending'});
  return store.read().orders[o.id];
 }
 async function cancel(o){o=await verify(o);if(o.status==='approved')throw Error('Pagamento recebido não pode ser cancelado pelo bot.');
  if(!o.cancelRequested){const r=await request(credentials(o),'/pix/qrCodes/static/'+o.pixQrCodeId,{method:'DELETE'});if(r.deleted!==true)throw Error('Remoção do QR Code não confirmada. Consulte o pedido.');patch(o,{cancelRequested:true});}
  // Segue em conciliação para cobrir Pix recebido simultaneamente ao cancelamento.
  return verify(o);
 }
 async function confirmSandbox(o){
  if(o.environment!=='sandbox'||!o.sandbox)throw Error('Simulação proibida em Produção.');
  throw Error('QR Sandbox deve ser pago por outra conta Sandbox no Asaas. Para simular apenas o menu, use /asaasteste menu. Nenhum grupo real é liberado.');
 }
 return {resume,verify,cancel,confirmSandbox};
}
