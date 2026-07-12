import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../config/prisma.js";


const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};

export function verifyAccessToken (req, res, next) {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({ message: "Access token missing" });
        }

        const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({message: "Invalid or expired access token"});
    }
}


export const verifyRefreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({message: "Refresh token missing"})
        }

        const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            },
            select: {
                hashedRefresh: true
            }
        });

        if (!user) {
            return res.status(401).json({ message: "User not found"});
        }

        const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

        if (hashedToken !== user.hashedRefresh) {
            return res.status(401).json({message: "Refresh token mismatch"});
        }

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
};



export const verifyOtpToken = (req, res, next) => {
    try {
        const token = req.cookies.otpToken;
        console.log(token, "otpToken")
        if (!token) {
            return res.status(401).json({message: "OTP session expired"})
        }

        const decoded = verifyToken(token, process.env.OTP_SESSION_KEY)
        console.log(decoded, "decode for otp session")
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({message: "Invalid or expired OTP session"});
    }
};

export const verifySignupToken = (req, res, next) => {
    try {
        const token = req.cookies.signUpToken;
        console.log(token, "signup session token")
        if (!token) {
            return res.status(401).json({
                message: "Signup session expired"
            });
        }

        const decoded = verifyToken(token, process.env.SIGNUP_SESSION_KEY);
        console.log(decoded, "decode for signup session")
        req.user = decoded;

        next();

    } catch (error) {
        console.log(error, "signu token error")
        return res.status(401).json({message: "Invalid or expired signup session"});
    }
};