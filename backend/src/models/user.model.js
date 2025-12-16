import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as crypto from "node:crypto";

const UserSchema = new Schema (
    {
        username: {
            type: String,
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
            enum: ["admin", "staff", "customer"],
            default: "customer"
        },
        isEmailVerified: {
                type: Boolean,
                default: false
            },
        refreshToken: {
            type: String
        },
        forgotPasswordToken: {
            type: String,
        },
        forgotPasswordExpiry: {
            type: Date
        },
        emailVerificationToken: {
            type: String,
        },
        emailVerificationExpiry: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// pre function — async hook without `next` to avoid callback misuse
UserSchema.pre("save", async function() {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// add methods 
UserSchema.methods.isPasswordCorrect = async function(enteredPassword){
    // this gives true or false as it compares and check, password same or not.
    return await bcrypt.compare(enteredPassword, this.password)
}

// Access Token
UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
}

// Refresh Token
UserSchema.methods.generateRefreshtoken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}

// 
UserSchema.methods.generateTemporaryToken = function(){
    const unHashedToken = crypto.randomBytes(20).toString("hex");

    const hashedToken = crypto
        .createHash('sha256')
        .update(unHashedToken)
        .digest("hex")
    
    const tokenExpiry = Date.now() + (20*60*1000) // 20 mins
    return {unHashedToken, hashedToken, tokenExpiry}
}

export const User = mongoose.model("User", UserSchema);