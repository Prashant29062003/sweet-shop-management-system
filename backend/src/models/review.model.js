import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sweet: {
      type: Schema.Types.ObjectId,
      ref: "Sweet",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ sweet: 1, createdAt: -1 });
reviewSchema.index({ user: 1, sweet: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);