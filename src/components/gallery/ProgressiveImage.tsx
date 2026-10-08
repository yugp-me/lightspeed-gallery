"use client";

import Image from "next/image";
import { useState } from "react";

type ProgressiveImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  fadeDuration: number;
  radius: number;
};

export function ProgressiveImage({ src, alt, width, height, fadeDuration, radius }: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 25vw"
      loading="lazy"
      onLoad={() => setLoaded(true)}
      style={{
        opacity: loaded ? 1 : 0,
        borderRadius: `${radius}px`,
        transition: `opacity ${fadeDuration}ms ease, transform 500ms cubic-bezier(.2,.8,.2,1)`,
      }}
    />
  );
}