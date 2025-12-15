  import { Sweet } from "../../models/sweet.model.js";
  import { ApiResponse } from "../../utils/api-response.js";
  import { asyncHandler } from "../../utils/async-handler.js";

  export const getInventory = asyncHandler(async (_req, res) => {
    const inventory = await Sweet.find().select(
      "name quantityInStock price lastUpdatedByPermission"
    );

    return res.json(
      new ApiResponse(200, inventory, "Inventory fetched successfully")
    );
  });

  export const updateInventory = asyncHandler(async (req, res) => {
    const { sweetId } = req.params;
    const { quantityInStock } = req.body;
      if (quantityInStock == null) {
          throw new ApiError(400, "Missing required field: quantityInStock");
      }
      const sweet = await Sweet.findByIdAndUpdate(
          sweetId,
          {
              quantityInStock,
              lastUpdatedByPermission: req.usedPermission,
          },
          { new: true }
      );
      if (!sweet) {
          throw new ApiError(404, "Sweet not found");
      }

      return res.json(
          new ApiResponse(200, sweet, "Inventory updated successfully")
      );
  });