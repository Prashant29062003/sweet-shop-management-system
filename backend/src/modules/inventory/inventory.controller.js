import { asyncHandler } from "../../utils/async-handler.js";
import { ApiResponse } from "../../utils/api-response.js";
import { Sweet } from "../sweets/sweet.model.js";

export const getInventory = asyncHandler(async (req, res) => {
  const inventory = await Sweet.find().select(
    "name quantity"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, inventory));
});
