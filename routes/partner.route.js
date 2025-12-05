import express from 'express';
import { authenticate, requireRole } from "../middleware/auth.js";
import upload from "../config/multer.js";
import {
  createPartner,
  getAllPartners,
  getPartnerById,
  updatePartner,
  deletePartner
} from '../controllers/partner.controller.js';
import validate from "../middleware/validate.js";
import {
  createPartnerValidation,
  updatePartnerValidation,
  partnerIdValidation
} from '../validations/partner.validation.js';

const router = express.Router();

// PUBLIC
router.get("/", getAllPartners);
router.get("/:id", validate(partnerIdValidation), getPartnerById);

// ADMIN ONLY
router.post(
  "/",
  authenticate,
  requireRole("admin", "superadmin"),
  upload.single("logo"),
  validate(createPartnerValidation),
  createPartner
);

router.put(
  "/:id",
  authenticate,
  requireRole("admin", "superadmin"),
  upload.single("logo"),
  validate(updatePartnerValidation),
  updatePartner
);

router.delete(
  "/:id",
  authenticate,
  requireRole("superadmin"),
  validate(partnerIdValidation),
  deletePartner
);

export default router;