import React, { useState, useEffect } from "react";

import { Card, Button, Badge } from "../components";

const SweetDetailModal = ({ sweet, onClose }) => {
  if (!sweet) return null;

  const images =
    Array.isArray(sweet.images) && sweet.images.length
      ? sweet.images
      : sweet.imageUrl || sweet.image
      ? [sweet.imageUrl || sweet.image]
      : [`https://placehold.co/800x600?text=${encodeURIComponent(sweet.name)}`];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [sweet?._id]);

  const goPrev = () =>
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % images.length);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <Card className="w-full max-w-5xl relative animate-in fade-in zoom-in duration-200 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-800 font-semibold text-xl rounded-full border border-gray-200 hover:bg-gray-100 w-9 h-9 flex items-center justify-center"
          aria-label="Close preview"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Carousel */}
          <div className="bg-gray-100 p-4 md:p-6 flex flex-col">
            <div className="relative flex-1 flex items-center justify-center min-h-[260px]">
              <img
                src={images[activeIndex]}
                alt={`${sweet.name} ${activeIndex + 1}`}
                className="max-h-[360px] w-full object-contain rounded-lg transition-opacity duration-200"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/800x600?text=Sweet";
                }}
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-9 h-9 flex items-center justify-center shadow"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-9 h-9 flex items-center justify-center shadow"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                  <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-1 rounded-full">
                    {activeIndex + 1} / {images.length}
                  </span>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition ${
                      idx === activeIndex
                        ? "border-amber-500"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img
                      src={src}
                      alt={`${sweet.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/100x100?text=Sweet";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 space-y-4">
            <Badge variant="info" className="mb-2">
              {sweet.category || "Confectionery"}
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900">{sweet.name}</h2>
            <p className="text-gray-600">{sweet.description}</p>

            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Price per unit:</span>
                <span className="font-bold text-amber-700 text-xl">
                  ₹{sweet.price}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Available Stock:</span>
                <span
                  className={`font-bold ${
                    sweet.quantityInStock < 10
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {sweet.quantityInStock} units
                </span>
              </div>
            </div>

            <Button onClick={onClose} className="w-full mt-6">
              Close Preview
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SweetDetailModal;