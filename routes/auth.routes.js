const express = require("express");
const controller = require("../controllers/auth.controller");

const router = express.Router();


router.post("/login", controller.login);
router.post("/register", controller.register);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);

module.exports = router;