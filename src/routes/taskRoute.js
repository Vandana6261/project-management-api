import express from "express";
import { verifyAccessToken } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createTask, getAssignedTask } from "../controllers/taskController.js";
import { getTaskOptions } from "../controllers/taskOptions.js";


const router = express.Router();


router.use(verifyAccessToken);
console.log("task route");

router.get("/get-options", asyncHandler(getTaskOptions));
router.get("/assigned-task", asyncHandler(getAssignedTask));
router.post("/create", asyncHandler(createTask));

export default router;