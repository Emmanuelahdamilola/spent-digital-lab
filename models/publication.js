import mongoose from 'mongoose';

const publicationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 300 },
  abstract: { type: String, required: true, trim: true, maxlength: 3000 },
  authors: {
    type: [String],
    required: true,
    validate: {
      validator: arr => arr.length > 0,
      message: 'At least one author is required'
    }
  },
  journal: { type: String, trim: true },
  year: { type: Number, required: true },
  doi: { type: String, trim: true },
  externalLink: { type: String, trim: true },
  pdfUrl: { type: String },
  pdfPublicId: { type: String },
  coverImage: { type: String },
  coverImagePublicId: { type: String },
  tags: { type: [String], default: [] },
  citations: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

// Indexes
publicationSchema.index({ title: 'text', abstract: 'text', authors: 'text' });
publicationSchema.index({ tags: 1 });
publicationSchema.index({ year: -1 });

export default mongoose.model('Publication', publicationSchema);
