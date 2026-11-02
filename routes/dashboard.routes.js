const express = require("express");
const controller = require("../controllers/dashboard.controller");
const router = express.Router();

router.get("/summary", controller.getSummary);
router.get("/activity", controller.getActivity);

module.exports = router;