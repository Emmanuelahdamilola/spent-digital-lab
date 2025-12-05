import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Partner name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  logo: {
    type: String,
    required: [true, 'Logo is required']
  },
  logoPublicId: {
    type: String
  },
  website: {
    type: String,
    trim: true
  },
  partnerType: {
    type: String,
    enum: ['academic', 'industry', 'government', 'ngo', 'funding', 'other'],
    default: 'other'
  },
  order: {
    type: Number,
    default: 0
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
}, { timestamps: true });

// Indexes for search and filtering
partnerSchema.index({ name: 'text', description: 'text' });
partnerSchema.index({ partnerType: 1 });
partnerSchema.index({ order: 1 });
partnerSchema.index({ isPublished: 1 });

export default mongoose.model('Partner', partnerSchema);
