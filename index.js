import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import db from "./src/config/Database.js";
import UserRoute from "./src/routes/UserRoute.js";
import cors from "cors";

dotenv.config();
const app = express();

try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
} catch (error) {
    console.error("Unable to connect to the database:", error);
}


// app.use(
//     cors({
//         // origin: ['http://localhost:3000'],
//         credentials: true
//     })
// );
app.use(cors());
// static files on public folder
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(UserRoute);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});