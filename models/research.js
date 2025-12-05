// models/Research.js
import mongoose from 'mongoose';

const researchSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 300 },
  abstract: { type: String, trim: true },
  authors: [{ type: String, trim: true }], // or object refs if you model authors
  tags: { type: [String], default: [] },
  categories: { type: [String], default: [] },
  pdfUrl: { type: String },             // cloudinary secure_url
  pdfPublicId: { type: String },
  coverImage: { type: String },
  coverImagePublicId: { type: String },
  publishedAt: { type: Date },
  isPublished: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

researchSchema.index({ title: 'text', abstract: 'text', authors: 'text', tags: 'text' });

export default mongoose.model('Research', researchSchema);
