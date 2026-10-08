"use client";

import { useState } from "react";
import { ProgressiveImage } from "@/components/gallery/ProgressiveImage";
import { Lightbox } from "@/components/gallery/Lightbox";

export type GalleryImage = {
  id: string;
  title: string;
  description: string;
  tags: string;
  width: number;
  height: number;
  thumbUrl: string;
  bigUrl: string;
  iso: string;
  shutterSpeed: string;
  aperture: string;
  camera: string;
  lens: string;
  focalLength: string;
};

export function Gallery({ images, fadeDuration, radius }: { images: GalleryImage[]; fadeDuration: number; radius: number }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="gallery-grid">
        {images.map((image, index) => (
          <button className="gallery-tile" key={image.id} onClick={() => setActiveIndex(index)} aria-label={`Open ${image.title}`}>
            <ProgressiveImage {...image} src={image.thumbUrl} alt={image.title} fadeDuration={fadeDuration} radius={radius} />
            <span className="tile-caption">{image.title}</span>
          </button>
        ))}
      </div>
      {activeIndex !== null && <Lightbox images={images} index={activeIndex} onClose={() => setActiveIndex(null)} onChange={setActiveIndex} radius={radius} />}
    </>
  );
}