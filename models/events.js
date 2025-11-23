import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(v) {
        return v >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  eventType: {
    type: String,
    enum: ['conference', 'workshop', 'seminar', 'webinar', 'symposium', 'other'],
    default: 'other'
  },
  coverImage: {
    type: String
  },
  coverImagePublicId: {
    type: String
  },
  registrationLink: {
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

eventSchema.index({ title: 'text', description: 'text', location: 'text' });
eventSchema.index({ startDate: -1 });
eventSchema.index({ eventType: 1 });

export default mongoose.model('Event', eventSchema);