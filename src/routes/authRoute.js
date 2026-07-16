import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { registerUser, sendOtp, verifyOtp } from "../controllers/authController.js";
import { verifyOtpToken, verifySignupToken } from "../middlewares/authMiddleware.js";
import rateLimit from "express-rate-limit";

const router= express.Router();

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: process.env.NODE_ENV === 'Local' ? 1000 : 5, // Limit each IP to 1 requests per window
  message: {
    success: false,
    message: "Too many requests, please try again later."
  }
});


router.post("/send-otp", otpLimiter, asyncHandler(sendOtp))
router.post("/verify-otp", verifyOtpToken, asyncHandler(verifyOtp))
router.post("/register", verifySignupToken, asyncHandler(registerUser));

export default router;