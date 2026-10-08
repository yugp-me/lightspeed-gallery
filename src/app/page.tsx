import { Aperture, CircleDot, Crosshair, ScanLine, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { collectTags, matchesTagFilter } from "@/lib/filtering";
import { getSettings } from "@/lib/settings";
import { publicMediaUrl } from "@/lib/media";
import { Gallery, type GalleryImage } from "@/components/gallery/Gallery";

export const dynamic = "force-dynamic";

function HeroIcon({ name }: { name: string }) {
  const Icon = { aperture: Aperture, dot: CircleDot, crosshair: Crosshair, scan: ScanLine, sparkles: Sparkles }[name] ?? Aperture;
  return <Icon size={30} strokeWidth={1.4} />;
}

export default async function Home({ searchParams }: { searchParams: Promise<{ tag?: string; q?: string }> }) {
  const params = await searchParams;
  const selectedTags = params.tag?.split(",").filter(Boolean) ?? [];
  const query = params.q?.trim().toLowerCase() ?? "";
  const [settings, storedImages] = await Promise.all([getSettings(), db.image.findMany({ orderBy: { createdAt: "desc" } })]);
  const images: GalleryImage[] = storedImages
    .filter((image) => matchesTagFilter(image.tags, selectedTags))
    .filter((image) => !query || `${image.title} ${image.description} ${image.tags}`.toLowerCase().includes(query))
    .map((image) => ({ ...image, thumbUrl: publicMediaUrl("thumb", image.fileName), bigUrl: publicMediaUrl("big", image.fileName) }));
  const tags = collectTags(storedImages);

  return (
    <main style={{ "--accent": settings.accentColor, "--page-bg": settings.backgroundColor, "--hero-title": settings.heroTitleColor, "--hero-description": settings.heroDescriptionColor, "--columns-desktop": settings.desktopColumns, "--columns-tablet": settings.tabletColumns, "--columns-mobile": settings.mobileColumns, "--tile-gap": `${settings.imageSpacing}px`, "--tile-radius": `${settings.cornerRadius}px`, "--fade-duration": `${settings.fadeDuration}ms`, "--lightbox-coverage": `${settings.lightboxCoverage}vw` } as React.CSSProperties}>
      <header className="site-header shell"><Link className="brand" href="/">LS<span>/</span>GALLERY</Link><Link className="admin-link" href="/admin">Admin <span>↗</span></Link></header>
      <section className="hero shell">
        <div className="hero-icon"><HeroIcon name={settings.iconName} /></div>
        <p className="eyebrow">Photography Website</p>
        <h1>{settings.heroTitle}</h1>
        <p className="hero-description">{settings.heroDescription}</p>
      </section>
      <section className="gallery-section shell">
        <div className="gallery-toolbar"><div className="tag-list"><Link className={!selectedTags.length ? "active" : ""} href="/">All</Link>{tags.map((tag) => <Link className={selectedTags.includes(tag) ? "active" : ""} href={`/?tag=${encodeURIComponent(tag)}`} key={tag}>{tag}</Link>)}</div><form className="search-form"><Search size={16} /><input name="q" defaultValue={params.q} placeholder="Search archive" aria-label="Search archive" /></form></div>
        {images.length > 0 ? <Gallery images={images} fadeDuration={settings.fadeDuration} radius={settings.cornerRadius} /> : <div className="empty-state"><p className="eyebrow">No frames found</p><p>Try another search or clear the current filter.</p></div>}
      </section>
      <footer className="site-footer shell"><span>{settings.footerText}</span><span>{String(storedImages.length).padStart(2, "0")} Photos</span></footer>
    </main>
  );
}