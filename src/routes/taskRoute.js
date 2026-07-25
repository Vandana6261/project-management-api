import express from "express";
import { verifyAccessToken } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createTask } from "../controllers/taskController.js";
import { getTaskOptions } from "../controllers/taskOptions.js";


const router = express.Router();


router.use(verifyAccessToken);
console.log("task route");

router.get("/getOptions", asyncHandler(getTaskOptions))
router.post("/create", asyncHandler(createTask));

export default router;