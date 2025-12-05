import Partner from '../models/partner.model.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../utilities/cloudinary.js";

// ---------------- CREATE PARTNER ----------------
export const createPartner = async (req, res) => {
  try {
    const data = req.validatedBody;

    let logoUrl = null;
    let logoPublicId = null;

    if (req.file) {
      const upload = await uploadBufferToCloudinary(
        req.file.buffer,
        "partners/logos"
      );

      logoUrl = upload.secure_url;
      logoPublicId = upload.public_id;
    }

    const partner = await Partner.create({
      ...data,
      logo: logoUrl,
      logoPublicId,
      createdBy: req.admin._id,
      publishedAt: data.isPublished ? new Date() : null,
    });

    res.status(201).json({
      success: true,
      message: "Partner created successfully",
      data: partner,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- GET ALL PARTNERS ----------------
export const getAllPartners = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, partnerType, isPublished } = req.query;

    const query = {};

    // Filter by partnerType
    if (partnerType) query.partnerType = partnerType;

    // Filter by published status
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Partner.countDocuments(query);

    const partners = await Partner.find(query)
      .sort({ order: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: partners,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ---------------- GET SINGLE PARTNER ----------------
export const getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    res.json({
      success: true,
      data: partner,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- UPDATE PARTNER ----------------
export const updatePartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    // Apply updates
    Object.assign(partner, req.validatedBody);

    // Replace logo image?
    if (req.file) {
      if (partner.logoPublicId) {
        await deleteFromCloudinary(partner.logoPublicId);
      }

      const upload = await uploadBufferToCloudinary(
        req.file.buffer,
        "partners/logos"
      );

      partner.logo = upload.secure_url;
      partner.logoPublicId = upload.public_id;
    }

    // PublishedAt logic
    if (req.validatedBody.isPublished && !partner.isPublished) {
      partner.publishedAt = new Date();
    }

    partner.updatedBy = req.admin._id;

    await partner.save();

    res.json({
      success: true,
      message: "Partner updated successfully",
      data: partner,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- DELETE PARTNER ----------------
export const deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    if (partner.logoPublicId) {
      await deleteFromCloudinary(partner.logoPublicId);
    }

    await partner.deleteOne();

    res.json({
      success: true,
      message: "Partner deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
