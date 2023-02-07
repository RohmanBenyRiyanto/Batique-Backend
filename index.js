import express from "express";
import dotenv from "dotenv";
import db from "./src/config/Database.js";
import cookieParser from "cookie-parser";
import UserRoute from "./src/routes/UserRoute.js";

dotenv.config();
const app = express();

try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
} catch (error) {
    console.error("Unable to connect to the database:", error);
}

app.use(cors({
    Credentials: true,
    origin: "*",
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(UserRoute);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});