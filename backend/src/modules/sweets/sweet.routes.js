import express from "express";
import {
  createSweet,
  getAllSweets,
  updateSweet,
  deleteSweet
} from "./sweet.controller.js";

import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/rbac.middleware.js";

const router = express.Router();

// Public or logged-in users
router.get(
  "/",
  verifyJWT,
  authorizeRoles("user", "admin"),
  getAllSweets
);

// Admin only
router.post(
  "/",
  verifyJWT,
  authorizeRoles("admin"),
  createSweet
);

router.put(
  "/:id",
  verifyJWT,
  authorizeRoles("admin"),
  updateSweet
);

router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles("admin"),
  deleteSweet
);

export default router;
