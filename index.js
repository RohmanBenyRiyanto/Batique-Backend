import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import db from "./src/config/Database.js";
import cors from "cors";
import UserRoute from "./src/routes/UserRoute.js";
import AuthRoute from "./src/routes/AuthRoute.js";
import AlamatRoute from "./src/routes/AlamatRoute.js";


dotenv.config();
const app = express();

try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
    // await db.sync({ alter: true });
} catch (error) {
    console.error("Unable to connect to the database:", error);
}



app.use(cors());
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(UserRoute);
app.use(AuthRoute);
app.use(AlamatRoute);

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running...');
});