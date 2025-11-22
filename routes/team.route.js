import express from 'express';
import authenticate from "../middlewares/auth";
import controller from '../controllers/team.controller.js';

const router = express.Router();


// admin only
router.post("/", authenticate, controller.createTeam);
router.put("/:id", authenticate, controller.updateTeam);
router.delete("/:id", authenticate, controller.deleteTeam);

// public
router.get("/", controller.getAllTeam);
router.get("/:id", controller.getSingleTeam);

// upload
router.post("/upload", authenticate, uploadMiddleware, controller.uploadPDF);

export default router;