import express from "express";

const app = express();

// import routes
import healthcheckRouter from "./routes/healthcheck.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import sweetRoutes from "./modules/sweets/sweet.routes.js";
import inventoryRoutes from "./modules/inventory/inventory.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

// middlewares
app.use(express.json());
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/sweets", sweetRoutes);
app.use("/api/v1/inventory", inventoryRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to Sweet-Shop-Management-System.");
})

// attach error handler (should be last)
app.use(errorMiddleware);

export default app;