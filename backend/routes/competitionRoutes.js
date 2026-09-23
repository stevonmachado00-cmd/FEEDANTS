const express = require('express');
const router = express.Router();
const competitionController = require('../controllers/competitionController');

router.get('/', competitionController.getActiveCompetition);
router.get('/active', competitionController.getActiveCompetition);
router.get('/:id', competitionController.getCompetitionById);
router.get('/:id/status', competitionController.getCompetitionStatus);

module.exports = router;
