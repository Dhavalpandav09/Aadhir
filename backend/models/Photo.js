const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  src:      { type: String, required: true },
  cloudinaryId: { type: String },
  category: {
    type: String,
    required: true,
    enum: ['Wedding', 'Pre-wedding', 'Events', 'Portraits', 'Nature', 'Fashion', 'Other'],
  },
  location: { type: String, trim: true },
  featured: { type: Boolean, default: false },
  order:    { type: Number, default: 0 },
}, { timestamps: true });

photoSchema.index({ category: 1 });
photoSchema.index({ featured: 1 });

module.exports = mongoose.model('Photo', photoSchema);
