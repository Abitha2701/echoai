const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false,
    default: ''
  },
  content: {
    type: String
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  imageUrl: {
    type: String
  },
  source: {
    name: String,
    id: String
  },
  category: {
    type: String,
    enum: ['technology', 'science', 'health', 'business', 'entertainment', 'sports', 'environment', 'politics', 'top', 'world', 'crime', 'domestic', 'education', 'food', 'lifestyle', 'other', 'tourism'],
    default: 'technology'
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  aiSummary: {
    type: String
  },
  summaryGeneratedAt: {
    type: Date
  },
  readTime: {
    type: Number,
    default: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
ArticleSchema.index({ category: 1, publishedAt: -1 });
// `url` already has `unique: true` in the schema definition which creates the index.
// Remove the duplicate explicit index declaration to avoid warnings.

module.exports = mongoose.model('Article', ArticleSchema);