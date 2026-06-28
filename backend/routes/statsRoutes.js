const express    = require('express');
const router     = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getStats } = require('../controllers/statsController');

router.get('/', protect, getStats);

module.exports = router;
