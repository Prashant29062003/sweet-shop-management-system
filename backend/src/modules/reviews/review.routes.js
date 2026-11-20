import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import {
  getReviews,
  getReviewSummary,
  createReview,
  deleteReview,
} from "./review.controller.js";

const router = Router();

router.get("/sweets/:sweetId/reviews", getReviews);
router.get("/sweets/:sweetId/reviews/summary", getReviewSummary);

router.post("/sweets/:sweetId/reviews", verifyJWT, createReview);

router.delete("/reviews/:reviewId", verifyJWT, deleteReview);

export default router;