import Otp from "../models/otp.js";
import User from "../models/user.js"
import { AppError } from "../utils/AppError.js";
import prisma from "../config/prisma.js";

import { z } from "zod";


export const getUser = async ( email ) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const sendOtpToMail = async ( email, otp ) => {
  const res = await fetch(process.env.MAIL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "server-key": process.env.MAIL_SERVER_KEY,
      "server-address": process.env.MAIL_SERVER_ADDRESS,
    },
    body: JSON.stringify({
      email: email,
      otp: otp,
    }),
  });
  const payload = await res.json();
  if (!payload)
    throw new AppError("Failed to send OTP. Please try again later.", 500);

  return payload;
};


export const saveOtp = async ( email, otp ) => {
    const result = await Otp.insertOne({email, otp});
    return result;
}

export const deleteOtp = async (email) => {
    const result = await Otp.deleteMany({email});
    return result;
}

export const verifyOtpService = async (otp, email) => {
  const result = await Otp.findOne({email}).sort({createdAt: -1});
  if(!result) {
    throw new AppError("Otp has been expired", 400);
  } else if(result.otp !== otp) {
    throw new AppError("Invalid Otp", 400)
  } else if(result.otp === otp) {
    return true;
  }
}

export const register = async (userData) => {
  const isRegister = await prisma.user.create({
    data: {...userData, isVerified: true}
  });
  if(!isRegister) throw new AppError("Internal server error", 500);
  return isRegister;
}