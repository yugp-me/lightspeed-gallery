import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { safeFileName } from "@/lib/media";
import { siteAssetsDirectory, siteAssetKinds } from "@/lib/siteAssets";

const contentTypes: Record<string, string> = { ico: "image/x-icon", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp" };

export async function GET(_request: Request, { params }: { params: Promise<{ kind: string; fileName: string }> }) {
  const { kind, fileName } = await params;
  if (!siteAssetKinds.includes(kind as typeof siteAssetKinds[number]) || safeFileName(fileName) !== fileName) return new NextResponse("Not found", { status: 404 });
  try {
    const file = await fs.readFile(path.join(siteAssetsDirectory, fileName));
    const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
    return new NextResponse(file, { headers: { "Content-Type": contentTypes[extension] ?? "application/octet-stream", "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch { return new NextResponse("Not found", { status: 404 }); }
}