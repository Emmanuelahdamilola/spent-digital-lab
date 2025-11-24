import mongoose from 'mongoose';

const publicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  abstract: {
    type: String,
    required: [true, 'Abstract is required'],
    trim: true,
    maxlength: [3000, 'Abstract cannot exceed 3000 characters']
  },
  authors: {
    type: [String],
    required: [true, 'At least one author is required'],
    validate: {
      validator: function(authors) {
        return authors.length > 0;
      },
      message: 'At least one author is required'
    }
  },
  journal: {
    type: String,
    trim: true
  },
  publishedDate: {
    type: Date
  },
  doi: {
    type: String,
    trim: true
  },
  pdfUrl: {
    type: String
  },
  pdfPublicId: {
    type: String
  },
  coverImage: {
    type: String
  },
  coverImagePublicId: {
    type: String
  },
  tags: {
    type: [String],
    default: []
  },
  citations: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
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

publicationSchema.index({ title: 'text', abstract: 'text', authors: 'text' });
publicationSchema.index({ tags: 1 });
publicationSchema.index({ publishedDate: -1 });

const Publications = mongoose.model('Publication', publicationSchema);

export default Publications;