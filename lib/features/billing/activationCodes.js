import crypto from 'node:crypto';
import {canonical} from './storage.js';
export const CODE_TTL=7*86400000;
export const CODE_PATTERN=/^KBA-[A-F0-9]{24}$/;
export const normalizeActivationCode=value=>String(value||'').trim().toUpperCase();
export function assertActivationCode(order,code,owner,now=Date.now()){
 const value=normalizeActivationCode(code),expected=order?.activationCode;
 if(!CODE_PATTERN.test(value)||!expected||canonical(order.owner)!==canonical(owner)||expected.expiresAt<=now||!CODE_PATTERN.test(expected.code)||!crypto.timingSafeEqual(Buffer.from(value),Buffer.from(expected.code)))throw Error('Código inválido, vencido ou de outro responsável. Consulte /meuscodigos no privado.');
 if(order.sandbox||order.simulated||order.groups.length)throw Error('Código válido somente para contratação real de novos grupos.');
}
export const reservedGroups=order=>Object.keys(order.entryReservations||{});
