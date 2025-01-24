const shortid = require('shortid');
const URL = require('../models/url')

const handleGenerateShortUrl = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({ error: 'url is required' });
    }
    const shortId = shortid();
    await URL.create({
        shortId: shortId,
        redirectUrl: body.url,
        visitedHistory: []
    })
    return res.json({ id: shortId })
}

const handleRedirectShortUrl = async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId,
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now()
            }
        }
    })
    console.log(entry)
    res.redirect(entry.redirectUrl)
}

const handleAnalytics = async (req, res) => {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId })

    return res.json({
        totalClick: result.visitHistory?.length,
        analytics: result.visitHistory
    })
}

module.exports = {
    handleGenerateShortUrl,
    handleRedirectShortUrl,
    handleAnalytics
}