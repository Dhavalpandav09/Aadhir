const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true, lowercase: true },
  phone:     { type: String, trim: true },
  eventType: {
    type: String,
    enum: ['Wedding', 'Pre-wedding', 'Events', 'Portraits', 'Nature', 'Fashion', 'Corporate', 'Other'],
    default: 'Other',
  },
  eventDate: { type: Date },
  message:   { type: String, required: true },
  contacted: { type: Boolean, default: false },
  notes:     { type: String },
}, { timestamps: true });

enquirySchema.index({ contacted: 1 });
enquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Enquiry', enquirySchema);
