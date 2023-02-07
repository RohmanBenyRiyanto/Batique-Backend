import { verify } from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import {
    response,
    response200,
    response201,
    response400,
    response401,
    response403,
    response404,
    response409,
    response500,
} from "../utils/Response.js";


//validate role user
export const verifyUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.status(403).json(response403("Token is not valid"));
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json(response401("You are not authenticated"));
    }
};