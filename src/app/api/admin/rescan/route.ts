import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { derivativeFileName, mediaDirectories } from "@/lib/media";
import { isAdmin, isSameOrigin } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdmin()) || !isSameOrigin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await Promise.all(Object.values(mediaDirectories).map((directory) => fs.mkdir(directory, { recursive: true })));
  const images = await db.image.findMany();
  const known = new Map(images.map((image) => [image.fileName, image]));
  const originals = (await fs.readdir(mediaDirectories.original)).filter((fileName) => /\.(jpe?g|png|webp|avif)$/i.test(fileName));
  let regenerated = 0;
  let imported = 0;
  for (const fileName of originals) {
    const original = path.join(mediaDirectories.original, fileName);
    const existing = known.get(fileName);
    let image = existing;
    if (!image) {
      const info = await sharp(original).metadata();
      if (!info.width || !info.height || !info.format) continue;
      image = await db.image.create({ data: { fileName, originalName: fileName, mimeType: `image/${info.format === "jpeg" ? "jpeg" : info.format}`, width: info.width, height: info.height, title: path.parse(fileName).name } });
      imported += 1;
    }
    const thumb = path.join(mediaDirectories.thumb, derivativeFileName(image.fileName));
    const big = path.join(mediaDirectories.big, derivativeFileName(image.fileName));
    const derivatives: Array<[string, number, number]> = [[thumb, 900, 78], [big, 2200, 88]];
    for (const [target, width, quality] of derivatives) {
      try { await sharp(target).metadata(); } catch { await sharp(original).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(target); regenerated += 1; }
    }
  }
  return NextResponse.json({ imported, regenerated });
}