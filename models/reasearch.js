import mongoose from'mongoose';

const researchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    trim: true,
    maxlength: [2000, 'Summary cannot exceed 2000 characters']
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(tags) {
        return tags.length <= 10;
      },
      message: 'Cannot have more than 10 tags'
    }
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  pdfUrl: {
    type: String,
    default: null
  },
  pdfPublicId: {
    type: String,
    default: null
  },
  coverImage: {
    type: String,
    default: null
  },
  coverImagePublicId: {
    type: String,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
researchSchema.index({ title: 'text', summary: 'text', author: 'text' });
researchSchema.index({ tags: 1 });
researchSchema.index({ createdAt: -1 });
researchSchema.index({ isPublished: 1 });

// Virtual for full author info if needed
researchSchema.virtual('createdByAdmin', {
  ref: 'Admin',
  localField: 'createdBy',
  foreignField: '_id',
  justOne: true
});

const Research = mongoose.model('Research', researchSchema);

export default Research;