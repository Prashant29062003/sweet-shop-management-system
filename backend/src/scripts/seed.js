import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import { Sweet } from "../models/sweet.model.js";
import { USER_ROLES } from "../utils/constants/roles.js";

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  console.log("Connected to DB");

  // Clear old data
  await User.deleteMany();
  await Sweet.deleteMany();

  // Users
  const admin = await User.create({
    email: "admin@sweetshop.com",
    password: "admin123",
    role: USER_ROLES.ADMIN,
    username: "adminuser"
  });

  const staff = await User.create({
    email: "staff@sweetshop.com",
    password: "staff123",
    role: USER_ROLES.STAFF,
    username: "staffuser"
  });

  const user = await User.create({
    email: "user@sweetshop.com",
    password: "user123",
    role: USER_ROLES.USER,
    username: "regularuser"
  });

  // Sweet
  await Sweet.create({
    name: "Gulab Jamun",
    description: "Milk-solid-based sweet",
    price: 20,
    quantityInStock: 100,
    lastUpdatedBy: admin._id,
  });

  console.log("Seed complete");
  process.exit();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
