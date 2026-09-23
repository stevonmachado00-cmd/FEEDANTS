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
