const express     = require('express');
const router      = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadProject } = require('../config/cloudinary');
const {
  getProjects, getAllProjects, getProjectById,
  createProject, updateProject, deleteProject,
} = require('../controllers/projectController');

// Accept: cover (1), photos (20 images), videos (5 video files)
const upload = uploadProject.fields([
  { name: 'cover',  maxCount: 1  },
  { name: 'photos', maxCount: 20 },
  { name: 'videos', maxCount: 5  },
]);

const withUpload = (handler) => (req, res, next) => {
  upload(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    handler(req, res, next);
  });
};

// Public
router.get('/',    getProjects);
router.get('/:id', getProjectById);

// Admin
router.get('/admin/all', protect, getAllProjects);
router.post('/',         protect, withUpload(createProject));
router.put('/:id',       protect, withUpload(updateProject));
router.delete('/:id',    protect, deleteProject);

module.exports = router;
