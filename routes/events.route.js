import express from "express";
const router = express.Router();
import eventsController from "../controllers/events.controller.js";
import { authenticate, requireRole } from "../middlewares/auth.js";
import {
  validateCreatePublication,
  validateUpdatePublication,
} from "../utilities/publicationValidation.js";
import upload from "../config/multer.js";

router.use(authenticate);

router.get("/", eventsController.getAllEvents);
router.get("/:id", eventsController.getEventById);
router.post(
  "/create",
  requireRole("admin", "superadmin", "editor"),
  upload.single("pdf"),
  validateCreatePublication,
  eventsController.createEvent
);
router.put(
  "/:id",
  requireRole("admin", "superadmin", "editor"),
  upload.single("pdf"),
  validateUpdatePublication,
  eventsController.updateEvent
);
router.delete(
  "/:id",
  requireRole("admin", "superadmin"),
  eventsController.deleteEvent
);

export default router;
