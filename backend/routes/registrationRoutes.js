const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/competitions/:id/register', protect, registrationController.registerForCompetition);
router.get('/users/me/registration/:compId', protect, registrationController.checkRegistration);

module.exports = router;
