import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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



export const register = async (req, res) => {
    const { name, username, bio, email, role, noTlp, jenisKelamin, tanggalLahir, password, password_confirmation, } = req.body;
    try {
        const user = await UserModel.findOne({
            where: {
                email: email,
            },
        });
        if (user) {
            return res.status(409).json(response409("User already exists"));
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


        const nameCapital = name
            .toLowerCase()
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ");

        const usernameLower = username.toLowerCase();



        if (!passwordRegex.test(password)) {
            return res.status(400).json(response400("Password must be at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character"));
        }

        if (password !== password_confirmation) {
            return res.status(400).json(response400("Passwords do not match"));
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await UserModel.create({
            name: nameCapital,
            username: usernameLower,
            bio: bio || "",
            email,
            role: role || "user",
            image: "default_avatar.png",
            url: `${req.protocol}://${req.get("host")}/assets/${"default_avatar.png"}`,
            noTlp: noTlp || "",
            jenisKelamin: jenisKelamin || "",
            tanggalLahir: tanggalLahir || "",
            password: hashedPassword,
            isVerified: false,
        });

        delete newUser.dataValues.password;

        res.status(201).json(response201("User created", { user: newUser }));

    } catch (error) {
        console.log(error);
        res.status(500).json(response500(error.message));
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({
            where: {
                email: req.body.email,
            },
        });
        console.log("user: ", user);

        if (!user) {
            return res.status(404).json(response404("User not found"));
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).json(response401("Wrong password"));
        }

        const accessToken = jwt.sign(
            { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "5m" }
        );

        const refreshToken = jwt.sign(
            { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );


        await UserModel.update(
            { refreshToken: refreshToken },
            { where: { id: user.id } }
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });


        res.status(200).json(response200("OK", { accessToken }));
    } catch (error) {
        console.log(error);
        res.status(500).json(response500(error.message));
    }
};

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json(response401("You are not authenticated"));

        const user = await UserModel.findOne({
            where: {
                refreshToken: refreshToken,
            },
        });

        if (!user) return res.status(403).json(response403("Invalid refresh token"));

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "5m" }
            );

            res.status(200).json(response200("OK", { accessToken }));
        });
    } catch (error) {

    }
};




export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json(response401("You are not authenticated"));

        const user = await UserModel.findOne({
            where: {
                refreshToken: refreshToken,
            },
        });

        if (!user) return res.status(403).json(response403("Invalid refresh token"));

        const userId = user.id;

        await UserModel.update(
            { refreshToken: null },
            { where: { id: userId } }
        );

        res.clearCookie('refreshToken');
        res.status(200).json(response200("OK", { message: "Logged out" }));
    } catch (error) {
        console.log(error);
        res.status(500).json(response500(error.message));
    }
}

