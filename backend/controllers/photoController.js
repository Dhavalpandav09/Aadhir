const Photo = require('../models/Photo');
const { cloudinary, getFileUrl, hasCloudinary } = require('../config/cloudinary');

const toBool = (val) => {
  if (val === undefined || val === null) return undefined;
  if (typeof val === 'boolean') return val;
  return String(val).toLowerCase() === 'true';
};

// GET /api/photos  — public
const getPhotos = async (req, res) => {
  try {
    const { category, featured, limit = 50, page = 1 } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (featured === 'true')            filter.featured  = true;

    const skip = (Number(page) - 1) * Number(limit);
    const [photos, total] = await Promise.all([
      Photo.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Photo.countDocuments(filter),
    ]);

    res.json({ photos, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/photos/:id  — public
const getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });
    res.json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/photos  — admin
const createPhoto = async (req, res) => {
  try {
    const { title, category, location } = req.body;
    const featured = toBool(req.body.featured);

    if (!title)    return res.status(400).json({ error: 'Title is required' });
    if (!category) return res.status(400).json({ error: 'Category is required' });

    let src          = req.body.src || '';
    let cloudinaryId = '';

    if (req.file) {
      src          = getFileUrl(req, req.file);
      cloudinaryId = req.file.filename;
    }

    if (!src) return res.status(400).json({ error: 'Image source is required (upload a file or provide a URL)' });

    const photo = await Photo.create({
      title, src, cloudinaryId, category, location,
      featured: featured !== undefined ? featured : false,
    });
    res.status(201).json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/photos/:id  — admin
const updatePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });

    if (req.body.title    !== undefined) photo.title    = req.body.title;
    if (req.body.category !== undefined) photo.category = req.body.category;
    if (req.body.location !== undefined) photo.location = req.body.location;
    if (req.body.order    !== undefined) photo.order    = Number(req.body.order);
    if (req.body.featured !== undefined) photo.featured = toBool(req.body.featured);

    if (req.file) {
      if (hasCloudinary && photo.cloudinaryId) {
        try { await cloudinary.uploader.destroy(photo.cloudinaryId); } catch (_) {}
      }
      photo.src          = getFileUrl(req, req.file);
      photo.cloudinaryId = req.file.filename;
    }

    await photo.save();
    res.json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/photos/:id  — admin
const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });

    if (hasCloudinary && photo.cloudinaryId) {
      try { await cloudinary.uploader.destroy(photo.cloudinaryId); } catch (_) {}
    }

    await photo.deleteOne();
    res.json({ message: 'Photo deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getPhotos, getPhotoById, createPhoto, updatePhoto, deletePhoto };
