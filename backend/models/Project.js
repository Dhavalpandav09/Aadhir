const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  location:    { type: String, required: true, trim: true },
  date:        { type: Date,   required: true },
  description: { type: String, required: true },
  cover:       { type: String, required: true },
  coverCloudinaryId: { type: String, default: '' },

  // Gallery photos
  photos:             [{ type: String }],
  photoCloudinaryIds: [{ type: String }],

  // Videos — YouTube/Vimeo embed URL OR uploaded video URL
  videos: [{
    url:       { type: String, required: true }, // embed or direct URL
    title:     { type: String, default: '' },
    type:      { type: String, enum: ['youtube', 'vimeo', 'upload'], default: 'youtube' },
    cloudinaryId: { type: String, default: '' },
  }],

  category: {
    type: String,
    enum: ['Wedding', 'Pre-wedding', 'Events', 'Portraits', 'Nature', 'Fashion', 'Corporate', 'Other'],
    default: 'Other',
  },
  featured:    { type: Boolean, default: false },
  published:   { type: Boolean, default: true },
}, { timestamps: true });

projectSchema.index({ date: -1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ category: 1 });

module.exports = mongoose.model('Project', projectSchema);
