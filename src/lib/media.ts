import path from "node:path";

export const mediaRoot = path.join(process.cwd(), "photos");
export const mediaDirectories = {
  original: path.join(mediaRoot, "og"),
  thumb: path.join(mediaRoot, "thumbs"),
  big: path.join(mediaRoot, "big"),
};

export function publicMediaUrl(kind: "thumb" | "big", fileName: string) {
  const derivativeName = kind === "thumb" || kind === "big" ? `${fileName.replace(/\.[^.]+$/, "")}.webp` : fileName;
  return `/api/media/${kind}/${encodeURIComponent(derivativeName)}`;
}

export function derivativeFileName(fileName: string) {
  return `${fileName.replace(/\.[^.]+$/, "")}.webp`;
}

export function safeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}