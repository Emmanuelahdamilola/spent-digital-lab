import express from 'express';
import authenticate from "../middlewares/auth";
import controller from '../controllers/research.controller.js';

const router = express.Router();


// admin only
router.post("/", authenticate, controller.createResearch);
router.put("/:id", authenticate, controller.updateResearch);
router.delete("/:id", authenticate, controller.deleteResearch);

// public
router.get("/", controller.getAllResearch);
router.get("/:id", controller.getSingleResearch);

// upload
router.post("/upload", authenticate, uploadMiddleware, controller.uploadPDF);

export default router;
