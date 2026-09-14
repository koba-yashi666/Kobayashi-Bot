/* Kobayashi Protected Distribution v4.0.3 */
import fs from "\x6e\x6f\x64\x65\x3a\x66\x73\x2f\x70\x72\x6f\x6d\x69\x73\x65\x73";
import fsSync from "\x6e\x6f\x64\x65\x3a\x66\x73";
import path from "\x6e\x6f\x64\x65\x3a\x70\x61\x74\x68";
import os from "\x6e\x6f\x64\x65\x3a\x6f\x73";
import ffmpeg from "\x66\x6c\x75\x65\x6e\x74\x2d\x66\x66\x6d\x70\x65\x67";
import webp from "\x6e\x6f\x64\x65\x2d\x77\x65\x62\x70\x6d\x75\x78";

function tmpFile(ext) {
  return path.join(os.tmpdir(), `kobayashi-sticker-${Date.now()}-${Math.floor(Math.random()*1e6)}.${ext}`);
}

function detectImageExtension(buf) {
  if (buf?.length >= 12) {
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return "\x70\x6e\x67";
    if (buf[0] === 0xFF && buf[1] === 0xD8) return "\x6a\x70\x67";
    if (buf.slice(0,4).toString() === "\x52\x49\x46\x46" && buf.slice(8,12).toString() === "\x57\x45\x42\x50") return "\x77\x65\x62\x70";
  }
  return "\x6a\x70\x67";
}

export async function convertToWebp(mediaBuffer, { isVideo=false, forceSquare=true } = {}) {
  if (!Buffer.isBuffer(mediaBuffer) || mediaBuffer.length < 10) {
    throw new Error("\x42\x75\x66\x66\x65\x72\x20\x64\x65\x20\x6d\xed\x64\x69\x61\x20\x69\x6e\x76\xe1\x6c\x69\x64\x6f");
  }

  if (!isVideo &&
      mediaBuffer.slice(0,4).toString() === "\x52\x49\x46\x46" &&
      mediaBuffer.slice(8,12).toString() === "\x57\x45\x42\x50") {
    return mediaBuffer;
  }

  const inputExt = isVideo ? "\x6d\x70\x34" : detectImageExtension(mediaBuffer);
  const inputPath = tmpFile(inputExt);
  await fs.writeFile(inputPath, mediaBuffer);

  const vfBase = forceSquare
    ? "\x73\x63\x61\x6c\x65\x3d\x33\x32\x30\x3a\x33\x32\x30"
    : "\x73\x63\x61\x6c\x65\x3d\x33\x32\x30\x3a\x33\x32\x30\x3a\x66\x6f\x72\x63\x65\x5f\x6f\x72\x69\x67\x69\x6e\x61\x6c\x5f\x61\x73\x70\x65\x63\x74\x5f\x72\x61\x74\x69\x6f\x3d\x64\x65\x63\x72\x65\x61\x73\x65\x2c\x70\x61\x64\x3d\x33\x32\x30\x3a\x33\x32\x30\x3a\x28\x6f\x77\x2d\x69\x77\x29\x2f\x32\x3a\x28\x6f\x68\x2d\x69\x68\x29\x2f\x32\x3a\x63\x6f\x6c\x6f\x72\x3d\x30\x78\x30\x30\x30\x30\x30\x30\x30\x30\x2c\x66\x6f\x72\x6d\x61\x74\x3d\x72\x67\x62\x61";

  const filters = isVideo ? `${vfBase},fps=15` : vfBase;

  const MAX_SIZE = 990000;
  const MIN_QUALITY = isVideo ? 15 : 25;
  let quality = isVideo ? 45 : 75;
  let result = null;

  try {
    for (let attempt=0; attempt<8; attempt++) {
      const outPath = tmpFile("\x77\x65\x62\x70");

      try {
        const options = [
          "\x2d\x76\x66", filters,
          "\x2d\x63\x3a\x76", "\x6c\x69\x62\x77\x65\x62\x70",
          "\x2d\x6c\x6f\x73\x73\x6c\x65\x73\x73", "0",
          "\x2d\x63\x6f\x6d\x70\x72\x65\x73\x73\x69\x6f\x6e\x5f\x6c\x65\x76\x65\x6c", "6",
          "\x2d\x70\x72\x65\x73\x65\x74", "\x64\x65\x66\x61\x75\x6c\x74",
          ...(isVideo
            ? ["\x2d\x71\x3a\x76", String(quality), "\x2d\x6c\x6f\x6f\x70", "0", "\x2d\x61\x6e", "\x2d\x76\x73\x79\x6e\x63", "0", "-t", "\x39\x2e\x39"]
            : ["\x2d\x71\x3a\x76", String(quality)])
        ];

        await new Promise((resolve,reject)=>{
          ffmpeg(inputPath)
            .outputOptions(options)
            .format("\x77\x65\x62\x70")
            .on("\x65\x6e\x64",resolve)
            .on("\x65\x72\x72\x6f\x72",reject)
            .save(outPath);
        });

        const stat=await fs.stat(outPath).catch(()=>null);
        if (!stat?.size) throw new Error("\x53\x61\xed\x64\x61\x20\x57\x45\x42\x50\x20\x76\x61\x7a\x69\x61");

        result=await fs.readFile(outPath);

        if (result.length <= MAX_SIZE || quality <= MIN_QUALITY) {
          break;
        }

        const ratio=result.length/MAX_SIZE;
        if (ratio>1.5) quality=Math.max(MIN_QUALITY,Math.floor(quality*0.6));
        else if (ratio>1.2) quality=Math.max(MIN_QUALITY,Math.floor(quality*0.75));
        else quality=Math.max(MIN_QUALITY,quality-10);
      } finally {
        try { await fs.unlink(outPath); } catch {}
      }
    }
  } finally {
    try { await fs.unlink(inputPath); } catch {}
  }

  if (!result?.length) throw new Error("\x46\x61\x6c\x68\x61\x20\x61\x6f\x20\x67\x65\x72\x61\x72\x20\x66\x69\x67\x75\x72\x69\x6e\x68\x61");
  return result;
}

export async function applyStickerMetadata(webpBuffer, {
  userNick="\x55\x73\x75\xe1\x72\x69\x6f",
  groupName="\x50\x72\x69\x76\x61\x64\x6f",
  botName="\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x42\x6f\x74",
  creatorName="\x4b\x6f\x62\x61\x79\x61\x73\x68\x69",
  packName=null,
  publisher=null,
  packId="\x6b\x6f\x62\x61\x79\x61\x73\x68\x69\x2d\x62\x6f\x74",
  emojis=["🐉","🌸"]
} = {}) {
  try {
    const img=new webp.Image();
    await img.load(webpBuffer);

    const cleanUser=String(userNick || "\x55\x73\x75\xe1\x72\x69\x6f").trim();
    const cleanBot=String(botName || "\x4b\x6f\x62\x61\x79\x61\x73\x68\x69\x20\x42\x6f\x74").trim();
    const cleanCreator=String(creatorName || "\x4b\x6f\x62\x61\x79\x61\x73\x68\x69").trim();
    const finalPack=packName || `🐉 Kobayashi • Sticker Atelier`;
    const finalPublisher=publisher || `🌸 ${cleanUser} • via ${cleanBot}`;

    const metadata={
      "\x73\x74\x69\x63\x6b\x65\x72\x2d\x70\x61\x63\x6b\x2d\x69\x64":String(packId || "\x6b\x6f\x62\x61\x79\x61\x73\x68\x69\x2d\x62\x6f\x74"),
      "\x73\x74\x69\x63\x6b\x65\x72\x2d\x70\x61\x63\x6b\x2d\x6e\x61\x6d\x65":String(finalPack).slice(0, 128),
      "\x73\x74\x69\x63\x6b\x65\x72\x2d\x70\x61\x63\x6b\x2d\x70\x75\x62\x6c\x69\x73\x68\x65\x72":String(finalPublisher).slice(0, 128),
      "\x65\x6d\x6f\x6a\x69\x73":Array.isArray(emojis) && emojis.length ? emojis.slice(0, 8) : ["🐉","🌸"]
    };

    const jsonBuff=Buffer.from(JSON.stringify(metadata),"\x75\x74\x66\x38");
    const exifAttr=Buffer.from([
      0x49,0x49,0x2A,0x00,
      0x08,0x00,0x00,0x00,
      0x01,0x00,0x41,0x57,
      0x07,0x00,0x00,0x00,
      0x00,0x00,0x16,0x00,
      0x00,0x00
    ]);

    const exif=Buffer.concat([exifAttr,jsonBuff]);
    exif.writeUIntLE(jsonBuff.length,14,4);
    img.exif=exif;
    return await img.save(null);
  } catch {
    return webpBuffer;
  }
}

export async function makeSticker(mediaBuffer, {
  isVideo=false,
  forceSquare=true,
  metadata={}
} = {}) {
  let output=await convertToWebp(mediaBuffer,{isVideo,forceSquare});
  output=await applyStickerMetadata(output,metadata);
  return output;
}
