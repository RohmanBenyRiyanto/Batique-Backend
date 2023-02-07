import express from "express";
import {
    getAllUsers,
    getCurrentUser,
    register,
    login,
    logout,
} from '../controller/UserController.js';
import { refreshToken } from "../controller/RefreshToken.js";
import { verifyToken } from '../middleware/TokenMiddleware.js';

const router = express.Router();

router.get("/users", verifyToken, getAllUsers);
router.get("/users/current", verifyToken, getCurrentUser);
router.post("/users", register);
router.post("/login", login);
router.get("/user/refreshtoken", refreshToken);
router.delete("/user/logout", logout);


export default router;