const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  competitionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition', required: true },
  registrationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration', required: true },
  fileUrl: { type: String, required: true },
  description: { type: String, default: '' }
}, { timestamps: true });

submissionSchema.index({ userId: 1, competitionId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
