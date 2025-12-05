import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import researchController from '../controllers/research.controller.js';
import upload from '../middleware/upload.js';
import validate from '../middleware/validate.js'; // ← Import from middleware
import { createResearchValidation, updateResearchValidation } from '../validators/research.validator.js';

const router = express.Router();

// Public routes
router.get('/', researchController.getAllResearch);
router.get('/:id', researchController.getResearchById);

// Admin-only routes
router.post(
  '/',
  authenticate,
  requireRole('admin', 'super_admin'),
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  validate(createResearchValidation),
  researchController.createResearch
);

router.put(
  '/:id',
  authenticate,
  requireRole('admin', 'super_admin'),
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  validate(updateResearchValidation),
  researchController.updateResearch
);

router.delete(
  '/:id',
  authenticate,
  requireRole('admin', 'super_admin'),
  researchController.deleteResearch
);

export default router;