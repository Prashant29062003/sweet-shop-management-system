import app from "./app.js";
import dotnev, { config } from 'dotenv';
dotnev.config({path: '.env'});
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 8000;
connectDB()
    .then(() => (
        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}/`)
        })
    ))
    .catch((err) => {
        console.log(`Failed to connect to database. Server not started.\nReason: ${err}`);
        process.exit(1);
    })