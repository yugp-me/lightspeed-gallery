import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin, isSameOrigin } from "@/lib/auth";
import { defaultSettings } from "@/lib/settings";

export async function GET() { if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); return NextResponse.json({ settings: await db.siteSettings.upsert({ where: { id: 1 }, create: { id: 1, ...defaultSettings }, update: {} }) }); }
export async function PUT(request: Request) {
  if (!(await isAdmin()) || !isSameOrigin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const settings = await db.siteSettings.update({ where: { id: 1 }, data: { accentColor: String(body.accentColor ?? defaultSettings.accentColor), backgroundColor: String(body.backgroundColor ?? defaultSettings.backgroundColor), heroTitle: String(body.heroTitle ?? defaultSettings.heroTitle), heroDescription: String(body.heroDescription ?? defaultSettings.heroDescription), heroTitleColor: String(body.heroTitleColor ?? defaultSettings.heroTitleColor), heroDescriptionColor: String(body.heroDescriptionColor ?? defaultSettings.heroDescriptionColor), footerText: String(body.footerText ?? defaultSettings.footerText), iconName: ["aperture", "dot", "crosshair", "scan", "sparkles"].includes(String(body.iconName)) ? String(body.iconName) : defaultSettings.iconName, desktopColumns: Math.max(1, Math.min(6, Number(body.desktopColumns) || defaultSettings.desktopColumns)), tabletColumns: Math.max(1, Math.min(5, Number(body.tabletColumns) || defaultSettings.tabletColumns)), mobileColumns: Math.max(1, Math.min(3, Number(body.mobileColumns) || defaultSettings.mobileColumns)), cornerRadius: Math.max(0, Math.min(30, Number(body.cornerRadius) || 0)), fadeDuration: Math.max(0, Math.min(3000, Number(body.fadeDuration) || defaultSettings.fadeDuration)), lightboxCoverage: Math.max(60, Math.min(98, Number(body.lightboxCoverage) || defaultSettings.lightboxCoverage)), imageSpacing: Math.max(0, Math.min(60, Number(body.imageSpacing) || defaultSettings.imageSpacing)) } });
  return NextResponse.json({ settings });
}