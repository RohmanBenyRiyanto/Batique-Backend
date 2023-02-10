import express from "express";
import {
    getAllUsers,
    getCurrentUser,
    register,
    login,
    logout,
    updateUser,
} from '../controller/UserController.js';
import { refreshToken } from "../controller/RefreshToken.js";
import { verifyToken } from '../middleware/TokenMiddleware.js';
import { verifyAdmin } from '../middleware/UserMiddleware.js';

const router = express.Router();

router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.get("/users/current", verifyToken, getCurrentUser);
router.post("/users", register);
router.post("/login", login);
router.get("/users/refreshtoken", refreshToken);
router.delete("/users/logout", logout);
router.patch("/users/update", verifyToken, updateUser);


export default router;