
import Events from '../models/events.js';
import {uploadService} from '../services/uploadService.js';

// Create Events
const createEvents = async (req, res) => {
  try {
    const { title, summary, author, tags, isPublished } = req.validatedBody;
    
    let pdfUrl = null;
    let pdfPublicId = null;
    let coverImage = null;
    let coverImagePublicId = null;

    // Handle PDF upload
    if (req.files && req.files.pdf) {
      const pdfResult = await uploadService.uploadPDF(
        req.files.pdf[0].buffer,
        { folder: 'research/pdfs' }
      );
      pdfUrl = pdfResult.secure_url;
      pdfPublicId = pdfResult.public_id;
    }

    // Handle cover image upload
    if (req.files && req.files.coverImage) {
      const imageResult = await uploadService.uploadImage(
        req.files.coverImage[0].buffer,
        { folder: 'research/covers' }
      );
      coverImage = imageResult.secure_url;
      coverImagePublicId = imageResult.public_id;
    }

    // Create events document
    const events = await Events.create({
      title,
      summary,
      author,
      tags: tags || [],
      pdfUrl,
      pdfPublicId,
      coverImage,
      coverImagePublicId,
      isPublished: isPublished || false,
      publishedAt: isPublished ? new Date() : null,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Events created successfully',
      data: events
    });
  } catch (error) {
    // Clean up uploaded files if database save fails
    if (req.files) {
      if (req.files.pdf && pdfPublicId) {
        await uploadService.deleteFile(pdfPublicId, 'raw').catch(err => 
          console.error('Failed to cleanup PDF:', err)
        );
      }
      if (req.files.coverImage && coverImagePublicId) {
        await uploadService.deleteFile(coverImagePublicId, 'image').catch(err => 
          console.error('Failed to cleanup cover image:', err)
        );
      }
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Events (with pagination, search, filters)
const getAllEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      tag = '',
      author = '',
      isPublished,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    const query = {};

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by tag
    if (tag) {
      query.tags = tag;
    }

    // Filter by author
    if (author) {
      query.author = new RegExp(author, 'i'); // Case-insensitive
    }

    // Filter by published status
    if (isPublished !== undefined) {
      query.isPublished = isPublished === 'true';
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    // Execute query
    const [events, total] = await Promise.all([
      Events.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email')
        .lean(),
      Events.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: events,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Research by ID
const getResearchById = async (req, res) => {
  try {
    const { id } = req.params;

    const events = await Events.findById(id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!events) {
      return res.status(404).json({
        success: false,
        message: 'Events not found'
      });
    }

    res.json({
      success: true,
      data: research
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid research ID'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Events
const updateEvents = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.validatedBody };

    // Find existing research
    const events = await Events.findById(id);
    
    if (!events) {
      return res.status(404).json({
        success: false,
        message: 'Events not found'
      });
    }

    // Handle PDF replacement
    if (req.files && req.files.pdf) {
      // Delete old PDF if exists
      if (events.pdfPublicId) {
        await uploadService.deleteFile(events.pdfPublicId, 'raw')
          .catch(err => console.error('Failed to delete old PDF:', err));
      }

      // Upload new PDF
      const pdfResult = await uploadService.uploadPDF(
        req.files.pdf[0].buffer,
        { folder: 'research/pdfs' }
      );
      updateData.pdfUrl = pdfResult.secure_url;
      updateData.pdfPublicId = pdfResult.public_id;
    }

    // Handle cover image replacement
    if (req.files && req.files.coverImage) {
      // Delete old image if exists
      if (events.coverImagePublicId) {
        await uploadService.deleteFile(events.coverImagePublicId, 'image')
          .catch(err => console.error('Failed to delete old cover:', err));
      }

      // Upload new image
      const imageResult = await uploadService.uploadImage(
        req.files.coverImage[0].buffer,
        { folder: 'events/covers' }
      );
      updateData.coverImage = imageResult.secure_url;
      updateData.coverImagePublicId = imageResult.public_id;
    }

    // Update publishedAt if publishing
    if (updateData.isPublished && !events.isPublished) {
      updateData.publishedAt = new Date();
    }

    // Set updatedBy
    updateData.updatedBy = req.user.id;

    // Update events
    const updatedEvents = await Events.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.json({
      success: true,
      message: 'Events updated successfully',
      data: updatedEvents
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid research ID'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Research
const deleteResearch = async (req, res) => {
  try {
    const { id } = req.params;

    const events = await Events.findById(id);

    if (!events) {
      return res.status(404).json({
        success: false,
        message: 'Events not found'
      });
    }

    // Delete associated files from Cloudinary
    const deletePromises = [];

    if (events.pdfPublicId) {
      deletePromises.push(
        uploadService.deleteFile(events.pdfPublicId, 'raw')
          .catch(err => console.error('Failed to delete PDF:', err))
      );
    }

    if (events.coverImagePublicId) {
      deletePromises.push(
        uploadService.deleteFile(events.coverImagePublicId, 'image')
          .catch(err => console.error('Failed to delete cover:', err))
      );
    }

    // Wait for file deletions (don't block if they fail)
    await Promise.allSettled(deletePromises);

    // Delete from database
    await events.deleteOne();

    res.json({
      success: true,
      message: 'Events deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid research ID'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get unique tags (useful for filters)
const getTags = async (req, res) => {
  try {
    const tags = await Events.distinct('tags');
    
    res.json({
      success: true,
      data: tags.filter(tag => tag) // Remove empty strings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export {  createEvents,
  getAllEvents,
  getEventsById,
  updateEvents,
  deleteEvents,
  getTags
};