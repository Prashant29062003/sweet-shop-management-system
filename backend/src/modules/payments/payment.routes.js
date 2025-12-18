  import { Router } from "express";
  import { verifyJWT } from "../../middlewares/auth.middleware.js";
  import { checkPermission } from "../../middlewares/permission.middleware.js";
  import { PERMISSIONS } from "../../utils/constants/permissions.js";
  import {
    createPayment,
    getUserPayments,
    adminGetAllPayments,
    adminUpdatePaymentStatus,
  } from "./payment.controller.js";

  const router = Router();

  router.use(verifyJWT);

  router.route("/").post(createPayment).get(getUserPayments);

  // Admin Only
  router.route("/admin/all")
      .get(checkPermission(PERMISSIONS.MANAGE_USERS), adminGetAllPayments);

  router.route("/admin/:paymentId/status")
      .patch(checkPermission(PERMISSIONS.MANAGE_USERS), adminUpdatePaymentStatus);

  export default router;
