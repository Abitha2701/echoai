const express = require('express');
const router = express.Router();
const { getNews, getNewsByCategory, searchNews, getArticleById } = require('../controllers/newsController');
const { protect } = require('../middleware/auth');

router.get('/', getNews);
router.get('/category/:category', getNewsByCategory);
router.get('/search', searchNews);
router.get('/:id', getArticleById);

module.exports = router;