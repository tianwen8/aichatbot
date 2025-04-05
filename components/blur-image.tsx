"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@dub/utils";

export default function BlurImage({
  src,
  alt,
  width,
  height,
  className,
  ...props
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  [key: string]: any;
}) {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        "transition-all duration-200",
        isLoading ? "scale-110 blur-md" : "scale-100 blur-0",
        className
      )}
      onLoadingComplete={() => setLoading(false)}
      {...props}
    />
  );
} 