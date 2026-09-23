const Competition = require('../models/Competition');
const Registration = require('../models/Registration');

exports.registerForCompetition = async (req, res, next) => {
  try {
    const { id: competitionId } = req.params;
    const userId = req.user.id;

    // Check if already registered
    const existingReg = await Registration.findOne({ userId, competitionId });
    if (existingReg) {
      return res.status(400).json({ success: false, message: 'Already registered for this competition' });
    }

    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    // Atomic update
    const updatedCompetition = await Competition.findOneAndUpdate(
      { 
        _id: competitionId, 
        status: 'registration_open',
        $expr: { $lt: ['$bookedSpots', '$totalSpots'] }
      },
      { $inc: { bookedSpots: 1 } },
      { new: true }
    );

    if (!updatedCompetition) {
      return res.status(400).json({ 
        success: false, 
        message: 'Registration is closed or competition is full' 
      });
    }

    const registration = await Registration.create({
      userId,
      competitionId,
      paidAmount: updatedCompetition.entryFee
    });

    res.status(201).json({
      success: true,
      competition: updatedCompetition,
      registration
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Already registered' });
    }
    next(error);
  }
};

exports.checkRegistration = async (req, res, next) => {
  try {
    const { compId } = req.params;
    const userId = req.user.id;

    const registration = await Registration.findOne({ userId, competitionId: compId });
    
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Not registered' });
    }

    res.status(200).json({ success: true, status: registration.status, registration });
  } catch (error) {
    next(error);
  }
};
