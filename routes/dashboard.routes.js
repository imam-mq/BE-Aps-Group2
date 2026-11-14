import express from "express";
import * as controller from "../controllers/dashboard.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// get data sumary & activity
router.get("/summary", controller.getSummary);
router.get("/activity", controller.getActivity);

export default router;