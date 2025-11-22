import express from 'express';
import authenticate from "../middlewares/auth";
import controller from '../controllers/programs.controller.js';

const router = express.Router();


// admin only
router.post("/", authenticate, controller.createPrograms);
router.put("/:id", authenticate, controller.updatePrograms);
router.delete("/:id", authenticate, controller.deletePrograms);

// public
router.get("/", controller.getAllPrograms);
router.get("/:id", controller.getSinglePrograms);

// upload
router.post("/upload", authenticate, uploadMiddleware, controller.uploadPDF);

export default router;