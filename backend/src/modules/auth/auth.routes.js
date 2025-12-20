import {Router} from "express";
import { refreshAccessToken, registerUser, logoutUser, forgotPasswordRequest, resetForgotPassword, changeCurrntPassword, getCurrentUser, verifyEmail, loginUser, googleSignIn } from "./auth.controller.js";
import { validate } from "../../middlewares/validator.middleware.js";

import { userChangeCurrentPasswordValidator, userForgotPasswordValidator, userLoginValidator, userRegisterValidator, userResetForgotPasswordVaidator } from "../../validators/index.js";

import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, loginUser);
router.route("/google").post(googleSignIn);

router.route(`/verify-email/:verificationToken`).get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router  
    .route("/forgot-password")
    .post(userForgotPasswordValidator(), validate , forgotPasswordRequest)

router
    .route("/reset-password/:resetToken")
    .post(userResetForgotPasswordVaidator() , validate , resetForgotPassword)

// secure routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, getCurrentUser)
router.route("/change-password").post(verifyJWT, userChangeCurrentPasswordValidator(), validate, changeCurrntPassword)


export default router;