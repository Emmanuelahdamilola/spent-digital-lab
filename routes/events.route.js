import express from 'express';
import authenticate from "../middlewares/auth";
import controller from '../controllers/events.controller.js';


const router = express.Router();


// admin only
router.post("/", authenticate, controller.createEvents);
router.put("/:id", authenticate, controller.updateEvents);
router.delete("/:id", authenticate, controller.deleteEvents);

// public
router.get("/", controller.getAllEvents);
router.get("/:id", controller.getSingleEvents);

// upload
router.post("/upload", authenticate, uploadMiddleware, controller.uploadPDF);

export default router;
