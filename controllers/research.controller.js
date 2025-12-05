import Research from "../models/research.js";
import { uploadService } from "../services/uploadService.js";

const createResearch = async (req, res) => {
  let pdfPublicId, coverImagePublicId;

  try {
    const body = req.validatedBody || {};

    // Normalize arrays
    const authors = Array.isArray(body.authors) ? body.authors : body.authors ? [body.authors] : [];
    const tags = Array.isArray(body.tags) ? body.tags : body.tags ? [body.tags] : [];
    const categories = Array.isArray(body.categories) ? body.categories : body.categories ? [body.categories] : [];

    // Upload files
    if (req.files?.pdf?.[0]) {
      const pdfResult = await uploadService.uploadPDF(req.files.pdf[0].buffer, { folder: "research/pdfs" });
      body.pdfUrl = pdfResult.secure_url;
      body.pdfPublicId = pdfResult.public_id;
      pdfPublicId = pdfResult.public_id;
    }

    if (req.files?.coverImage?.[0]) {
      const imageResult = await uploadService.uploadImage(req.files.coverImage[0].buffer, { folder: "research/covers" });
      body.coverImage = imageResult.secure_url;
      body.coverImagePublicId = imageResult.public_id;
      coverImagePublicId = imageResult.public_id;
    }

    const doc = await Research.create({
      ...body,
      authors,
      tags,
      categories,
      publishedAt: body.isPublished ? new Date() : null,
      createdBy: req.user.id
    });

    return res.status(201).json({ success: true, message: "Research created", data: doc });
  } catch (error) {
    if (pdfPublicId) await uploadService.deleteFile(pdfPublicId, "raw").catch(() => {});
    if (coverImagePublicId) await uploadService.deleteFile(coverImagePublicId, "image").catch(() => {});
    console.error("createResearch error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllResearch = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", tag = "", author = "", isPublished, sortBy = "createdAt", order = "desc" } = req.query;
    const query = {};

    if (search) query.$text = { $search: search };
    if (tag) query.tags = tag;
    if (author) query.authors = new RegExp(author, "i");
    if (isPublished !== undefined) query.isPublished = isPublished === "true";

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    const [docs, total] = await Promise.all([
      Research.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .lean(),
      Research.countDocuments(query)
    ]);

    return res.json({
      success: true,
      data: docs,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    console.error("getAllResearch error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getResearchById = async (req, res) => {
  try {
    const doc = await Research.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!doc) return res.status(404).json({ success: false, message: "Research not found" });
    return res.json({ success: true, data: doc });
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid ID" });
    console.error("getResearchById error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateResearch = async (req, res) => {
  let newPdfPublicId, newCoverPublicId;

  try {
    const body = req.validatedBody || {};
    const doc = await Research.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Research not found" });

    // Replace PDF
    if (req.files?.pdf?.[0]) {
      if (doc.pdfPublicId) await uploadService.deleteFile(doc.pdfPublicId, "raw").catch(() => {});
      const pdfResult = await uploadService.uploadPDF(req.files.pdf[0].buffer, { folder: "research/pdfs" });
      body.pdfUrl = pdfResult.secure_url;
      body.pdfPublicId = pdfResult.public_id;
      newPdfPublicId = pdfResult.public_id;
    }

    // Replace cover image
    if (req.files?.coverImage?.[0]) {
      if (doc.coverImagePublicId) await uploadService.deleteFile(doc.coverImagePublicId, "image").catch(() => {});
      const imageResult = await uploadService.uploadImage(req.files.coverImage[0].buffer, { folder: "research/covers" });
      body.coverImage = imageResult.secure_url;
      body.coverImagePublicId = imageResult.public_id;
      newCoverPublicId = imageResult.public_id;
    }

    // Normalize arrays
    ["authors", "tags", "categories"].forEach(key => {
      if (body[key] && typeof body[key] === "string") body[key] = [body[key]];
    });

    if (body.isPublished && !doc.isPublished) body.publishedAt = new Date();
    body.updatedBy = req.user.id;

    const updated = await Research.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true })
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    return res.json({ success: true, message: "Research updated", data: updated });
  } catch (error) {
    if (newPdfPublicId) await uploadService.deleteFile(newPdfPublicId, "raw").catch(() => {});
    if (newCoverPublicId) await uploadService.deleteFile(newCoverPublicId, "image").catch(() => {});
    console.error("updateResearch error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteResearch = async (req, res) => {
  try {
    const doc = await Research.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Research not found" });

    const deletePromises = [];
    if (doc.pdfPublicId) deletePromises.push(uploadService.deleteFile(doc.pdfPublicId, "raw").catch(() => {}));
    if (doc.coverImagePublicId) deletePromises.push(uploadService.deleteFile(doc.coverImagePublicId, "image").catch(() => {}));
    await Promise.allSettled(deletePromises);

    await doc.deleteOne();
    return res.json({ success: true, message: "Research deleted" });
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid ID" });
    console.error("deleteResearch error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getTags = async (req, res) => {
  try {
    const tags = await Research.distinct("tags");
    return res.json({ success: true, data: tags.filter(Boolean) });
  } catch (error) {
    console.error("getTags error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  createResearch,
  getAllResearch,
  getResearchById,
  updateResearch,
  deleteResearch,
  getTags
};
