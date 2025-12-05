import mongoose from "mongoose";

const homeSettingsSchema = new mongoose.Schema({
  heroTitle: { type: String, trim: true },
  heroSubtitle: { type: String, trim: true },
  ctaText: { type: String, trim: true },
  ctaLink: { type: String, trim: true },

  featuredResearch: [{ type: mongoose.Schema.Types.ObjectId, ref: "Research" }],
  featuredPublications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Publication" }],

  highlights: [
    {
      title: String,
      description: String,
      icon: String, // optional (if UI uses icons)
    }
  ],

  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
}, { timestamps: true });

export default mongoose.model("HomeSettings", homeSettingsSchema);
