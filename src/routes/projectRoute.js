import express from "express";
import { verifyAccessToken } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createProject } from "../controllers/projectController.js";

const router = express.Router();


router.use(verifyAccessToken);
console.log("create project");
router.post("/create", asyncHandler(createProject));

export default router;