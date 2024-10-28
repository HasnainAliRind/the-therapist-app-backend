import express from "express";
import initWebRoutes from "./routes/web.js";
import cors from "cors";


let app = express();

app.use(cors());

app.use((req, res, next) => {
    if (req.originalUrl === "/webhook") {
        next(); // Skip the JSON parsing middleware for /webhook route
    } else {
        express.json()(req, res, next); // Use express.json() for other routes
    }
}); // General JSON parsing middleware

initWebRoutes(app);


app.listen(8083, () => {
    console.log("Backend is running at http://localhost:8081....");
});