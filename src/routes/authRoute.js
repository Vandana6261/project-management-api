import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { registerUser, sendOtp, verifyOtp } from "../controllers/authController.js";


const router= express.Router();


router.post("/send-otp", asyncHandler(sendOtp))
router.post("/verify-otp", asyncHandler(verifyOtp))
router.post("/register", asyncHandler(registerUser));

export default router;