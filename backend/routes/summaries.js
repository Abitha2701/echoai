const express = require('express');
const router = express.Router();
const { generateSummary, getSavedSummaries, saveArticle, unsaveArticle } = require('../controllers/summaryController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateSummary);
router.get('/saved', protect, getSavedSummaries);
router.post('/save/:articleId', protect, saveArticle);
router.delete('/unsave/:articleId', protect, unsaveArticle);

module.exports = router;