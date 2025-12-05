import Team from "../models/team.js";
import { uploadService } from "../services/uploadService.js";

export const createTeam = async (req, res) => {
  try {
    const teamData = { ...req.validatedBody };
    if (req.file) {
      const result = await uploadService.uploadImage(req.file.buffer, { folder: "team/profiles" });
      teamData.profileImage = result.secure_url;
      teamData.profileImagePublicId = result.public_id;
    }
    if (teamData.isPublished) teamData.publishedAt = new Date();
    teamData.createdBy = req.user.id;

    const team = await Team.create(teamData);
    res.status(201).json({ success: true, message: "Team created successfully", data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTeam = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", department = "", isPublished, sortBy = "order", order = "asc" } = req.query;
    const query = {};
    if (search) query.$text = { $search: search };
    if (department) query.department = department;
    if (isPublished !== undefined) query.isPublished = isPublished === "true";

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    const [teams, total] = await Promise.all([
      Team.find(query).sort({ [sortBy]: sortOrder }).skip(skip).limit(parseInt(limit))
        .populate("createdBy", "name email").populate("updatedBy", "name email").lean(),
      Team.countDocuments(query),
    ]);

    res.json({ success: true, data: teams, pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("createdBy", "name email").populate("updatedBy", "name email");
    if (!team) return res.status(404).json({ success: false, message: "Team not found" });
    res.json({ success: true, data: team });
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid team ID" });
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: "Team not found" });

    const updateData = { ...req.validatedBody };
    if (req.file) {
      if (team.profileImagePublicId) await uploadService.deleteFile(team.profileImagePublicId, "image").catch(console.error);
      const result = await uploadService.uploadImage(req.file.buffer, { folder: "team/profiles" });
      updateData.profileImage = result.secure_url;
      updateData.profileImagePublicId = result.public_id;
    }

    if (updateData.isPublished && !team.isPublished) updateData.publishedAt = new Date();
    updateData.updatedBy = req.user.id;

    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("createdBy", "name email").populate("updatedBy", "name email");

    res.json({ success: true, message: "Team updated successfully", data: updatedTeam });
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid team ID" });
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: "Team not found" });

    if (team.profileImagePublicId) await uploadService.deleteFile(team.profileImagePublicId, "image").catch(console.error);
    await team.deleteOne();
    res.json({ success: true, message: "Team deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid team ID" });
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTags = async (req, res) => {
  try {
    const departments = await Team.distinct("department");
    res.json({ success: true, data: departments.filter(d => d) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
