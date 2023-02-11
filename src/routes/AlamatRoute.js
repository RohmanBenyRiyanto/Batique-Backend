import express from "express";
import {
    getAlamat,
    getAlamatById,
    getAlamatByCurentUser,
    getAlamatPrimary,
    createAlamat,
    updateAlamat,
    deleteAlamat,
} from '../controller/AlamatController.js';
import { verifyToken } from '../middleware/TokenMiddleware.js';
import { verifyAdmin } from '../middleware/UserMiddleware.js';

const router = express.Router();

router.get("/alamat", verifyToken, verifyAdmin, getAlamat);
router.get("/alamat/:id", verifyToken, verifyAdmin, getAlamatById);
router.get("/alamat/user/current", verifyToken, getAlamatByCurentUser);
router.get("/alamat/user/primary", verifyToken, getAlamatPrimary);
router.post("/alamat", verifyToken, createAlamat);
router.patch("/alamat/:id", verifyToken, updateAlamat);
router.delete("/alamat/:id", verifyToken, deleteAlamat);

export default router;