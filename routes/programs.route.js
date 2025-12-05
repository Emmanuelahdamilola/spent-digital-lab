import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import controller from '../controllers/programs.controller.js';
import upload from '../middleware/upload.js'; // Changed variable name

const router = express.Router();

// Public routes
router.get('/tags/list', controller.getProgramTags);
router.get('/', controller.getAllPrograms);
router.get('/:id', controller.getProgramById);

// Admin-only routes
router.post(
  '/',
  authenticate,
  requireRole('admin', 'super_admin'),
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  controller.createProgram
);

router.put(
  '/:id',
  authenticate,
  requireRole('admin', 'super_admin'),
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  controller.updateProgram
);

router.delete(
  '/:id',
  authenticate,
  requireRole('admin', 'super_admin'),
  controller.deleteProgram
);

export default router;