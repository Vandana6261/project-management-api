import express from "express";
import { verifyAccessToken } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { addMember, createProject, getAllProject } from "../controllers/projectController.js";
import { getOptions } from "../controllers/projectOptions.js";

const router = express.Router();


router.use(verifyAccessToken);
console.log("create project");

router.get("/project-options", getOptions)
router.get("/get-project", asyncHandler(getAllProject))

router.post("/create", asyncHandler(createProject));
router.post("/add-member", asyncHandler(addMember));

export default router;