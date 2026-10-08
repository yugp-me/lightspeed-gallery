import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin, isSameOrigin } from "@/lib/auth";
import { derivativeFileName, mediaDirectories, safeFileName } from "@/lib/media";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ images: await db.image.findMany({ orderBy: { createdAt: "desc" } }) });
}

export async function POST(request: Request) {
  if (!(await isAdmin()) || !isSameOrigin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size > 25 * 1024 * 1024) return NextResponse.json({ error: "Use an image smaller than 25MB." }, { status: 400 });
  const input = Buffer.from(await file.arrayBuffer());
  const info = await sharp(input).metadata();
  const supportedFormats = new Set(["jpeg", "png", "webp", "avif"]);
  if (!info.width || !info.height || !info.format || !supportedFormats.has(info.format)) return NextResponse.json({ error: "Use a JPEG, PNG, WebP, or AVIF image." }, { status: 400 });
  await Promise.all(Object.values(mediaDirectories).map((directory) => fs.mkdir(directory, { recursive: true })));
  const extension = info.format === "jpeg" ? "jpg" : info.format;
  const fileName = `${crypto.randomUUID()}.${extension}`;
  const derivativeName = derivativeFileName(fileName);
  const originalName = safeFileName(file.name);
  try {
    await fs.writeFile(path.join(mediaDirectories.original, fileName), input);
    await sharp(input).resize({ width: 900, withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(mediaDirectories.thumb, derivativeName));
    await sharp(input).resize({ width: 2200, withoutEnlargement: true }).webp({ quality: 88 }).toFile(path.join(mediaDirectories.big, derivativeName));
    const image = await db.image.create({ data: { fileName, originalName, mimeType: `image/${info.format === "jpeg" ? "jpeg" : info.format}`, width: info.width, height: info.height, title: String(form.get("title") ?? originalName), description: String(form.get("description") ?? ""), tags: String(form.get("tags") ?? ""), iso: String(form.get("iso") ?? ""), shutterSpeed: String(form.get("shutterSpeed") ?? ""), aperture: String(form.get("aperture") ?? ""), camera: String(form.get("camera") ?? ""), lens: String(form.get("lens") ?? ""), focalLength: String(form.get("focalLength") ?? "") } });
    return NextResponse.json({ image });
  } catch {
    await Promise.all([path.join(mediaDirectories.original, fileName), path.join(mediaDirectories.thumb, derivativeName), path.join(mediaDirectories.big, derivativeName)].map((filePath) => fs.rm(filePath, { force: true })));
    return NextResponse.json({ error: "The image could not be processed." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin()) || !isSameOrigin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json().catch(() => ({}));
  const image = await db.image.findUnique({ where: { id } });
  if (!image) return NextResponse.json({ error: "Image not found" }, { status: 404 });
  await db.image.delete({ where: { id } });
  await Promise.all([fs.rm(path.join(mediaDirectories.original, image.fileName), { force: true }), fs.rm(path.join(mediaDirectories.thumb, derivativeFileName(image.fileName)), { force: true }), fs.rm(path.join(mediaDirectories.big, derivativeFileName(image.fileName)), { force: true })]);
  return NextResponse.json({ ok: true });
}

export async function PUT(request: Request) {
  if (!(await isAdmin()) || !isSameOrigin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  if (!body.id) return NextResponse.json({ error: "Missing image id" }, { status: 400 });
  const image = await db.image.update({ where: { id: body.id }, data: { title: String(body.title ?? ""), description: String(body.description ?? ""), tags: String(body.tags ?? ""), iso: String(body.iso ?? ""), shutterSpeed: String(body.shutterSpeed ?? ""), aperture: String(body.aperture ?? ""), camera: String(body.camera ?? ""), lens: String(body.lens ?? ""), focalLength: String(body.focalLength ?? "") } });
  return NextResponse.json({ image });
}