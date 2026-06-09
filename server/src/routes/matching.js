const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matchingController');
const { authenticate, authorize } = require('../middlewares/auth');
const { requirePermission, requirePermissionMinScope } = require('../middlewares/authz');
const { PERMISSIONS } = require('../config/permissions');

router.post('/', authenticate, requirePermissionMinScope(PERMISSIONS.MENTEE_MANAGE), matchingController.createMatch);
router.post('/auto-match', authenticate, requirePermissionMinScope(PERMISSIONS.MENTEE_MANAGE), matchingController.autoMatchPending);
router.get('/suggestions/:enrollmentId', authenticate, requirePermissionMinScope(PERMISSIONS.MENTEE_MANAGE), matchingController.getAISuggestions);
router.get('/mentor-levels', authenticate, matchingController.getMentorAssignedLevels);
router.get('/', authenticate, matchingController.getMatches);
router.patch('/:id/status', authenticate, matchingController.updateMatchStatus);
router.patch('/:id/rate', authenticate, authorize(['mentee', 'mentor', 'admin']), matchingController.submitRating);

module.exports = router;
