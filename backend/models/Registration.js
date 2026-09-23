const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  competitionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition', required: true },
  status: { type: String, enum: ['registered', 'cancelled'], default: 'registered' },
  paidAmount: { type: Number, required: true }
}, { timestamps: true });

registrationSchema.index({ userId: 1, competitionId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
