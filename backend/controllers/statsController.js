const Photo   = require('../models/Photo');
const Project = require('../models/Project');
const Enquiry = require('../models/Enquiry');

const getStats = async (req, res) => {
  try {
    const [
      totalPhotos,
      totalProjects,
      totalEnquiries,
      pendingEnquiries,
      recentEnquiries,
    ] = await Promise.all([
      Photo.countDocuments(),
      Project.countDocuments(),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ contacted: false }),
      Enquiry.find().sort({ createdAt: -1 }).limit(5).select('name email eventType createdAt contacted'),
    ]);

    res.json({
      totalPhotos,
      totalProjects,
      totalEnquiries,
      pendingEnquiries,
      recentEnquiries,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStats };
