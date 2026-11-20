import { api } from "./client";

export const getSweets = (page = 1, limit = 9, search = "", category = "all", sort = "newest") =>
  api.get(
    `/sweets?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&sort=${encodeURIComponent(sort)}`
  );

export const createSweet = (data) => api.post("/sweets", data);

export const updateSweet = (id, data) => api.put(`/sweets/${id}`, data);

export const updateInventory = (id, data) =>
  api.patch(`/sweets/${id}/inventory`, data);

export const getSweetById = (id) => api.get(`/sweets/${id}`);