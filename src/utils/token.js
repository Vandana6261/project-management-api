import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import crypto from "crypto"
import { getCookieOptions } from './cookieOptions.js';
console.log("Token generate called")

export const generateAccessToken = (payload, res) => {
    const accessToken = jwt.sign(
        {...payload},
        process.env.JWT_ACCESS_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
    res.cookie("accessToken", accessToken, {
      ...getCookieOptions(),
      maxAge: 15 * 60 * 1000,
    });

    console.log("Access token dispatched")
}

export const generateRefreshToken = async (payload, res) => {
    const refreshToken =  jwt.sign(
        {...payload}, 
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
    res.cookie("refreshToken", refreshToken, {
      ...getCookieOptions(),
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest("hex");
    await prisma.user.update({
        where: {
            id: payload.userId
        },
        data: {
            hashedRefresh: hashedToken
        }
    })
    console.log("Refresh token dispatched")
}