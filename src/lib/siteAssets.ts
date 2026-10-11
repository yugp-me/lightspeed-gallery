import path from "node:path";

export const siteAssetsDirectory = path.join(process.cwd(), "photos", "site");
export const siteAssetKinds = ["favicon", "og"] as const;
export type SiteAssetKind = typeof siteAssetKinds[number];

export function siteAssetUrl(kind: SiteAssetKind, fileName: string) {
  return `/api/site-assets/${kind}/${encodeURIComponent(fileName)}`;
}