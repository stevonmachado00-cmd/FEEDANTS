const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  categories: [{ type: String }],
  highlights: [{ type: String }],
  prizePool: { type: Number, required: true },
  entryFee: { type: Number, required: true },
  totalSpots: { type: Number, required: true },
  bookedSpots: { type: Number, default: 0 },
  judge: {
    name: String,
    title: String,
    experience: String,
    avatarUrl: String,
    introVideoUrl: String
  },
  timeline: {
    registrationDeadline: Date,
    submissionStart: Date,
    submissionEnd: Date,
    resultDate: Date
  },
  rewards: [{
    position: Number,
    label: String,
    amount: Number,
    icon: String
  }],
  previousWinners: [{
    name: String,
    rank: String,
    avatarUrl: String,
    hasVideo: Boolean
  }],
  details: {
    about: String,
    judgingParameters: String,
    rulesAndEligibility: String
  },
  status: {
    type: String,
    enum: ['draft', 'registration_open', 'registration_closed', 'submission_open', 'submission_closed', 'judging', 'completed'],
    default: 'registration_open'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

competitionSchema.virtual('remainingSpots').get(function() {
  return this.totalSpots - this.bookedSpots;
});

competitionSchema.methods.isRegistrationOpen = function() {
  if (this.status !== 'registration_open') return false;
  if (this.timeline && this.timeline.registrationDeadline) {
    return new Date() <= this.timeline.registrationDeadline;
  }
  return true;
};

module.exports = mongoose.model('Competition', competitionSchema);
