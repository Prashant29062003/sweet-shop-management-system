import { asyncHandler } from "../../utils/async-handler.js";
import { ApiResponse } from "../../utils/api-response.js";
import { ApiError } from "../../utils/api-error.js";
import { Sweet } from "./sweet.model.js";

export const createSweet = asyncHandler(async (req, res) => {
  const { name, price, quantity } = req.body;

  if (!name || price == null || quantity == null) {
    throw new ApiError(400, "All fields are required");
  }

  const sweet = await Sweet.create({
    name,
    price,
    quantity
  });

  return res
    .status(201)
    .json(new ApiResponse(201, sweet, "Sweet created"));
});

export const getAllSweets = asyncHandler(async (req, res) => {
  const sweets = await Sweet.find();

  return res
    .status(200)
    .json(new ApiResponse(200, sweets));
});

export const updateSweet = asyncHandler(async (req, res) => {
  const sweet = await Sweet.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!sweet) {
    throw new ApiError(404, "Sweet not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, sweet, "Sweet updated"));
});

export const deleteSweet = asyncHandler(async (req, res) => {
  const sweet = await Sweet.findByIdAndDelete(req.params.id);

  if (!sweet) {
    throw new ApiError(404, "Sweet not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Sweet deleted"));
});
