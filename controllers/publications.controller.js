import Publication from '../models/publication.js';
import uploadService from '../services/uploadService.js';

const createPublication = async (req, res) => {
  try {
    const publicationData = { ...req.validatedBody };
    
    if (req.file) {
      const result = await uploadService.uploadPDF(req.file.buffer, { folder: 'publications/pdfs' });
      publicationData.pdfUrl = result.secure_url;
      publicationData.pdfPublicId = result.public_id;
    }

    if (publicationData.isPublished) {
      publicationData.publishedAt = new Date();
    }

    publicationData.createdBy = req.user.id;

    const publication = await Publication.create(publicationData);

    res.status(201).json({
      success: true,
      message: 'Publication created successfully',
      data: publication
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllPublications = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', year, tag, isPublished, sortBy = 'year', order = 'desc' } = req.query;
    
    const query = {};
    if (search) query.$text = { $search: search };
    if (year) query.year = parseInt(year);
    if (tag) query.tags = tag;
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const [publications, total] = await Promise.all([
      Publication.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'name email')
        .lean(),
      Publication.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: publications,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPublicationById = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    
    if (!publication) {
      return res.status(404).json({ success: false, message: 'Publication not found' });
    }

    res.json({ success: true, data: publication });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePublication = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) {
      return res.status(404).json({ success: false, message: 'Publication not found' });
    }

    const updateData = { ...req.validatedBody };

    if (req.file) {
      if (publication.pdfPublicId) {
        await uploadService.deleteFile(publication.pdfPublicId, 'raw').catch(console.error);
      }
      const result = await uploadService.uploadPDF(req.file.buffer, { folder: 'publications/pdfs' });
      updateData.pdfUrl = result.secure_url;
      updateData.pdfPublicId = result.public_id;
    }

    if (updateData.isPublished && !publication.isPublished) {
      updateData.publishedAt = new Date();
    }

    updateData.updatedBy = req.user.id;

    const updated = await Publication.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    res.json({ success: true, message: 'Publication updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePublication = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) {
      return res.status(404).json({ success: false, message: 'Publication not found' });
    }

    if (publication.pdfPublicId) {
      await uploadService.deleteFile(publication.pdfPublicId, 'raw').catch(console.error);
    }

    await publication.deleteOne();

    res.json({ success: true, message: 'Publication deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createPublication,
  getAllPublications,
  getPublicationById,
  updatePublication,
  deletePublication
};