import express from "express";
import { verifyAccessToken } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createTask, getAssignedTask, getTaskById, updateTask } from "../controllers/taskController.js";
import { getTaskOptions } from "../controllers/taskOptions.js";
import { authorize } from "../middlewares/authorizeMiddleware.js";


const router = express.Router();


router.use(verifyAccessToken);
console.log("task route");

router.get("/get-options", asyncHandler(getTaskOptions));
router.get("/assigned-task", asyncHandler(getAssignedTask));
router.get("/:taskId", asyncHandler(getTaskById));
router.patch("/:taskId", asyncHandler(updateTask));
router.put("/:taskId", asyncHandler(updateTask));
router.post("/create", authorize("TASK_CREATE"), asyncHandler(createTask));

export default router;