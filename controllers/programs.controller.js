import Programs from '../models/program.js';
import { uploadService } from '../services/uploadService.js';

// Create Program
const createProgram = async (req, res) => {
  try {
    const { title, description, duration, eligibility, programType, applicationLink, tags, isPublished } = req.validatedBody;

    let pdfUrl = null, pdfPublicId = null, coverImage = null, coverImagePublicId = null;

    if (req.files?.pdf) {
      const pdfResult = await uploadService.uploadPDF(req.files.pdf[0].buffer, { folder: 'programs/pdfs' });
      pdfUrl = pdfResult.secure_url;
      pdfPublicId = pdfResult.public_id;
    }

    if (req.files?.coverImage) {
      const imageResult = await uploadService.uploadImage(req.files.coverImage[0].buffer, { folder: 'programs/covers' });
      coverImage = imageResult.secure_url;
      coverImagePublicId = imageResult.public_id;
    }

    const program = await Programs.create({
      title,
      description,
      duration,
      eligibility,
      programType,
      applicationLink,
      tags: tags || [],
      pdfUrl,
      pdfPublicId,
      coverImage,
      coverImagePublicId,
      isPublished: isPublished || false,
      publishedAt: isPublished ? new Date() : null,
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, message: 'Program created successfully', data: program });
  } catch (error) {
    if (req.files) {
      if (req.files.pdf && pdfPublicId) await uploadService.deleteFile(pdfPublicId, 'raw').catch(console.error);
      if (req.files.coverImage && coverImagePublicId) await uploadService.deleteFile(coverImagePublicId, 'image').catch(console.error);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all Programs (pagination + search + filter)
const getAllPrograms = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      tag = '',
      programType = '',
      isPublished,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};

    // Text search
    if (search) query.$text = { $search: search };

    // Filter by programType
    if (programType) query.programType = programType;

    // Filter by published status
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';

    // Filter by tags (accept multiple tags comma-separated)
    if (tag) query.tags = { $in: tag.split(',').map(t => t.trim()) };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const [programs, total] = await Promise.all([
      Programs.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email')
        .lean(),
      Programs.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: programs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get Program by ID
const getProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await Programs.findById(id).populate('createdBy', 'name email').populate('updatedBy', 'name email');
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, data: program });
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid program ID' });
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Program
const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.validatedBody };
    const program = await Programs.findById(id);
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });

    if (req.files?.pdf) {
      if (program.pdfPublicId) await uploadService.deleteFile(program.pdfPublicId, 'raw').catch(console.error);
      const pdfResult = await uploadService.uploadPDF(req.files.pdf[0].buffer, { folder: 'programs/pdfs' });
      updateData.pdfUrl = pdfResult.secure_url;
      updateData.pdfPublicId = pdfResult.public_id;
    }

    if (req.files?.coverImage) {
      if (program.coverImagePublicId) await uploadService.deleteFile(program.coverImagePublicId, 'image').catch(console.error);
      const imageResult = await uploadService.uploadImage(req.files.coverImage[0].buffer, { folder: 'programs/covers' });
      updateData.coverImage = imageResult.secure_url;
      updateData.coverImagePublicId = imageResult.public_id;
    }

    if (updateData.isPublished && !program.isPublished) updateData.publishedAt = new Date();
    updateData.updatedBy = req.user.id;

    const updatedProgram = await Programs.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.json({ success: true, message: 'Program updated successfully', data: updatedProgram });
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid program ID' });
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Program
const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await Programs.findById(id);
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });

    const deletePromises = [];
    if (program.pdfPublicId) deletePromises.push(uploadService.deleteFile(program.pdfPublicId, 'raw').catch(console.error));
    if (program.coverImagePublicId) deletePromises.push(uploadService.deleteFile(program.coverImagePublicId, 'image').catch(console.error));
    await Promise.allSettled(deletePromises);

    await program.deleteOne();
    res.json({ success: true, message: 'Program deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid program ID' });
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get unique tags
const getProgramTags = async (req, res) => {
  try {
    const tags = await Programs.distinct('tags');
    res.json({ success: true, data: tags.filter(tag => tag) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  createProgram,
  getAllPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
  getProgramTags
};