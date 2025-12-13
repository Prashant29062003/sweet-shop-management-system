import express from "express";

const app = express();

// import routes
import healthcheckRouter from "./routes/healthcheck.routes.js";
app.use("/api/v1/healthcheck", healthcheckRouter);

app.get("/", (req, res) => {
    res.send("Welcome to Sweet-Shop-Management-System.");
})

export default app;