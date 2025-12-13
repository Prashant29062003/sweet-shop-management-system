import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Welcome to Sweet-Shop-Management-System.");
})

export default app;