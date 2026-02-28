const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const { authenticate, authorize } = require('../middlewares/auth');

// Get all active mentors (admin only)
router.get('/', authenticate, authorize(['admin']), mentorController.getAllMentors);

// Get a single mentor's full profile (admin only)
router.get('/:id', authenticate, authorize(['admin']), mentorController.getMentorById);

module.exports = router;
