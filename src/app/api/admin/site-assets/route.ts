import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin, isSameOrigin } from "@/lib/auth";
import { siteAssetsDirectory, siteAssetUrl, type SiteAssetKind } from "@/lib/siteAssets";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdmin()) || !isSameOrigin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const kind = String(form.get("kind")) as SiteAssetKind;
  const file = form.get("file");
  if ((kind !== "favicon" && kind !== "og") || !(file instanceof File) || file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "Invalid site asset." }, { status: 400 });
  const input = Buffer.from(await file.arrayBuffer());
  const isIco = file.type === "image/x-icon" || /\.ico$/i.test(file.name);
  const info = isIco ? null : await sharp(input).metadata();
  if (!isIco && (!info?.format || !["jpeg", "png", "webp"].includes(info.format))) return NextResponse.json({ error: "Use a PNG, JPEG, WebP, or ICO image." }, { status: 400 });
  await fs.mkdir(siteAssetsDirectory, { recursive: true });
  const format = isIco ? "ico" : info!.format;
  const fileName = `${kind}-${crypto.randomUUID()}.${format === "jpeg" ? "jpg" : format}`;
  const target = path.join(siteAssetsDirectory, fileName);
  await fs.writeFile(target, input);
  const data = kind === "favicon" ? { faviconFileName: fileName } : { ogImageFileName: fileName };
  const settings = await db.siteSettings.update({ where: { id: 1 }, data });
  return NextResponse.json({ settings, url: siteAssetUrl(kind, fileName) });
}