import express from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { updateHomeValidation } from "../validators/home.validator.js";
import { getHomeSettings, updateHomeSettings } from "../controllers/home.controller.js";

const router = express.Router();

router.get("/", getHomeSettings);

router.put(
  "/",
  authenticate,
  requireRole("admin", "super_admin"),
  validate(updateHomeValidation),
  updateHomeSettings
);

export default router;
