import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        sweet: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Sweet",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },

    method: {
      type: String,
      enum: ["upi", "card", "netbanking", "cash"],
      required: true,
    },

    provider: {
      type: String,
      enum: ["razorpay", "stripe", "manual"],
      default: "manual",
    },

    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },

    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
