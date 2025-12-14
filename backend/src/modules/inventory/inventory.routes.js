import express from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { checkPermission } from "../../middlewares/permission.middleware.js";
import { PERMISSIONS } from "../../utils/constants/permissions.js";
import { getInventory } from "./inventory.controller.js";

const router = express.Router();

/**
 * VIEW INVENTORY
 */
router.get(
  "/",
  verifyJWT,
  checkPermission(PERMISSIONS.VIEW_INVENTORY),
  getInventory
);

export default router;
