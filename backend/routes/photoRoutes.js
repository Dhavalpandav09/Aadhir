const express     = require('express');
const router      = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadPhoto } = require('../config/cloudinary');
const {
  getPhotos, getPhotoById, createPhoto, updatePhoto, deletePhoto,
} = require('../controllers/photoController');

// Multer error handler wrapper
const withUpload = (multerFn, handler) => (req, res, next) => {
  multerFn(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    handler(req, res, next);
  });
};

const single = uploadPhoto.single('image');

// ── Public ────────────────────────────────────────────────────────────────────
router.get('/',    getPhotos);
router.get('/:id', getPhotoById);

// ── Admin ─────────────────────────────────────────────────────────────────────
router.post('/',      protect, withUpload(single, createPhoto));
router.put('/:id',    protect, withUpload(single, updatePhoto));
router.delete('/:id', protect, deletePhoto);

module.exports = router;
