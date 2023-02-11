import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";

import {
    response200,
    response201,
    response400,
    response401,
    response403,
    response404,
    response409,
    response422,
    response500,
} from "../utils/Response.js";

export const getAllUsers = async (req, res) => {
    try {

        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json(response401("You are not authenticated"));

        const user = await UserModel.findOne({
            attributes: { exclude: ["password", "refreshToken"] },
            where: {
                refreshToken: refreshToken,
            },
        });


        if (!user) {
            return res.status(403).json(response403("Invalid refresh token"));
        }

        const users = await UserModel.findAll(
            { attributes: { exclude: ["password", "refreshToken"] } }

        );
        res.status(200).json(response200("OK", users));

    } catch (error) {
        console.log(error);
        res.status(500).json(response500(error.message));
    }
};

// Get Current User with authorization token
export const getCurrentUser = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json(response401("You are not authenticated"));

        const user = await UserModel.findOne({
            // remove password and add refreshToken from response
            attributes: { exclude: ["password", "refreshToken"] },
            where: {
                refreshToken: refreshToken,
            },
        });

        if (!user) {
            return res.status(403).json(response403("Invalid refresh token"));
        } else {
            res.status(200).json(response200("OK", { user }));
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(response500(error.message));
    }
};


export const updateUser = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json(response401("You are not authenticated"));

        const user = await UserModel.findOne({
            attributes: { exclude: ["password", "refreshToken"] },
            where: {
                refreshToken: refreshToken,
            },
        });


        if (!user) {
            return res.status(403).json(response403("Invalid refresh token"));
        }


        if (user.image === null && user.url === null) {
            if (req.files === null) return res.status(400).json(response400("No file uploaded"));

            const file = req.files.file;
            const fileSize = file.data.length;
            const ext = path.extname(file.name);
            const fileName = file.md5 + ext;
            const url = `${req.protocol}://${req.get("host")}/avatar/${fileName}`;
            const allowedType = ['.png', '.jpg', '.jpeg'];

            if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json(response422("File type not allowed"));

            if (fileSize > 5000000) return res.status(422).json(response422("File size too large"));

            file.mv(`./public/avatar/${fileName}`, async (err) => {
                if (err) return res.status(500).json({ msg: "Server Error" });
                await UserModel.update(
                    {
                        name: req.body.name || user.name,
                        username: req.body.username || user.username,
                        email: req.body.email || user.email,
                        role: req.body.role || user.role,
                        image: fileName || user.image,
                        url: url || user.url,
                        bio: req.body.bio || user.bio,
                        noTlp: req.body.noTlp || user.noTlp,
                        jenisKelamin: req.body.jenisKelamin || user.jenisKelamin,
                        tanggalLahir: req.body.tanggalLahir || user.tanggalLahir,
                    },
                    { where: { id: user.id } }
                );


                const userData = await UserModel.findOne({
                    attributes: { exclude: ["password", "refreshToken"] },
                    where: {
                        refreshToken: refreshToken,
                    },

                });

                res.status(200).json(response200("OK", { userData }));
            });
        } else {
            let fileName = "";
            if (req.files === null) {
                fileName = user.image;
            } else {
                const file = req.files.file;
                const fileSize = file.data.length;
                const ext = path.extname(file.name);
                fileName = file.md5 + ext;
                const allowedType = ['.png', '.jpg', '.jpeg'];

                if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json(response422("File type not allowed"));

                if (fileSize > 5000000) return res.status(422).json(response422("File size too large"));

                const filePath = `./public/avatar/${user.image}`;
                fs.unlinkSync(filePath);

                file.mv(`./public/avatar/${fileName}`, async (err) => {
                    if (err) return res.status(500).json(response500("Server Error"));
                });

                const name = req.body.name || user.name;
                const username = req.body.username || user.username;
                const email = req.body.email || user.email;
                const role = req.body.role || user.role;
                const bio = req.body.bio || user.bio;
                const noTlp = req.body.noTlp || user.noTlp;
                const jenisKelamin = req.body.jenisKelamin || user.jenisKelamin;
                const tanggalLahir = req.body.tanggalLahir || user.tanggalLahir;
                const url = `${req.protocol}://${req.get("host")}/avatar/${fileName}`;

                await UserModel.update(
                    {
                        name: name,
                        username: username,
                        email: email,
                        role: role,
                        image: fileName,
                        url: url,
                        bio: bio,
                        noTlp: noTlp,
                        jenisKelamin: jenisKelamin,
                        tanggalLahir: tanggalLahir,
                    },
                    { where: { id: user.id } }
                );

                const userData = await UserModel.findOne({
                    attributes: { exclude: ["password", "refreshToken"] },
                    where: {
                        refreshToken: refreshToken,
                    },
                });

                res.status(200).json(response200("OK", { userData }));
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(response500(error.message));
    }
};

export const deleteUser = async (req, res) => {
    //only super admin and admin can delete user
    try {
        if (req.user.role !== "superadmin" && req.user.role !== "admin") {
            return res.status(403).json(response403("You are not authorized"));
        } else {
            const id = req.params.id;
            const user = await UserModel.findOne({
                where: {
                    id: id,
                },
            });

            if (!user) return res.status(404).json(response404("User not found"));

            await UserModel.destroy({
                where: {
                    id: id,
                },
            });
        }

        res.status(200).json(response200("OK", { message: "User deleted" }));
    } catch (error) {
        console.log(error);
        res.status(500).json(response500(error.message));
    }
};
