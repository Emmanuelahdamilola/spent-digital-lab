import express from 'express';
const router = express.Router();
import {researchController} from '../controllers/research.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateCreateResearch, validateUpdateResearch } from '../utilities/researchValidation.js';
const upload = multer({ dest: 'uploads/' }); // Configure multer as needed


router.use(authenticate);
router.get('/', researchController.getAllResearch);

router.get('/tags', researchController.getTags);

router.get('/:id', researchController.getResearchById);

// Create research (admin, editor, superadmin)
router.post(
  '/create',
  requireRole('admin', 'superadmin', 'editor'),
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  validateCreateResearch,
  researchController.createResearch
);

// Update research (admin, editor, superadmin)
router.put(
  '/:id',
  requireRole('admin', 'superadmin', 'editor'),
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  validateUpdateResearch,
  researchController.updateResearch
);

// Delete research (admin, superadmin only)
router.delete(
  '/:id',
  requireRole('admin', 'superadmin'),
  researchController.deleteResearch
);

export default router;
