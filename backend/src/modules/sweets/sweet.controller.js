import { Sweet } from "../../models/sweet.model.js";
import { ApiResponse } from "../../utils/api-response.js";
import { ApiError } from "../../utils/api-error.js";
import { asyncHandler } from "../../utils/async-handler.js";

/**
 * CREATE SWEET
 * Permission: CREATE_SWEET
 */
export const createSweet = asyncHandler(async (req, res) => {
  const { name, description, price, quantityInStock, imageUrl, category } = req.body;

  if (!name || price == null || quantityInStock == null) {
    throw new ApiError(400, "Missing required fields");
  }
  if (quantityInStock < 0) {
    throw new ApiError(400, "Inventory cannot be negative");
  }

  // Basic security: only allow http(s) image URLs
  if (
    imageUrl &&
    !(
      imageUrl.startsWith("http://") || imageUrl.startsWith("https://")
    )
  ) {
    throw new ApiError(400, "imageUrl must start with http:// or https://");
  }

  try {
    const sweet = await Sweet.findOneAndUpdate(
      { name },
      {
        $setOnInsert: {
          description,
          price,
          imageUrl: imageUrl || "",
          category: category || "Other",
          lastUpdatedByPermission: req.usedPermission,
        },
        $inc: { quantityInStock: Number(quantityInStock) },
      },
      { new: true, upsert: true }
    );
    if (!sweet) {
      const sweet = await Sweet.create({
        name,
        description,
        price,
        quantityInStock,
        imageUrl: imageUrl || "",
        category: category || "Other",
        lastUpdatedByPermission: req.usedPermission,
      });
      await logAudit({
        user: req.user._id,
        action: "CREATE_SWEET",
        resourceType: "Sweet",
        resourceId: sweet._id,
        permissionUsed: PERMISSIONS.CREATE_SWEET,
        metadata: { name: sweet.name },
      });

    }
    return res
      .status(201)
      .json(new ApiResponse(201, sweet, "Sweet created successfully"));
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, `Sweet "${name}" already exists`);
    }
    throw error;
  }
});

/**
 * UPDATE SWEET (non-inventory fields)
 * Permission: UPDATE_SWEET
 */
export const updateSweet = asyncHandler(async (req, res) => {
  const { sweetId } = req.params;

  const sweet = await Sweet.findByIdAndUpdate(
    sweetId,
    {
      ...req.body,
      lastUpdatedByPermission: req.usedPermission,
    },
    { new: true }
  );

  if (!sweet) {
    throw new ApiError(404, "Sweet not found");
  }

  return res.json(new ApiResponse(200, sweet, "Sweet updated successfully"));
});

/**
 * UPDATE INVENTORY ONLY
 * Permission: UPDATE_INVENTORY
 */
export const updateInventory = asyncHandler(async (req, res) => {
  const { sweetId } = req.params;

  if (!sweetId) {
    throw new ApiError(400, "Sweet ID is required");
  }

  const { quantityInStock } = req.body;

  if (quantityInStock == null) {
    throw new ApiError(400, "quantityInStock is required");
  }
  if (quantityInStock < 0) {
    throw new ApiError(400, "Inventory cannot be negative");
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

export const addProductionTask = async (req, res) => {
  const { sweetId } = req.params;
  const { title, assignedTo, dueDate } = req.body;

  const sweet = await Sweet.findById(sweetId);
  if (!sweet) throw new ApiError(404, "Sweet not found");

  sweet.productionTasks.push({
    title,
    assignedTo,
    dueDate,
  });

  await sweet.save();

  res.status(201).json({ success: true, data: sweet });
};

export const updateTaskStatus = async (req, res) => {
  const { sweetId, taskIndex } = req.params;
  const { status } = req.body;

  const sweet = await Sweet.findById(sweetId);
  const task = sweet.productionTasks[taskIndex];

  if (
    task.assignedTo.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not allowed to update this task");
  }

  task.status = status;
  await sweet.save();

  res.json({ success: true, data: task });
};

export const getLowStockSweets = async (req, res) => {
  const threshold = Number(req.query.threshold || 10);

  const sweets = await Sweet.find({
    quantityInStock: { $lte: threshold },
  });

  res.json({ success: true, data: sweets });
};

export const getSweetById = async (req, res) => {
  const { sweetId } = req.params;
  const sweet = await Sweet.findById(sweetId).populate(
    "lastUpdatedBy",
    "username email role"
  );
  if (!sweet) {
    throw new ApiError(404, "Sweet not found");
  }
  res.json({ success: true, data: sweet });
};

/**
 * GET ALL SWEETS (with search & filters)
 * Any authenticated user
 */
export const getAllSweets = asyncHandler(async (req, res) => {
  const { search, minPrice, maxPrice, inStock, all, category, sort } = req.query;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 9;
  const skip = (page - 1) * limit;

  const filter = {};

  // Name and description search (case-insensitive, sanitized to avoid regex injection)
  if (search) {
    const safeSearch = String(search).slice(0, 80).replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&");
    filter.$or = [
     { name: { $regex: safeSearch, $options: "i" } },
     { description: { $regex: safeSearch, $options: "i" } },
     { category: { $regex: safeSearch, $options: "i" } }
    ];
  };

  // Category filter
  if (category && category !== "all") {
    filter.category = category;
  }

  // Price range
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Stock filter
  if (inStock === "true") {
    filter.quantityInStock = { $gt: 0 };
  }

  const totalSweets = await Sweet.countDocuments(filter);

  let sortOption = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { price: 1 };
  else if (sort === "price_desc") sortOption = { price: -1 };
  else if (sort === "name_asc") sortOption = { name: 1 };
  else if (sort === "name_desc") sortOption = { name: -1 };

  const query = Sweet.find(filter).sort(sortOption);

  if (all !== "true") {
    query.skip(skip).limit(limit);
  }

  const sweets = await query;

  return res.json(
    new ApiResponse(
      200, {
        sweets,
        pagination: {
          totalSweets,
          totalPages: Math.ceil(totalSweets / limit),
          currentpage: page
        }
      },
      "Sweets fetched successfully"
    )
  );
});
