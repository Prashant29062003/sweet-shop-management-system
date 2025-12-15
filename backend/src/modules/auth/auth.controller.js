import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { ApiError } from "../../utils/api-error.js";
import { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail } from "../../utils/mail.js";
// import jwt from "jsonwebtoken";
// import * as crypto from "node:crypto";
// import bcrypt from "bcrypt";
import { User } from "../../models/user.model.js";
import { ROLE_PERMISSIONS } from "../../utils/constants/roles.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found while generating tokens.");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshtoken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("JWT GENERATION ERROR:", error);
    throw new ApiError(
      500,
      "Something went wrong while generating access token.",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exits.", []);
  }

  const user = await User.create({
    email,
    password,
    username,
    role: "customer",
    isEmailVerified: false,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
    ),
  });

  //   if we don't want just use this using '-' and furhter any property or method
  const safeUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  if (!safeUser) {
    throw new ApiError(500, "Something went wrong while registering a user.");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createUser },
        "User registered successfully and verifcation email has been sent on you email.",
      ),
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User does not exists.");
  }

  if (!user) {
    throw new ApiError(400, "User does not exist.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid credentials.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  if (!loggedInUser) {
    throw new ApiError(500, "Something went wrong while logging in.");
  }

  const options = {
    httpOnly: true,
    // secure: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully.",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    // secure: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );
    if(!user){
        throw new ApiError(404, "User not found");
    }

    const permissions = ROLE_PERMISSIONS[user.role] || [];

    const userWithPermissions = {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        permissions
    }
  return res
    .status(200)
    .json(new ApiResponse(200, userWithPermissions, "current user fetched successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    throw new ApiError(400, "Emial verification token is missing.");
  }

  let hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "token is invalid or expired");
  }

  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  user.isEmailVerified = true;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          isEmailVerified: true
        },
        "Email is verified"
      )
    )
});

const resendEmailVerification = asyncHandler (async (req,res)=> {
  const user = await User.findById(req.user?._id);

  if(!user) {
    throw new ApiError(404, "User doesn't exist")
  }
  if(user.isEmailVerified){
    throw new ApiError(409, "Email is already verified")
  }

  const {unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Please verify you email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
    )
  });

  return res  
    .status(200)
    .json(
      new ApiResponse(
        200, 
        {},
        "Mail has been sent to your email id."
      )
    )

})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if(!incomingRefreshToken){
    throw new ApiError(401, "Unauthorized access")
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.User.findById(decodedToken?._id);
    if(!user){
      throw new ApiError(401, "Invalid refresh token");
    }
    
    if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiError(401, "Refresh token is expired.");
    }


    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };

    const {accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);


    await user.save()

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {accessToken, refreshToken: newRefreshToken} ,
          "Access token refreshed"
        )
      )
  } catch (error) {
      throw new ApiError(401, "Invalid refresh token.");
  }
});

const forgotPasswordRequest = asyncHandler (async (req, res)=> {
    const {email} = req.body;
  const user = await User.findOne({email});

  if(!user){
    throw new ApiError(404, "User doesn't exists", [])
  }
  const {unHashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken();

  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;

  await user.save({validateBeforeSave: false})

  await sendEmail({
    email: user?.email,
    subject: "Password reset request",
    mailgenContent: forgotPasswordMailgenContent(
      user.username,
      `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`
    )
  })

  return res
    .status(200)
    .json(
      new ApiResponse(
        200, {}, "Password reset mail has been sent on your mail"
      )
    )
})

const resetForgotPassword = asyncHandler (async (req, res) => {
  const {resetToken} = req.params
  const {newPassword} = req.body

  let hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: {$gt: Date.now()}
  })

  if(!user){
    throw new ApiError(489, "token is invalid or expired")
  }

  user.forgotPasswordExpiry = undefined
  user.forgotPasswordToken = undefined
  user.password = newPassword

  await user.save({validateBeforeSave: false})

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password reset succesfully."
      )
    )
})

const changeCurrntPassword = asyncHandler(async (req,res) => {
  const {oldPassword, newPassword} = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordValid = await user.isPasswordCorrect(oldPassword)

  if(!isPasswordValid){
    throw new ApiError(400, "Invalid old Password")
  }

  user.password = newPassword
  await user.save({validateBeforeSave: false})

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password changed successfully"
      )
    )
})

export { 
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    verifyEmail, 
    resendEmailVerification, 
    refreshAccessToken, 
    forgotPasswordRequest, 
    resetForgotPassword, 
    changeCurrntPassword 
};