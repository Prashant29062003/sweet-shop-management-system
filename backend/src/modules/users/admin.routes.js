import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { checkPermission } from "../../middlewares/permission.middleware.js";
import { PERMISSIONS } from "../../utils/constants/permissions.js";
import {
  createUserWithRole,
  getAllUsers,
  getDashboardStats,
  deleteUser,
  updateUserRole,
} from "./admin.controller.js";

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
);

router.get(
  "/dashboard-stats",
  verifyJWT,
  checkPermission(PERMISSIONS.MANAGE_USERS),
  getDashboardStats
);

router.post(
  "/create-user",
  verifyJWT,
  checkPermission(PERMISSIONS.MANAGE_USERS),
  createUserWithRole
);

router.route("/users/:userId")
  .delete(verifyJWT, checkPermission(PERMISSIONS.MANAGE_USERS), deleteUser)


router.patch(
  "/users/:userId/role",
  verifyJWT,
  checkPermission(PERMISSIONS.MANAGE_USERS),
  updateUserRole
)


export default router;
