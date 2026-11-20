import express from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { checkPermission } from "../../middlewares/permission.middleware.js";
import { PERMISSIONS } from "../../utils/constants/permissions.js";

import {
  getAllSweets,
  getSweetById,
  createSweet,
  updateSweet,
  updateInventory,
} from "./sweet.controller.js";

const router = express.Router();

/**
 * GET ALL SWEETS
 * Any authenticated user
 */
// Public read endpoints (no auth required)
router.get("/", getAllSweets);

router.get("/:sweetId", getSweetById);

/**
 * CREATE SWEET
 * Admin, Staff
 */
router.post(
  "/",
  verifyJWT,
  checkPermission(PERMISSIONS.CREATE_SWEET),
  createSweet
);

/**
 * UPDATE SWEET DETAILS (name, price, description)
 */
router.put(
  "/:sweetId",
  verifyJWT,
  checkPermission(PERMISSIONS.UPDATE_SWEET),
  updateSweet
);

/**
 * UPDATE INVENTORY ONLY
 */
router.patch(
  "/:sweetId/inventory",
  verifyJWT,
  checkPermission(PERMISSIONS.UPDATE_INVENTORY),
  updateInventory
);

export default router;
