const express = require('express');
const router = express.Router();
const competitionController = require('../controllers/competitionController');

router.get('/', competitionController.getAllCompetitions);
router.get('/all', competitionController.getAllCompetitions);
router.get('/active', competitionController.getActiveCompetition);
router.get('/:id', competitionController.getCompetitionById);
router.get('/:id/status', competitionController.getCompetitionStatus);

// Admin Competition Management Endpoints
router.post('/', competitionController.createCompetition);
router.put('/:id', competitionController.updateCompetition);
router.delete('/:id', competitionController.deleteCompetition);

module.exports = router;
