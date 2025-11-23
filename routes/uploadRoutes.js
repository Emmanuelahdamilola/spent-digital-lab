
import express from 'express';
import * as uploadController from "../controllers/uploadController.js";
import upload from '../config/multer.js';
import { authenticate, requireRole } from '../middlewares/auth.js';


const router = express.Router();

// All upload routes require authentication
router.use(authenticate);

// Image upload
router.post('/image', 
  requireRole('admin', 'superadmin', 'editor'),
  upload.single('file'),
  uploadController.uploadImage
);

// PDF upload
router.post('/pdf',
  requireRole('admin', 'superadmin', 'editor'),
  upload.single('file'),
  uploadController.uploadPDF
);

// Thumbnail upload
router.post('/thumbnail',
  requireRole('admin', 'superadmin', 'editor'),
  upload.single('file'),
  uploadController.uploadThumbnail
);

// Profile image upload
router.post('/profile',
  requireRole('admin', 'superadmin', 'editor'),
  upload.single('file'),
  uploadController.uploadProfileImage
);

// Delete file
router.delete('/:publicId',
  requireRole('admin', 'superadmin'),
  uploadController.deleteFile
);

export default router;