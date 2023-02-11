import express from "express";
import {
    register,
    login,
    logout,
    refreshToken,
} from '../controller/AuthController.js';
// import { verifyAccountActive } from '../middleware/UserMiddleware.js';

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.delete("/logout", logout);
router.get("/refreshtoken", refreshToken);

export default router;


