import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import crypto from "crypto"
import { getCookieOptions } from './cookieOptions.js';
console.log("Token generate called")

export const genAccessToken = (payload, res) => {
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

export const genRefreshToken = async (payload, res) => {
    const refreshToken =  jwt.sign(
        {...payload}, 
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )

    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest("hex");
    await prisma.user.update({
        where: {
            id: payload.userId
        },
        data: {
            hashedRefresh: hashedToken
        }
    })

    res.cookie("refreshToken", refreshToken, {
      ...getCookieOptions(),
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    console.log("Refresh token dispatched")
}


export const genOtpSession = async (payload, res) => {
    const otpToken = jwt.sign(
        {...payload},
        process.env.OTP_SESSION_KEY,
        {expiresIn: process.env.OTP_SESSION_EXPIRY}
    )
    
    res.cookie("otpToken", otpToken, {
        ...getCookieOptions(),
        maxAge: 5 * 60 * 1000
    })
    console.log("Otp token dispatched")
}

export const genSignupSession = async (payload, res) => {
    const signUpToken = jwt.sign(
        {...payload},
        process.env.SIGNUP_SESSION_KEY,
        {expiresIn: process.env.SIGNUP_SESSION_EXPIRY}
    )
    console.log(signUpToken, "signUp Token")
    res.cookie("signUpToken", signUpToken, {
        ...getCookieOptions(),
        maxAge: 10 * 60 * 1000
    })
    console.log("Signup token dispatched")
}
