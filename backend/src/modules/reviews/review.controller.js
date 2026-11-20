import { Review } from "../../models/review.model.js";
import { Sweet } from "../../models/sweet.model.js";
import { Payment } from "../../models/payment.model.js";
import { ApiResponse } from "../../utils/api-response.js";
import { ApiError } from "../../utils/api-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import mongoose from "mongoose";

async function recomputeSweetRating(sweetId) {
  const stats = await Review.aggregate([
    { $match: { sweet: new mongoose.Types.ObjectId(sweetId) } },
    {
      $group: {
        _id: "$sweet",
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
        dist: { $push: "$rating" },
      },
    },
  ]);

  if (!stats.length) {
    await Sweet.findByIdAndUpdate(sweetId, {
      averageRating: 0,
      reviewCount: 0,
    });
    return { averageRating: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
  }

  const { avg, count, dist } = stats[0];
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  dist.forEach((r) => {
    distribution[r] = (distribution[r] || 0) + 1;
  });

  await Sweet.findByIdAndUpdate(sweetId, {
    averageRating: Math.round(avg * 10) / 10,
    reviewCount: count,
  });

  return {
    averageRating: Math.round(avg * 10) / 10,
    count,
    distribution,
  };
}

export const getReviews = asyncHandler(async (req, res) => {
  const { sweetId } = req.params;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const skip = (page - 1) * limit;
  const sort = req.query.sort || "newest";

  let sortOption = { createdAt: -1 };
  if (sort === "rating_high") sortOption = { rating: -1, createdAt: -1 };
  if (sort === "rating_low") sortOption = { rating: 1, createdAt: -1 };

  const sweet = await Sweet.findById(sweetId);
  if (!sweet) throw new ApiError(404, "Sweet not found");

  const [reviews, total] = await Promise.all([
    Review.find({ sweet: sweetId })
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate("user", "username email"),
    Review.countDocuments({ sweet: sweetId }),
  ]);

  return res.json(
    new ApiResponse(
      200,
      {
        reviews,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        },
      },
      "Reviews fetched successfully"
    )
  );
});

export const getReviewSummary = asyncHandler(async (req, res) => {
  const { sweetId } = req.params;
  const sweet = await Sweet.findById(sweetId);
  if (!sweet) throw new ApiError(404, "Sweet not found");

  const stats = await Review.aggregate([
    { $match: { sweet: sweet._id } },
    {
      $group: {
        _id: "$sweet",
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
        dist: { $push: "$rating" },
      },
    },
  ]);

  if (!stats.length) {
    return res.json(
      new ApiResponse(200, { averageRating: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }, "Summary fetched")
    );
  }

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  stats[0].dist.forEach((r) => {
    distribution[r] = (distribution[r] || 0) + 1;
  });

  return res.json(
    new ApiResponse(
      200,
      {
        averageRating: Math.round(stats[0].avg * 10) / 10,
        count: stats[0].count,
        distribution,
      },
      "Summary fetched"
    )
  );
});

export const createReview = asyncHandler(async (req, res) => {
  const { sweetId } = req.params;
  const { rating, title, comment } = req.body;

  const sweet = await Sweet.findById(sweetId);
  if (!sweet) throw new ApiError(404, "Sweet not found");

  const numRating = Number(rating);
  if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
    throw new ApiError(400, "Rating must be an integer between 1 and 5");
  }

  // Verified purchase check
  const hasPurchase = await Payment.exists({
    user: req.user._id,
    "items.sweet": sweetId,
    status: "success",
  });

  const review = await Review.findOneAndUpdate(
    { user: req.user._id, sweet: sweetId },
    {
      $set: {
        rating: numRating,
        title: (title || "").trim().slice(0, 80),
        comment: (comment || "").trim().slice(0, 1000),
        isVerifiedPurchase: Boolean(hasPurchase),
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).populate("user", "username email");

  await recomputeSweetRating(sweetId);

  return res
    .status(201)
    .json(new ApiResponse(201, review, "Review submitted successfully"));
});

export const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, "Review not found");

  const isOwner = String(review.user) === String(req.user._id);
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "Not allowed to delete this review");
  }

  const sweetId = review.sweet;
  await Review.findByIdAndDelete(reviewId);
  await recomputeSweetRating(sweetId);

  return res.json(new ApiResponse(200, {}, "Review deleted successfully"));
});