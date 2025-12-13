import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as crypto from crypto;

const UserSchema = new Schema (
    {
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    fullname: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
    },
    {
        timestamps: true
    }
);

export const user = mongoose.model("User", UserSchema);