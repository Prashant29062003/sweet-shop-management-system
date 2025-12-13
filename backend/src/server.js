import app from "./app.js";
import dotnev from 'dotenv';
dotnev.config({path: './.env'});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});