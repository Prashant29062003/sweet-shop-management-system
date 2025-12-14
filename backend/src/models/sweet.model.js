import mongoose from "mongoose";
import { PERMISSIONS, TaskStatusEnum, AvailableTaskStatuses } from "../utils/constants/permissions.js";

// sub-schema for tracking production tasks related to the sweet
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: AvailableTaskStatuses,
        default: TaskStatusEnum.TODO,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
    },
    dueDate: {
        type: Date,
    },
}, { timestamps: true });

// Main Sweet Schema
const sweetSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        quantityInStock: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: Number.isInteger,
                message: "Inventory quantity must be an integer",
            },
        },
        // Array of tasks associated with this sweet (e.g., "Bake new batch", "Package for shipping")
        productionTasks: [taskSchema],

        lastUpdatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        lastUpdatedByPermission: {
            type: String,
            enum: Object.values(PERMISSIONS), 
            required: false,
        },
    },
    { timestamps: true }
);

sweetSchema.index({ name: 1 });
sweetSchema.index({ price: 1 });

export const Sweet = mongoose.model("Sweet", sweetSchema);