import express from 'express';
import authenticate from "../middlewares/auth";
import controller from '../controllers/partner.controller.js';

const router = express.Router();


// admin only
router.post("/", authenticate, controller.createPartner);
router.put("/:id", authenticate, controller.updatePartner);
router.delete("/:id", authenticate, controller.deletePartner);

// public
router.get("/", controller.getAllPartner);
router.get("/:id", controller.getSinglePartner);

// upload
router.post("/upload", authenticate, uploadMiddleware, controller.uploadPDF);

export default router;