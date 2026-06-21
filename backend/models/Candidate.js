const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  position: {
    type: String
  },
  department: {
    type: String
  },
  status: {
    type: String,
    enum: ['applied', 'screening', 'technical', 'hr_round', 'selected', 'rejected'],
    default: 'applied'
  },
  resumeUrl: {
    type: String
  },
  interviewDate: {
    type: Date
  },
  feedback: {
    type: String
  },
  scores: {
    technical: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    overall: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Candidate', candidateSchema);