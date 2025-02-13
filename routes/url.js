const express = require('express');
const { handleGenerateShortUrl, handleRedirectShortUrl, handleAnalytics, handleAllUrls } = require('../controllers/url');
const router = express.Router();

router.post('/', handleGenerateShortUrl).get('/:shortId', handleRedirectShortUrl);
router.get('/analytics/:shortId', handleAnalytics);

module.exports = router;