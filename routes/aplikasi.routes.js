import express from "express";
import * as controller from "../controllers/aplikasi.controller.js";
const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.get("/namaaplikasi/:nama", controller.getByNamaAplikasi);
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;