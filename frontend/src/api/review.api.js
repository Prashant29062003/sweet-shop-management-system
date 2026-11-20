import { api } from "./client";

export const getReviews = (sweetId, page = 1, limit = 5, sort = "newest") =>
  api.get(`/sweets/${sweetId}/reviews?page=${page}&limit=${limit}&sort=${sort}`);

export const getReviewSummary = (sweetId) =>
  api.get(`/sweets/${sweetId}/reviews/summary`);

export const createReview = (sweetId, data) =>
  api.post(`/sweets/${sweetId}/reviews`, data);

export const deleteReview = (reviewId) =>
  api.delete(`/reviews/${reviewId}`);