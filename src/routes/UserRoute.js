import express from "express";
import {
    getAllUsers,
    getCurrentUser,
    updateUser,
    deleteUser,
} from '../controller/UserController.js';
import { verifyToken } from '../middleware/TokenMiddleware.js';
import { verifyAdmin } from '../middleware/UserMiddleware.js';

const router = express.Router();

router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.get("/users/current", verifyToken, getCurrentUser);
router.patch("/users/update", verifyToken, updateUser);
router.delete("/users/delete/:id", verifyToken, verifyAdmin, deleteUser);


export default router;