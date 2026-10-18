import {
  getUserByMail,
  deleteOtp,
  getUserByID,
  register,
  saveOtp,
  sendOtpToMail,
  verifyOtpService,
} from "../services/authService.js";
import { AppError } from "../utils/AppError.js";
import { z } from "zod";
import crypto from "crypto";
import bcrypt from "bcrypt";
import {
  genAccessToken,
  genRefreshToken,
  genOtpSession,
  genSignupSession,
} from "../utils/token.js";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { getCookieOptions } from "../utils/cookieOptions.js";

const signupSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters").max(20),
  fullName: z.string().trim().min(2, "Your name is required").max(50),
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
``
export const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) throw new AppError("Email is required", 400);

  const user = await getUserByMail(email);
  if (user) throw new AppError("User already exists with this email", 409);
  await deleteOtp(email);

  const otp = crypto.randomInt(100000, 999999).toString();
  console.log(otp, "otp");
  const isOtpSent = await sendOtpToMail(email, otp);
  if (!isOtpSent) {
    throw new AppError("Internal server Error", 500);
  }

  const isOtpSaved = await saveOtp(email, otp);
  if (!isOtpSaved) {
    throw new AppError("Internal Server Error", 500);
  }
  await genOtpSession({ email }, res);
  return res.status(200).json({ success: true, isOtpSent });
};

export const verifyOtp = async (req, res, next) => {
  const { otp } = req.body;
  const email = req.user.email;
  if (!otp || !email) {
    throw new AppError("Required field are missing");
  }
  const isValid = await verifyOtpService(otp, email);
  if (isValid) {
    await genSignupSession({ email }, res);
    await deleteOtp(email);
    return res.status(200).json({ success: true });
  }
};

export const registerUser = async (req, res) => {
  const userData = { ...req.body, email: req.user.email };
  const validationResult = signupSchema.safeParse(userData);

  if (!validationResult.success) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Validation failed",
        error: validationResult.error.issues,
      });
  }

  const user = await getUserByMail(userData.email);
  if (user) throw new AppError("User already exists with this email", 409);

  const hashedPassword = await bcrypt.hash(userData.password, 12);
  const newUser = await register({ ...userData, password: hashedPassword });

  genAccessToken({ userId: newUser.id, username: newUser.username }, res);
  await genRefreshToken({ userId: newUser.id, username: newUser.username }, res);

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    username: newUser.username,
    email: newUser.email
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("Required field are missing");
  }

  const user = await getUserByMail(email);
  if (!user) throw new AppError("User not found", 404);
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  genAccessToken({ userId: user.id, username: user.username }, res);
  await genRefreshToken({ userId: user.id, username: user.username }, res);

  return res.status(201).json({
    success: true,
    message: "User Logged in successfully",
    username: user.username,
    email: user.email
  });
};

export const refreshAccessToken = (req, res) => {
  genAccessToken(req.user, res)
  return res.status(200).json({ success: true })
}

export const me = async (req, res) => {
  const userId = req.user.userId;
  const user = await getUserByID(userId);
  if (!user) throw new AppError("User not found", 404);
  return res.status(200).json({ success: true, username: user.username, email: user.email })
}

export const logout = async (req, res) => {
  // Extract userId from cookies to nullify refresh token in DB
  let userId = null;

  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  // Try access token first (verify), fallback to decode (expired but parseable)
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      userId = decoded.userId;
    } catch (_) {
      const decoded = jwt.decode(accessToken);
      userId = decoded?.userId;
    }
  }

  // Fallback: try refresh token
  if (!userId && refreshToken) {
    const decoded = jwt.decode(refreshToken);
    userId = decoded?.userId;
  }

  // Nullify stored refresh hash so the token can't be reused
  if (userId) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { hashedRefresh: null },
      });
    } catch (err) {
      console.error("Logout DB cleanup error:", err?.message);
    }
  }

  // Clear both httpOnly cookies
  res.clearCookie("accessToken", getCookieOptions());
  res.clearCookie("refreshToken", getCookieOptions());

  return res.status(200).json({ success: true, message: "Logged out successfully" });
};