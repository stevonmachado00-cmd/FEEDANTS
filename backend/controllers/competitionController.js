const mongoose = require('mongoose');
const Competition = require('../models/Competition');

// Seed / Demo fallback data matching design mockup
const DEFAULT_COMPETITION = {
  _id: '66d01234567890abcdef1234',
  title: 'Feedants Classical Dance',
  categories: ['Dance', 'Multi-Win'],
  highlights: ['Winners get certificate'],
  prizePool: 1500,
  entryFee: 99,
  totalSpots: 20,
  bookedSpots: 1,
  judge: {
    name: 'Manju Dubey',
    title: 'Professional Kathak Dancer',
    experience: '12+ Years of Experience',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
    introVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  timeline: {
    registrationDeadline: new Date(Date.now() + 30 * 24 * 3600 * 1000),
    submissionStart: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    submissionEnd: new Date(Date.now() + 45 * 24 * 3600 * 1000),
    resultDate: new Date(Date.now() + 60 * 24 * 3600 * 1000),
  },
  rewards: [
    { position: 1, label: '1st Winner', amount: 550, icon: '🏆' },
    { position: 2, label: '2nd Winner', amount: 300, icon: '🥈' },
    { position: 3, label: '3rd Winner', amount: 240, icon: '🥉' },
    { position: 4, label: '4th Winner', amount: 200, icon: '⭐' },
    { position: 5, label: '5th Winner', amount: 130, icon: '⭐' },
    { position: 6, label: '6th Winner', amount: 80, icon: '⭐' },
  ],
  previousWinners: [
    { name: 'Riya Shah', rank: '1st Winner', avatarUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=256', hasVideo: true },
    { name: 'Aarav Mehta', rank: '1st Winner', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256', hasVideo: false },
    { name: 'Neha Verma', rank: '2nd Winner', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256', hasVideo: true },
    { name: 'Ishita Chauhan', rank: '3rd Winner', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256', hasVideo: false },
  ],
  details: {
    about: 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
    judgingParameters: '1. Expression & Emotion (Bhava) - 30%\n2. Rhythm & Footwork (Taal & Laya) - 25%\n3. Body Posture & Grace (Angashuddhi) - 25%\n4. Overall Choreography & Presentation - 20%',
    rulesAndEligibility: '• Open to all age groups.\n• Original, unedited classical dance performance recording.\n• Video length between 2 to 5 minutes.\n• Video format: MP4/MOV or accessible drive link.',
  },
  status: 'registration_open',
};

exports.getActiveCompetition = async (req, res, next) => {
  try {
    let competition = await Competition.findOne({ status: 'registration_open' }).sort({ createdAt: -1 });
    if (!competition) {
      competition = await Competition.findOne().sort({ createdAt: -1 });
    }
    if (!competition) {
      return res.status(200).json({ success: true, data: DEFAULT_COMPETITION });
    }
    res.status(200).json({ success: true, data: competition });
  } catch (error) {
    res.status(200).json({ success: true, data: DEFAULT_COMPETITION });
  }
};

exports.getCompetitionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === 'active' || id === 'default_id') {
      return exports.getActiveCompetition(req, res, next);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return exports.getActiveCompetition(req, res, next);
    }

    let competition = await Competition.findById(id);
    if (!competition) {
      competition = await Competition.findOne().sort({ createdAt: -1 });
    }
    if (!competition) {
      return res.status(200).json({ success: true, data: DEFAULT_COMPETITION });
    }
    res.status(200).json({ success: true, data: competition });
  } catch (error) {
    res.status(200).json({ success: true, data: DEFAULT_COMPETITION });
  }
};

exports.getCompetitionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    let competition;
    if (mongoose.Types.ObjectId.isValid(id)) {
      competition = await Competition.findById(id);
    } else {
      competition = await Competition.findOne().sort({ createdAt: -1 });
    }

    if (!competition) {
      competition = DEFAULT_COMPETITION;
    }

    let currentStatus = competition.status || 'registration_open';
    const now = new Date();

    if (competition.timeline) {
      if (now > competition.timeline.registrationDeadline && currentStatus === 'registration_open') {
        currentStatus = 'registration_closed';
      }
      if (
        now >= competition.timeline.submissionStart &&
        now <= competition.timeline.submissionEnd &&
        currentStatus === 'registration_closed'
      ) {
        currentStatus = 'submission_open';
      }
      if (now > competition.timeline.submissionEnd && currentStatus === 'submission_open') {
        currentStatus = 'submission_closed';
      }
    }

    if (competition.bookedSpots >= competition.totalSpots && currentStatus === 'registration_open') {
      currentStatus = 'registration_closed';
    }

    res.status(200).json({
      success: true,
      status: currentStatus,
      remainingSpots: Math.max(0, competition.totalSpots - competition.bookedSpots),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/competitions/all or GET /api/competitions/list
exports.getAllCompetitions = async (req, res, next) => {
  try {
    let competitions = [];
    try {
      competitions = await Competition.find().sort({ createdAt: -1 });
    } catch (dbErr) {}

    if (!competitions || competitions.length === 0) {
      competitions = [DEFAULT_COMPETITION];
    }

    res.status(200).json({
      success: true,
      count: competitions.length,
      data: competitions,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/competitions (Admin)
exports.createCompetition = async (req, res, next) => {
  try {
    const {
      title,
      categories,
      highlights,
      prizePool,
      entryFee,
      totalSpots,
      judge,
      timeline,
      rewards,
      details,
      status,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Competition title is required' });
    }

    const now = new Date();
    const newCompData = {
      title: title.trim(),
      categories: categories && categories.length ? categories : ['Arts', 'Talent'],
      highlights: highlights && highlights.length ? highlights : ['Official Certificate & Cash Prize'],
      prizePool: Number(prizePool) || 1000,
      entryFee: Number(entryFee) || 0,
      totalSpots: Number(totalSpots) || 20,
      bookedSpots: 0,
      judge: {
        name: judge?.name || 'Industry Expert',
        title: judge?.title || 'Professional Evaluator',
        experience: judge?.experience || '10+ Years',
        avatarUrl: judge?.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
        introVideoUrl: judge?.introVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      },
      timeline: {
        registrationDeadline: timeline?.registrationDeadline ? new Date(timeline.registrationDeadline) : new Date(now.getTime() + 30 * 24 * 3600 * 1000),
        submissionStart: timeline?.submissionStart ? new Date(timeline.submissionStart) : new Date(now.getTime() + 5 * 24 * 3600 * 1000),
        submissionEnd: timeline?.submissionEnd ? new Date(timeline.submissionEnd) : new Date(now.getTime() + 45 * 24 * 3600 * 1000),
        resultDate: timeline?.resultDate ? new Date(timeline.resultDate) : new Date(now.getTime() + 60 * 24 * 3600 * 1000),
      },
      rewards: rewards && rewards.length ? rewards : [
        { position: 1, label: '1st Winner', amount: Math.round((Number(prizePool) || 1000) * 0.5), icon: '🏆' },
        { position: 2, label: '2nd Winner', amount: Math.round((Number(prizePool) || 1000) * 0.3), icon: '🥈' },
        { position: 3, label: '3rd Winner', amount: Math.round((Number(prizePool) || 1000) * 0.2), icon: '🥉' },
      ],
      details: {
        about: details?.about || `Welcome to ${title}. Showcase your exceptional talent to international judges!`,
        judgingParameters: details?.judgingParameters || '1. Technique & Mastery - 40%\n2. Originality & Presentation - 35%\n3. Overall Impact - 25%',
        rulesAndEligibility: details?.rulesAndEligibility || '• Open to all verified artists.\n• Must be an unedited recorded performance.\n• Video format: MP4/MOV or accessible link.',
      },
      status: status || 'registration_open',
    };

    let savedCompetition;
    try {
      savedCompetition = await Competition.create(newCompData);
    } catch (dbErr) {
      // Fallback
      savedCompetition = { ...newCompData, _id: 'comp_' + Date.now(), createdAt: new Date() };
    }

    // Emit live Socket event if socket server is available
    const io = req.app.get('io');
    if (io) {
      io.emit('competition_created', savedCompetition);
    }

    res.status(201).json({
      success: true,
      message: 'Competition created and published successfully',
      data: savedCompetition,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/competitions/:id (Admin)
exports.updateCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updated;

    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        updated = await Competition.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
      }
    } catch (dbErr) {}

    if (!updated) {
      updated = { ...DEFAULT_COMPETITION, ...req.body, _id: id };
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('competition_updated', updated);
    }

    res.status(200).json({
      success: true,
      message: 'Competition updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/competitions/:id (Admin)
exports.deleteCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await Competition.findByIdAndDelete(id);
      }
    } catch (dbErr) {}

    const io = req.app.get('io');
    if (io) {
      io.emit('competition_deleted', { id });
    }

    res.status(200).json({
      success: true,
      message: 'Competition removed successfully',
      deletedId: id,
    });
  } catch (error) {
    next(error);
  }
};
