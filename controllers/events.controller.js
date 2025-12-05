import Event from "../models/events.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

// ---------------- CREATE EVENT ----------------
export const createEvent = async (req, res) => {
  try {
    const data = req.validatedBody;

    let pdfUrl, pdfPublicId;
    let coverImageUrl, coverImagePublicId;

    // Upload PDF
    if (req.files?.pdf) {
      const pdfUpload = await uploadBufferToCloudinary(
        req.files.pdf[0].buffer,
        "events/pdfs"
      );

      pdfUrl = pdfUpload.secure_url;
      pdfPublicId = pdfUpload.public_id;
    }

    // Upload cover image
    if (req.files?.coverImage) {
      const imageUpload = await uploadBufferToCloudinary(
        req.files.coverImage[0].buffer,
        "events/covers"
      );

      coverImageUrl = imageUpload.secure_url;
      coverImagePublicId = imageUpload.public_id;
    }

    const event = await Event.create({
      ...data,
      pdfUrl,
      pdfPublicId,
      coverImageUrl,
      coverImagePublicId,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- GET ALL EVENTS ----------------
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- GET SINGLE EVENT ----------------
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- UPDATE EVENT ----------------
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    // Apply data updates
    Object.assign(event, req.validatedBody);

    // Replace PDF?
    if (req.files?.pdf) {
      if (event.pdfPublicId) await deleteFromCloudinary(event.pdfPublicId);

      const pdfUpload = await uploadBufferToCloudinary(
        req.files.pdf[0].buffer,
        "events/pdfs"
      );

      event.pdfUrl = pdfUpload.secure_url;
      event.pdfPublicId = pdfUpload.public_id;
    }

    // Replace cover image?
    if (req.files?.coverImage) {
      if (event.coverImagePublicId)
        await deleteFromCloudinary(event.coverImagePublicId);

      const imageUpload = await uploadBufferToCloudinary(
        req.files.coverImage[0].buffer,
        "events/covers"
      );

      event.coverImageUrl = imageUpload.secure_url;
      event.coverImagePublicId = imageUpload.public_id;
    }

    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- DELETE EVENT ----------------
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    // Delete cloudinary files
    if (event.pdfPublicId) await deleteFromCloudinary(event.pdfPublicId);
    if (event.coverImagePublicId)
      await deleteFromCloudinary(event.coverImagePublicId);

    await event.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- GET TAGS ----------------
export const getTags = async (req, res) => {
  try {
    const tags = await Event.distinct("tags");

    return res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
