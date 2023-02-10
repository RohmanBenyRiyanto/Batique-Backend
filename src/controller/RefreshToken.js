import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import {
    response200,
    response401,
    response403,
} from "../utils/Response.js";

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
