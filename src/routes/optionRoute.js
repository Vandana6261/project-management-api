import express from "express";
import { verifyAccessToken } from "../middlewares/authMiddleware.js"
import { getOptions } from "../controllers/projectOptions.js";


const router = express.Router();
router.use(verifyAccessToken);

router.get("/project-options", getOptions)

export default router;
