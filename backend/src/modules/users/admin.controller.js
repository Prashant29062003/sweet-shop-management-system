import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { ROLE_PERMISSIONS } from "../../utils/constants/roles.js";
import { refreshAccessToken } from "../auth/auth.controller.js";

export const createUserWithRole = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  if (!ROLE_PERMISSIONS[role]) {
    throw new ApiError(400, "Invalid role");
  }

  const exists = await User.findOne({ 
    $or: [{ email }, { username }] 
  });

  if (exists) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    email,
    username,
    password,
    role,
    isEmailVerified: true,
  });

  const safeUser = await User.findById(user._id).select(
    -password -refreshAccessToken -emailverificationToken -emailVerificationExpiry
  )

  return res.status(201).json(
    new ApiResponse(201, safeUser, "User created successfully")
  );
});

export const getAllUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password -refreshAccessToken -emailVerificationToken -emailVerificationExpiry");
  
  return res.status(200).json(
    new ApiResponse(200, users, "All users fetched successfully")
  );
});
