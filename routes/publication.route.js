import express from 'express';
import authenticate from "../middlewares/auth";
import controller from '../controllers/publications.controller.js';

const router = express.Router();


// admin only
router.post("/", authenticate, controller.createPublications);
router.put("/:id", authenticate, controller.updatePublications);
router.delete("/:id", authenticate, controller.deletePublications);

// public
router.get("/", controller.getAllPublications);
router.get("/:id", controller.getSinglePublications);

// upload
router.post("/upload", authenticate, uploadMiddleware, controller.uploadPDF);

export default router;