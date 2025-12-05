import express from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import { saveDeviceToken, sendNotificationToAll } from "../controllers/notifications.controller.js";

const router = express.Router();

// Save device token for push notifications
router.post(
  "/save-token",
  authenticate,
  saveDeviceToken
);

router.post(
  "/send",
  authenticate,
  requireRole("admin", "super_admin"),
  sendNotificationToAll
);
