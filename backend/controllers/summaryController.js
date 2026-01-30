const SavedSummary = require('../models/savedSummary');
const Article = require('../models/Article');
const User = require('../models/User');
const aiSummarizer = require('../utils/aiSummarizer');

// @desc    Generate AI summary for an article
// @route   POST /api/summaries/generate
exports.generateSummary = async (req, res) => {
  try {
    const { articleId, text } = req.body;

    let article;
    let summaryText;

    if (articleId) {
      // Get article from database
      article = await Article.findById(articleId);
      if (!article) {
        return res.status(404).json({
          success: false,
          error: 'Article not found'
        });
      }
      summaryText = `${article.title}. ${article.description}`;
    } else if (text) {
      summaryText = text;
    } else {
      return res.status(400).json({
        success: false,
        error: 'Either articleId or text is required'
      });
    }

    // Generate AI summary
    const summary = await aiSummarizer.summarize(summaryText);

    // Update article with summary if articleId provided
    if (articleId && article) {
      article.aiSummary = summary;
      article.summaryGeneratedAt = new Date();
      await article.save();
    }

    res.json({
      success: true,
      data: {
        summary,
        articleId: articleId || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get user's saved summaries
// @route   GET /api/summaries/saved
exports.getSavedSummaries = async (req, res) => {
  try {
    const savedSummaries = await SavedSummary.find({ user: req.user.id })
      .populate('article')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: savedSummaries.length,
      data: savedSummaries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Save article to user's collection
// @route   POST /api/summaries/save/:articleId
exports.saveArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { notes = '' } = req.body;

    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    // Check if already saved
    const existingSave = await SavedSummary.findOne({
      user: req.user.id,
      article: articleId
    });

    if (existingSave) {
      return res.status(400).json({
        success: false,
        error: 'Article already saved'
      });
    }

    // Generate summary if not exists
    let summary = article.aiSummary;
    if (!summary) {
      summary = await aiSummarizer.summarize(`${article.title}. ${article.description}`);
      article.aiSummary = summary;
      article.summaryGeneratedAt = new Date();
      await article.save();
    }

    // Save to user's collection
    const savedSummary = await SavedSummary.create({
      user: req.user.id,
      article: articleId,
      summary,
      notes
    });

    // Add to user's saved articles
    await User.findByIdAndUpdate(req.user.id, {
      $push: { savedArticles: savedSummary._id }
    });

    res.status(201).json({
      success: true,
      data: savedSummary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Remove article from user's saved collection
// @route   DELETE /api/summaries/unsave/:articleId
exports.unsaveArticle = async (req, res) => {
  try {
    const { articleId } = req.params;

    // Find and delete the saved summary
    const savedSummary = await SavedSummary.findOneAndDelete({
      user: req.user.id,
      article: articleId
    });

    if (!savedSummary) {
      return res.status(404).json({
        success: false,
        error: 'Saved article not found'
      });
    }

    // Remove from user's saved articles
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { savedArticles: savedSummary._id }
    });

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
