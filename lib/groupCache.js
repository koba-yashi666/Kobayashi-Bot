import NodeCache from "node-cache";

export const groupCache = new NodeCache({ stdTTL: 5 * 60, useClones: false });

export async function getGroupMetadata(sock, jid) {
const cached = groupCache.get(jid);
if (cached) return cached;

const metadata = await sock.groupMetadata(jid);
groupCache.set(jid, metadata);
return metadata;
}

export function bindGroupCache(sock) {
sock.ev.on("groups.update", async ([event]) => {
try {
const metadata = await sock.groupMetadata(event.id);
groupCache.set(event.id, metadata);
} catch {}
});

sock.ev.on("group-participants.update", async (event) => {
try {
const metadata = await sock.groupMetadata(event.id);
groupCache.set(event.id, metadata);
} catch {}
});
}
