const express    = require('express');
const router     = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createEnquiry, getEnquiries, getEnquiryById, updateEnquiry, deleteEnquiry
} = require('../controllers/enquiryController');

// Public
router.post('/', createEnquiry);

// Admin
router.get('/',    protect, getEnquiries);
router.get('/:id', protect, getEnquiryById);
router.patch('/:id', protect, updateEnquiry);
router.delete('/:id', protect, deleteEnquiry);

module.exports = router;
