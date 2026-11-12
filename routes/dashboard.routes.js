const express = require("express");
const controller = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.use(authMiddleware);

// get data sumary & activity
router.get("/summary", controller.getSummary);
router.get("/activity", controller.getActivity);

module.exports = router;