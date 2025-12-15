import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { checkPermission } from "../../middlewares/permission.middleware.js";
import { PERMISSIONS } from "../../utils/constants/permissions.js";
import { createUserWithRole, getAllUsers } from "./admin.controller.js";

const router = Router();

router.post(
  "/create-user",
  verifyJWT,
  checkPermission(PERMISSIONS.MANAGE_USERS),
  createUserWithRole
);

router.get(
  "/users",
  verifyJWT,
  checkPermission(PERMISSIONS.MANAGE_USERS),
  getAllUsers
)

export default router;
