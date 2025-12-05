import express from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import { createTeam, getAllTeam, getTeamById, updateTeam, deleteTeam, getTags } from "../controllers/team.controller.js";
import { validate, createTeamValidation, updateTeamValidation } from "../utilities/teamValidation.js";
import upload from "../config/multer.js";

const router = express.Router();
router.use(authenticate);

// Public routes
router.get("/", getAllTeam);
router.get("/:id", getTeamById);
router.get("/tags/all", getTags);

// Admin/editor routes
router.post("/create", requireRole("admin", "superadmin", "editor"), upload.single("profileImage"), validate(createTeamValidation), createTeam);
router.put("/:id", requireRole("admin", "superadmin", "editor"), upload.single("profileImage"), validate(updateTeamValidation), updateTeam);
router.delete("/:id", requireRole("admin", "superadmin"), deleteTeam);

export default router;
