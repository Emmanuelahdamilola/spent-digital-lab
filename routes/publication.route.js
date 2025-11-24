import express from 'express';
const  router = express.Router();
import publicationController from '../controllers/publications.controller.js';
import { authenticate, requireRole }from '../middlewares/auth.js';
import { validateCreatePublication, validateUpdatePublication }from '../utilities/publicationValidation.js';
import upload from '../config/multer.js';

router.use(authenticate);

router.get('/', publicationController.getAllPublications);
router.get('/:id', publicationController.getPublicationById);
router.post('/create', requireRole('admin', 'superadmin', 'editor'), upload.single('pdf'), validateCreatePublication, publicationController.createPublication);
router.put('/:id', requireRole('admin', 'superadmin', 'editor'), upload.single('pdf'), validateUpdatePublication, publicationController.updatePublication);
router.delete('/:id', requireRole('admin', 'superadmin'), publicationController.deletePublication);

export default router;
