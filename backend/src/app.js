import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// cors configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);



// import routes
import healthCheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import sweetRoutes from "./modules/sweets/sweet.routes.js";
import inventoryRoutes from "./modules/inventory/inventory.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import adminRouter from "./modules/users/admin.routes.js";


// middlewares
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/sweets", sweetRoutes);
app.use("/api/v1/inventory", inventoryRoutes);



app.get("/", (req, res) => {
    res.send("Welcome to Sweet-Shop-Management-System.");
})

// attach error handler (should be last)
app.use(errorMiddleware);

export default app;