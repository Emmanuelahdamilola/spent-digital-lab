import mongoose from 'mongoose';


const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [3000, 'Description cannot exceed 3000 characters']
  },
  duration: {
    type: String,
    trim: true
  },
  eligibility: {
    type: String,
    trim: true
  },
  programType: {
    type: String,
    enum: ['undergraduate', 'graduate', 'phd', 'certificate', 'diploma', 'short-course', 'other'],
    default: 'other'
  },
  coverImage: {
    type: String
  },
  coverImagePublicId: {
    type: String
  },
  brochureUrl: {
    type: String
  },
  brochurePublicId: {
    type: String
  },
  applicationLink: {
    type: String,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

programSchema.index({ title: 'text', description: 'text' });
programSchema.index({ programType: 1 });

const Programs = mongoose.model('Program', programSchema);

export default Programs;