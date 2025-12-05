import express from 'express';
import publicationController from '../controllers/publications.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate, createPublicationValidation, updatePublicationValidation } from '../validators/publication.validator.js';
import upload from '../middleware/upload.js'; // Adjust path if your upload middleware is elsewhere

const router = express.Router();

// Create publication
router.post(
  '/',
  authenticate,
  requireRole('admin', 'super_admin'), // Note: requireRole uses spread operator, not array
  upload.single('pdf'),
  validate(createPublicationValidation),
  publicationController.createPublication
);

// Get all publications
router.get('/', publicationController.getAllPublications);

// Get publication by ID
router.get('/:id', publicationController.getPublicationById);

// Update publication
router.put(
  '/:id',
  authenticate,
  requireRole('admin', 'super_admin'),
  upload.single('pdf'),
  validate(updatePublicationValidation),
  publicationController.updatePublication
);

// Delete publication
router.delete(
  '/:id',
  authenticate,
  requireRole('admin', 'super_admin'),
  publicationController.deletePublication
);

export default router;