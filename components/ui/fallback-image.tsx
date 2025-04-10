"use client";

import { useState } from "react";
import Image from "next/image";

interface FallbackImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
}

/**
 * A component that displays an image with a fallback for when the image fails to load
 */
export default function FallbackImage({
  src,
  alt,
  className,
  width,
  height,
  fallbackSrc = "/placeholder-logo.png",
}: FallbackImageProps) {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? fallbackSrc : src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={() => setError(true)}
    />
  );
} 