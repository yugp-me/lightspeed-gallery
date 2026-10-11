"use client";

import { useEffect, useState } from "react";
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

export function Gallery({ images, fadeDuration, radius, desktopColumns, tabletColumns, mobileColumns }: { images: GalleryImage[]; fadeDuration: number; radius: number; desktopColumns: number; tabletColumns: number; mobileColumns: number }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [columnCount, setColumnCount] = useState(desktopColumns);

  useEffect(() => {
    const updateColumns = () => setColumnCount(window.innerWidth <= 640 ? mobileColumns : window.innerWidth <= 1000 ? tabletColumns : desktopColumns);
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, [desktopColumns, mobileColumns, tabletColumns]);

  const columns = Array.from({ length: columnCount }, (_, columnIndex) => images.filter((_, imageIndex) => imageIndex % columnCount === columnIndex));
  const renderTile = (image: GalleryImage, index: number) => <button className="gallery-tile" key={image.id} onClick={() => setActiveIndex(index)} aria-label={`Open ${image.title}`}><ProgressiveImage {...image} src={image.thumbUrl} alt={image.title} fadeDuration={fadeDuration} radius={radius} /><span className="tile-caption">{image.title}</span></button>;

  return (
    <>
      <div className="gallery-grid" style={{ "--active-columns": columnCount } as React.CSSProperties}>
        {columns.map((column, columnIndex) => <div className="gallery-column" key={columnIndex}>{column.map((image) => renderTile(image, images.indexOf(image)))}</div>)}
      </div>
      {activeIndex !== null && <Lightbox images={images} index={activeIndex} onClose={() => setActiveIndex(null)} onChange={setActiveIndex} radius={radius} />}
    </>
  );
}