import {codeInstructions} from './activation.js';
import {PLANS,money} from './storage.js';
export function paymentReceipt(order){
 if(order.localTest||order.status!=='approved'||order.sandbox||order.simulated)return null;
 const plan=PLANS[order.days]?.name||'Plano de aluguel';
 const message=`Olá! Realizei o pagamento da Kobayashi Bot.\nPlano: ${plan} (${order.days} dias)\nQuantidade: ${order.quantity} grupo(s)\nValor total: ${money(order.cents)}\nPedido: ${order.id}${order.referral?'\nIndicação: '+order.referral.code:''}\nVou anexar o comprovante e os links dos grupos.`;
 const link='https://wa.me/5515997075304?text='+encodeURIComponent(message);
 return `✅ *PIX APROVADO*\nPlano: ${plan} • ${order.days} dias\nGrupos: ${order.quantity}\nTotal: ${money(order.cents)}\nPedido: ${order.id}\n\n${order.groups?.length?'Renovação aplicada aos grupos selecionados. Envie o comprovante ao criador para conferência.':order.automaticActivation?(order.activationCode?codeInstructions(order):'Seu pagamento foi confirmado. Gere o código no privado: /gerarcodigo '+order.id):'Para ativar, abra o contato do criador abaixo e envie a mensagem preenchida. Anexe o comprovante e os links dos grupos. A ativação será feita manualmente pelo criador.'}\n\n📲 *Enviar comprovante ao criador:*\n${link}\n\nO comprovante deve ser anexado por você no WhatsApp.`;
}
