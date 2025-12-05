import express from "express";
const router = express.Router();

import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getTags,
} from "../controllers/events.controller.js";

import upload from "../config/multer.js";

import {
  validateEventCreate,
  validateEventUpdate,
} from "../utilities/eventValidation.js";

import { authenticate, requireRole } from "../middleware/auth.js";

// ✅ PUBLIC ROUTES (no authentication)
router.get("/", getAllEvents);
router.get("/tags", getTags);
router.get("/:id", getEventById);

// ✅ PROTECTED ROUTES (authentication required)
// Admin / Editor can create/update
router.post(
  "/create",
  authenticate,
  requireRole("admin", "superadmin", "editor"),
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  validateEventCreate,
  createEvent
);

router.put(
  "/:id",
  authenticate,
  requireRole("admin", "superadmin", "editor"),
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  validateEventUpdate,
  updateEvent
);

// Only superadmin can delete
router.delete(
  "/:id", 
  authenticate, 
  requireRole("superadmin"), 
  deleteEvent
);

export default router;