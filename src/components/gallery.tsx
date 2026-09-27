"use client";

import Image from "next/image";
import { useState } from "react";
import { isRemote } from "./product-card";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  if (!images.length) return <div className="aspect-[3/4] bg-chalk" />;
  return (
    <div className="grid gap-3 sm:grid-cols-[4.5rem_1fr]">
      {images.length > 1 && (
        <div className="no-scrollbar order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-pressed={i === active}
              className={`relative aspect-[3/4] w-16 shrink-0 overflow-hidden bg-chalk sm:w-full ${i === active ? "ring-2 ring-ink ring-offset-2" : "opacity-70 hover:opacity-100"}`}
            >
              <Image src={src} alt="" fill sizes="72px" unoptimized={isRemote(src)} className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className={`relative order-1 aspect-[3/4] overflow-hidden bg-chalk sm:order-2 ${images.length > 1 ? "" : "sm:col-span-2"}`}>
        <Image
          key={images[active]}
          src={images[active]}
          alt={alt}
          fill
          priority
          unoptimized={isRemote(images[active])}
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
