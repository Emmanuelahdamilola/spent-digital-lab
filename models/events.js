import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    location: { type: String, required: true },

    eventType: {
      type: String,
      enum: [
        "conference",
        "workshop",
        "seminar",
        "webinar",
        "symposium",
        "other",
      ],
      default: "other",
    },

    registrationLink: { type: String },

    pdfUrl: { type: String },
    pdfPublicId: { type: String },

    coverImageUrl: { type: String },
    coverImagePublicId: { type: String },

    tags: { type: [String], default: [] },

    isPublished: { type: Boolean, default: false },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
