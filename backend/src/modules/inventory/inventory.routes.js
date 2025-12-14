import express from "express";
import { getInventory } from "../inventory/inventory.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/rbac.middleware.js";

const router = express.Router();

router.get(
  "/",
  verifyJWT,
  authorizeRoles("admin"),
  getInventory
);

export default router;
