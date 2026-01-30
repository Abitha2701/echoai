const mongoose = require('mongoose');

const SavedSummarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  tags: [String],
  savedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound index to prevent duplicate saves
SavedSummarySchema.index({ user: 1, article: 1 }, { unique: true });

module.exports = mongoose.model('SavedSummary', SavedSummarySchema);