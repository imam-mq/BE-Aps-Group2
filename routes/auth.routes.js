import express from "express";
import * as controller from "../controllers/auth.controller.js"

const router = express.Router();


router.post("/login", controller.login);
router.post("/register", controller.register);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);

export default router;