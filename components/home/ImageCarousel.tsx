"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide functionality
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (!images || images.length === 0) return null;

  return (
    <div
      className="relative w-full h-48 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <Image
        src={images[currentImageIndex]}
        alt={`${alt} - Image ${currentImageIndex + 1}`}
        width={400}
        height={300}
        className="w-full h-full object-cover transition-opacity duration-300"
      />

      {/* Navigation Arrows - Only show if more than 1 image and on hover */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dot Indicators - Only show if more than 1 image */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToImage(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentImageIndex
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {currentImageIndex + 1}/{images.length}
        </div>
      )}
    </div>
  );
}
