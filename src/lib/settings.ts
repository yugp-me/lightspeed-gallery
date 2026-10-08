import { db } from "@/lib/db";

export const defaultSettings = {
  accentColor: "#6464ff",
  backgroundColor: "#11110f",
  heroTitle: "Lightspeed Gallery",
  heroDescription: "A collection of the best photos I've taken.",
  heroTitleColor: "#f4f1e8",
  heroDescriptionColor: "#a8a79e",
  footerText: "© 20XX Name. All rights reserved.",
  iconName: "aperture",
  desktopColumns: 4,
  tabletColumns: 3,
  mobileColumns: 2,
  cornerRadius: 3,
  fadeDuration: 650,
  lightboxCoverage: 94,
  imageSpacing: 14,
};

export async function getSettings() {
  return db.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1, ...defaultSettings },
    update: {},
  });
}