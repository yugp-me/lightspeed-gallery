"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";
import type { GalleryImage } from "@/components/gallery/Gallery";

export function Lightbox({ images, index, onClose, onChange, radius }: { images: GalleryImage[]; index: number; onClose: () => void; onChange: (index: number) => void; radius: number }) {
  const image = images[index];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onChange((index - 1 + images.length) % images.length);
      if (event.key === "ArrowRight") onChange((index + 1) % images.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKeyDown); };
  }, [images.length, index, onChange, onClose]);

  const metadata = [["ISO", image.iso], ["Shutter", image.shutterSpeed], ["Aperture", image.aperture], ["Camera", image.camera], ["Lens", image.lens], ["Focal", image.focalLength]].filter(([, value]) => value);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={image.title} onClick={(event) => event.target === event.currentTarget && onClose()}>
      <button className="icon-button lightbox-close" onClick={onClose} aria-label="Close image"><X size={20} /></button>
      <button className="icon-button lightbox-prev" onClick={() => onChange((index - 1 + images.length) % images.length)} aria-label="Previous image"><ChevronLeft size={24} /></button>
      <figure className="lightbox-figure">
        <Image src={image.bigUrl} alt={image.title} width={image.width} height={image.height} sizes="94vw" priority style={{ borderRadius: `${radius}px` }} />
        <figcaption className="image-info">
          <div><p className="eyebrow">{image.title}</p><p>{image.description}</p></div>
          {metadata.length > 0 && <dl>{metadata.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>}
        </figcaption>
        {image.tags && <div className="image-tags">{image.tags.split(",").map((tag) => <span key={tag}>{tag.trim()}</span>)}</div>}
      </figure>
      <button className="icon-button lightbox-next" onClick={() => onChange((index + 1) % images.length)} aria-label="Next image"><ChevronRight size={24} /></button>
    </div>
  );
}