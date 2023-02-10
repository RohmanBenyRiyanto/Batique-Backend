import { verify } from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import {
    response401,
    response403,
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

//validate role admin
export const verifyAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.status(403).json(response403("Token is not valid"));
            }
            const userFound = await UserModel.findOne({ where: { id: user.id } });
            if (userFound.role === "admin") {
                req.user = user;
                next();
            } else {
                return res.status(403).json(response403("You are not authorized"));
            }
        });
    } else {
        return res.status(401).json(response401("You are not authenticated"));
    }
};

//validate role superadmin
export const verifySuperAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.status(403).json(response403("Token is not valid"));
            }
            const userFound = await UserModel.findOne({ where: { id: user.id } });
            if (userFound.role === "superadmin") {
                req.user = user;
                next();
            } else {
                return res.status(403).json(response403("You are not authorized"));
            }
        });
    } else {
        return res.status(401).json(response401("You are not authenticated"));
    }
};

//validate role superadmin and admin
export const verifySuperAdminAndAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.status(403).json(response403("Token is not valid"));
            }
            const userFound = await UserModel.findOne({ where: { id: user.id } });
            if (userFound.role === "superadmin" || userFound.role === "admin") {
                req.user = user;
                next();
            } else {
                return res.status(403).json(response403("You are not authorized"));
            }
        });
    } else {
        return res.status(401).json(response401("You are not authenticated"));
    }
};

// validate role toko
export const verifyToko = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.status(403).json(response403("Token is not valid"));
            }
            const userFound = await UserModel.findOne({ where: { id: user.id } });
            if (userFound.role === "toko") {
                req.user = user;
                next();
            } else {
                return res.status(403).json(response403("You are not authorized"));
            }
        });
    } else {
        return res.status(401).json(response401("You are not authenticated"));
    }
};