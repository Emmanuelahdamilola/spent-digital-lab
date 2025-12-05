import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  duration: { type: String, trim: true },
  eligibility: { type: String, trim: true },
  programType: {
    type: String,
    enum: [
      'undergraduate',
      'graduate',
      'phd',
      'certificate',
      'diploma',
      'short-course',
      'other'
    ],
    default: 'other'
  },
  applicationLink: { type: String, trim: true },
  tags: { type: [String], default: [] },
  pdfUrl: { type: String },
  pdfPublicId: { type: String },
  coverImage: { type: String },
  coverImagePublicId: { type: String },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

programSchema.index({ title: 'text', description: 'text' });
programSchema.index({ programType: 1 });
programSchema.index({ tags: 1 });
programSchema.index({ isPublished: 1 }); 

export default mongoose.model('Program', programSchema);
