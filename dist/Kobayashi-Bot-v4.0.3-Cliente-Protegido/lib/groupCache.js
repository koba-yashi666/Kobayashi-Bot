/* Kobayashi Protected Distribution v4.0.3 */
import NodeCache from "\x6e\x6f\x64\x65\x2d\x63\x61\x63\x68\x65";

export const groupCache = new NodeCache({ stdTTL: 5 * 60, useClones: false });

export async function getGroupMetadata(sock, jid) {
const cached = groupCache.get(jid);
if (cached) return cached;

const metadata = await sock.groupMetadata(jid);
groupCache.set(jid, metadata);
return metadata;
}

export function bindGroupCache(sock) {
sock.ev.on("\x67\x72\x6f\x75\x70\x73\x2e\x75\x70\x64\x61\x74\x65", async ([event]) => {
try {
const metadata = await sock.groupMetadata(event.id);
groupCache.set(event.id, metadata);
} catch {}
});

sock.ev.on("\x67\x72\x6f\x75\x70\x2d\x70\x61\x72\x74\x69\x63\x69\x70\x61\x6e\x74\x73\x2e\x75\x70\x64\x61\x74\x65", async (event) => {
try {
const metadata = await sock.groupMetadata(event.id);
groupCache.set(event.id, metadata);
} catch {}
});
}
