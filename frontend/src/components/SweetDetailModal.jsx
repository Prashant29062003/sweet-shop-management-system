import React, { useState, useEffect } from "react";

import { Card, Button, Badge, Alert, Input } from "../components";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";
import {
  getReviews,
  getReviewSummary,
  createReview,
} from "../api/review.api";

const SweetDetailModal = ({ sweet, onClose }) => {
  if (!sweet) return null;

  const images =
    Array.isArray(sweet.images) && sweet.images.length
      ? sweet.images
      : sweet.imageUrl || sweet.image
      ? [sweet.imageUrl || sweet.image]
      : [`https://placehold.co/800x600?text=${encodeURIComponent(sweet.name)}`];

  const [activeIndex, setActiveIndex] = useState(0);
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewSort, setReviewSort] = useState("newest");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
  }, [sweet?._id]);

  useEffect(() => {
    if (!sweet?._id) return;
    let cancelled = false;
    (async () => {
      try {
        const [s, r] = await Promise.all([
          getReviewSummary(sweet._id),
          getReviews(sweet._id, 1, 5, reviewSort),
        ]);
        if (cancelled) return;
        setSummary(s);
        setReviews(r?.reviews || []);
      } catch (err) {
        if (!cancelled) setReviewError(err.message || "Failed to load reviews");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sweet?._id, reviewSort]);

  const goPrev = () =>
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % images.length);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
    if (e.key === "Escape") onClose();
  };

  return (
    <Modal isOpen={!!sweet} onClose={onClose} size="xl" title={null}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 -m-6">
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

            {/* Rating summary */}
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 text-lg">
                  {"★".repeat(Math.round(summary?.averageRating || sweet.averageRating || 0))}
                  {"☆".repeat(5 - Math.round(summary?.averageRating || sweet.averageRating || 0))}
                </span>
                <span className="text-sm text-gray-600">
                  {(summary?.averageRating || sweet.averageRating || 0).toFixed(1)}{" "}
                  ({summary?.count || sweet.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            {/* Reviews */}
            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Reviews</h3>
                <select
                  className="text-xs border rounded px-2 py-1"
                  value={reviewSort}
                  onChange={(e) => setReviewSort(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="rating_high">Highest</option>
                  <option value="rating_low">Lowest</option>
                </select>
              </div>

              {reviewError && <Alert variant="error">{reviewError}</Alert>}

              {reviewLoading && (
                <p className="text-sm text-gray-500">Loading reviews...</p>
              )}

              {!reviewLoading && reviews.length === 0 && (
                <p className="text-sm text-gray-500">No reviews yet. Be the first!</p>
              )}

              <div className="max-h-48 overflow-y-auto space-y-3 pr-1">
                {reviews.map((r) => (
                  <div key={r._id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800">
                        {r.user?.username || "Anonymous"}
                      </span>
                      <span className="text-xs text-amber-500">
                        {"★".repeat(r.rating)}
                        {"☆".repeat(5 - r.rating)}
                      </span>
                    </div>
                    {r.title && (
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {r.title}
                      </p>
                    )}
                    {r.comment && (
                      <p className="text-sm text-gray-600 mt-1">{r.comment}</p>
                    )}
                    {r.isVerifiedPurchase && (
                      <span className="text-xs text-green-600 mt-1 inline-block">
                        ✓ Verified purchase
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Write review */}
              {user ? (
                <div className="pt-2">
                  {!showReviewForm ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowReviewForm(true)}
                    >
                      Write a review
                    </Button>
                  ) : (
                    <div className="space-y-2 border rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Rating:</span>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setReviewRating(n)}
                            className={`text-lg ${
                              n <= reviewRating ? "text-amber-500" : "text-gray-300"
                            }`}
                            aria-label={`Rate ${n} stars`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <Input
                        placeholder="Title (optional)"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                      />
                      <textarea
                        className="w-full border rounded-md p-2 text-sm"
                        rows="3"
                        placeholder="Share your thoughts..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          disabled={submittingReview}
                          onClick={async () => {
                            setSubmittingReview(true);
                            try {
                              await createReview(sweet._id, {
                                rating: reviewRating,
                                title: reviewTitle,
                                comment: reviewComment,
                              });
                              setShowReviewForm(false);
                              setReviewTitle("");
                              setReviewComment("");
                              const [s, r] = await Promise.all([
                                getReviewSummary(sweet._id),
                                getReviews(sweet._id, 1, 5, reviewSort),
                              ]);
                              setSummary(s);
                              setReviews(r?.reviews || []);
                            } catch (err) {
                              setReviewError(err.message || "Failed to submit review");
                            } finally {
                              setSubmittingReview(false);
                            }
                          }}
                        >
                          {submittingReview ? "Submitting..." : "Submit"}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setShowReviewForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  <a href="/login" className="text-amber-700 hover:underline">
                    Log in
                  </a>{" "}
                  to write a review.
                </p>
              )}
            </div>
          </div>
        </div>
    </Modal>
  );
};

export default SweetDetailModal;