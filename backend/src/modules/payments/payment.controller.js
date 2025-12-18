import { Payment } from "../../models/payment.model.js";
import { Sweet } from "../../models/sweet.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";

export const createPayment = asyncHandler(async (req, res) => {
  const { amount, method, items } = req.body;
  const userId = req.user._id;

  if (!amount || amount <= 0) {
    throw new ApiError(400, "Invalid payment amount");
  }

  if(!items || items.length === 0){
    throw new ApiError(400, "No items find in order.");
  }

  for(const item of items){
    const sweet = await Sweet.findById(item.sweetId);
    if(!sweet){
        throw new ApiError(404, `Sweet with ID ${item.sweetId} not found.`);
    }
    if(sweet.quantityInStock < item.quantity){
        throw new ApiError(400, `Insufficient stock for sweet: ${sweet.name}. Available: ${sweet.quantityInStock}, Requested: ${item.quantity}`);
    }
  }

  const payment = await Payment.create({
    user: userId,
    amount,
    method,
    status: "success",
    items: items.map((item) => ({
      sweet: item.sweetId,
      quantity: item.quantity
    })),
  });

  await User.findByIdAndUpdate(userId, {
    $push: { payments: payment._id },
  });

  if (items && items.length > 0) {
    await Promise.all(
      items.map((item) =>
        Sweet.findByIdAndUpdate(
          item.sweetId,
          { $inc: { quantityInStock: -item.quantity } },
          { new: true }
        )
      )
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, payment, "Payment recorderd successfully"));
});

export const getUserPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, payments, "User payments fetched successfully"));
});

export const adminGetAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate("user", "username email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        payments,
        "All payments fetched successfully for admin"
      )
    );
});

export const adminUpdatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { status } = req.body;

  const payment = await Payment.findByIdAndUpdate(
    paymentId,
    { $set: { status } },
    { new: true }
  );

  if (!payment) {
    throw new ApiError(404, "Payment record not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, payment, "Payment status updated successfully"));
});
