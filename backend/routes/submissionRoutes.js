const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/competitions/:id/submissions', protect, upload.single('file'), submissionController.createSubmission);
router.get('/competitions/:id/submissions/me', protect, submissionController.getSubmission);
router.put('/competitions/:id/submissions/me', protect, upload.single('file'), submissionController.updateSubmission);

module.exports = router;
