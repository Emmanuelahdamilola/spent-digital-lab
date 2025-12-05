import HomeSettings from "../models/homeSettings.js";

export const getHomeSettings = async (req, res) => {
  try {
    const settings = await HomeSettings.findOne()
      .populate("featuredResearch")
      .populate("featuredPublications");

    return res.json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHomeSettings = async (req, res) => {
  try {
    const body = req.validatedBody;

    const settings = await HomeSettings.findOneAndUpdate(
      {},
      { ...body, updatedBy: req.user.id },
      { new: true, upsert: true }
    )
      .populate("featuredResearch")
      .populate("featuredPublications");

    return res.json({ success: true, message: "Homepage updated", data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
