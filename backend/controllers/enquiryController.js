const Enquiry = require('../models/Enquiry');

// POST /api/enquiries — public
const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, eventType, eventDate, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const enquiry = await Enquiry.create({ name, email, phone, eventType, eventDate, message });
    res.status(201).json({ message: 'Enquiry submitted successfully', id: enquiry._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/enquiries — admin
const getEnquiries = async (req, res) => {
  try {
    const { contacted, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (contacted !== undefined) filter.contacted = contacted === 'true';

    const skip = (Number(page) - 1) * Number(limit);
    const [enquiries, total] = await Promise.all([
      Enquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Enquiry.countDocuments(filter),
    ]);

    res.json({ enquiries, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/enquiries/:id — admin
const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/enquiries/:id — admin (toggle contacted, add notes)
const updateEnquiry = async (req, res) => {
  try {
    const { contacted, notes } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });

    if (contacted !== undefined) enquiry.contacted = contacted;
    if (notes !== undefined)     enquiry.notes     = notes;

    await enquiry.save();
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/enquiries/:id — admin
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
    await enquiry.deleteOne();
    res.json({ message: 'Enquiry deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createEnquiry, getEnquiries, getEnquiryById, updateEnquiry, deleteEnquiry };
