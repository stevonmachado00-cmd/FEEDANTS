const Submission = require('../models/Submission');
const Registration = require('../models/Registration');
const Competition = require('../models/Competition');

exports.createSubmission = async (req, res, next) => {
  try {
    const { id: competitionId } = req.params;
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const registration = await Registration.findOne({ userId, competitionId });
    if (!registration) {
      return res.status(403).json({ success: false, message: 'Must be registered to submit' });
    }

    const competition = await Competition.findById(competitionId);
    const now = new Date();
    
    if (now < competition.timeline.submissionStart || now > competition.timeline.submissionEnd) {
      return res.status(400).json({ success: false, message: 'Submission window is not open' });
    }

    const submission = await Submission.create({
      userId,
      competitionId,
      registrationId: registration._id,
      fileUrl: req.file.path,
      description: req.body.description || ''
    });

    res.status(201).json({ success: true, submission });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Submission already exists' });
    }
    next(error);
  }
};

exports.getSubmission = async (req, res, next) => {
  try {
    const { id: competitionId } = req.params;
    const userId = req.user.id;

    const submission = await Submission.findOne({ userId, competitionId });
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    res.status(200).json({ success: true, submission });
  } catch (error) {
    next(error);
  }
};

exports.updateSubmission = async (req, res, next) => {
  try {
    const { id: competitionId } = req.params;
    const userId = req.user.id;

    const submission = await Submission.findOne({ userId, competitionId });
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    const competition = await Competition.findById(competitionId);
    const now = new Date();
    if (now < competition.timeline.submissionStart || now > competition.timeline.submissionEnd) {
      return res.status(400).json({ success: false, message: 'Submission window is not open' });
    }

    if (req.file) {
      submission.fileUrl = req.file.path;
    }
    if (req.body.description !== undefined) {
      submission.description = req.body.description;
    }

    await submission.save();

    res.status(200).json({ success: true, submission });
  } catch (error) {
    next(error);
  }
};
