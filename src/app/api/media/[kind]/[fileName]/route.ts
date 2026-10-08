import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { mediaDirectories, safeFileName } from "@/lib/media";

const contentTypes: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif" };

export async function GET(_request: Request, { params }: { params: Promise<{ kind: string; fileName: string }> }) {
  const { kind, fileName } = await params;
  if (kind !== "thumb" && kind !== "big") return new NextResponse("Not found", { status: 404 });
  if (safeFileName(fileName) !== fileName) return new NextResponse("Not found", { status: 404 });
  try {
    const directory = kind === "thumb" ? mediaDirectories.thumb : mediaDirectories.big;
    const file = await fs.readFile(path.join(directory, fileName));
    const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
    return new NextResponse(file, { headers: { "Content-Type": contentTypes[extension] ?? "application/octet-stream", "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}