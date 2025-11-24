import express from "express";
const router = express.Router();
import {teamsController} from "../controllers/team.controller.js";
import { authenticate, requireRole } from "../middlewares/auth.js";
import {
  validateCreateTeam,
  validateUpdateTeam,
} from "../utilities/teamValidation.js";
import upload from "../config/multer.js";

router.use(authenticate);

router.get("/", teamsController.getAllTeams);
router.get("/:id", teamsController.getTeamById);
router.post(
  "/create",
  requireRole("admin", "superadmin", "editor"),
  upload.single("pdf"),
  validateCreateTeam,
  teamsController.createTeam
);
router.put(
  "/:id",
  requireRole("admin", "superadmin", "editor"),
  upload.single("pdf"),
  validateUpdateTeam,
  teamsController.updateTeam
);
router.delete(
  "/:id",
  requireRole("admin", "superadmin"),
  teamsController.deleteTeam
);

export default router;
