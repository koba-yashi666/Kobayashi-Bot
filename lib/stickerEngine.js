import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import os from "node:os";
import ffmpeg from "fluent-ffmpeg";
import webp from "node-webpmux";

function tmpFile(ext) {
  return path.join(os.tmpdir(), `kobayashi-sticker-${Date.now()}-${Math.floor(Math.random()*1e6)}.${ext}`);
}

function detectImageExtension(buf) {
  if (buf?.length >= 12) {
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return "png";
    if (buf[0] === 0xFF && buf[1] === 0xD8) return "jpg";
    if (buf.slice(0,4).toString() === "RIFF" && buf.slice(8,12).toString() === "WEBP") return "webp";
  }
  return "jpg";
}

export async function convertToWebp(mediaBuffer, { isVideo=false, forceSquare=true } = {}) {
  if (!Buffer.isBuffer(mediaBuffer) || mediaBuffer.length < 10) {
    throw new Error("Buffer de mídia inválido");
  }

  if (!isVideo &&
      mediaBuffer.slice(0,4).toString() === "RIFF" &&
      mediaBuffer.slice(8,12).toString() === "WEBP") {
    return mediaBuffer;
  }

  const inputExt = isVideo ? "mp4" : detectImageExtension(mediaBuffer);
  const inputPath = tmpFile(inputExt);
  await fs.writeFile(inputPath, mediaBuffer);

  const vfBase = forceSquare
    ? "scale=320:320"
    : "scale=320:320:force_original_aspect_ratio=decrease,pad=320:320:(ow-iw)/2:(oh-ih)/2:color=0x00000000,format=rgba";

  const filters = isVideo ? `${vfBase},fps=15` : vfBase;

  const MAX_SIZE = 990000;
  const MIN_QUALITY = isVideo ? 15 : 25;
  let quality = isVideo ? 45 : 75;
  let result = null;

  try {
    for (let attempt=0; attempt<8; attempt++) {
      const outPath = tmpFile("webp");

      try {
        const options = [
          "-vf", filters,
          "-c:v", "libwebp",
          "-lossless", "0",
          "-compression_level", "6",
          "-preset", "default",
          ...(isVideo
            ? ["-q:v", String(quality), "-loop", "0", "-an", "-vsync", "0", "-t", "9.9"]
            : ["-q:v", String(quality)])
        ];

        await new Promise((resolve,reject)=>{
          ffmpeg(inputPath)
            .outputOptions(options)
            .format("webp")
            .on("end",resolve)
            .on("error",reject)
            .save(outPath);
        });

        const stat=await fs.stat(outPath).catch(()=>null);
        if (!stat?.size) throw new Error("Saída WEBP vazia");

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

  if (!result?.length) throw new Error("Falha ao gerar figurinha");
  return result;
}

export async function applyStickerMetadata(webpBuffer, {
  userNick="Usuário",
  groupName="Privado",
  botName="Kobayashi Bot",
  creatorName="Kobayashi",
  packName=null,
  publisher=null,
  packId="kobayashi-bot",
  emojis=["🐉","🌸"]
} = {}) {
  try {
    const img=new webp.Image();
    await img.load(webpBuffer);

    const cleanUser=String(userNick || "Usuário").trim();
    const cleanBot=String(botName || "Kobayashi Bot").trim();
    const cleanCreator=String(creatorName || "Kobayashi").trim();
    const finalPack=packName || `🐉 Kobayashi • Sticker Atelier`;
    const finalPublisher=publisher || `🌸 ${cleanUser} • via ${cleanBot}`;

    const metadata={
      "sticker-pack-id":String(packId || "kobayashi-bot"),
      "sticker-pack-name":String(finalPack).slice(0, 128),
      "sticker-pack-publisher":String(finalPublisher).slice(0, 128),
      "emojis":Array.isArray(emojis) && emojis.length ? emojis.slice(0, 8) : ["🐉","🌸"]
    };

    const jsonBuff=Buffer.from(JSON.stringify(metadata),"utf8");
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
