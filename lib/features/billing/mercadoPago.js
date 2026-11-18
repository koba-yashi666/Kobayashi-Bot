const ROOT='https://api.mercadopago.com';
export async function mpRequest(token,route,{body,method='GET',idempotency,fetchImpl=fetch}={}){
 if(!token)throw Error('Configure /mptoken no privado do criador.');
 const r=await fetchImpl(ROOT+route,{method,redirect:'error',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json',...(idempotency?{'X-Idempotency-Key':idempotency}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(15000)});
 if(!r.ok)throw Error(`Mercado Pago recusou a operação (HTTP ${r.status}). Nenhum aluguel foi liberado.`);
 const text=await r.text();if(text.length>1000000)throw Error('Resposta do Mercado Pago excedeu o limite.');return JSON.parse(text);
}
export function confirmedPayment(order,payment,collector){
 return String(payment.id)===String(order.paymentId)&&payment.status==='approved'&&payment.payment_method_id==='pix'&&payment.currency_id==='BRL'&&payment.external_reference===order.id&&Math.round(Number(payment.transaction_amount)*100)===order.cents&&String(payment.collector_id)===String(collector)&&payment.live_mode===true&&Number(payment.transaction_amount_refunded||0)===0;
}
export function pixBody(order,email){return {transaction_amount:order.cents/100,description:`Kobayashi • ${order.days} dias • ${order.quantity} grupo(s)`,payment_method_id:'pix',payer:{email},external_reference:order.id,date_of_expiration:new Date(order.expiresAt).toISOString()};}
