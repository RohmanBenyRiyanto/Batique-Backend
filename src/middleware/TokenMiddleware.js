import jwt from "jsonwebtoken";
import {
    response401,
    response403,
} from "../utils/Response.js";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json(response401("You are not authenticated"));
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json(response403("Invalid access token"));
        req.email = decoded.email;
        next();
    })
}