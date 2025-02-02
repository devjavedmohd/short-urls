const shortid = require('shortid');
const URL = require('../models/url')

const handleGenerateShortUrl = async (req, res) => {
    const body = req.body;
    if (!body.url) {
        return res.status(400).json({ error: 'url is required' });
    }
    const shortId = shortid();
    await URL.create({
        shortId: shortId,
        redirectUrl: body.url,
        visitedHistory: [],
        createdBy: req.user._id,
    })
    // return res.json({ id: shortId })
    return res.render('home', { id: shortId })
}

const handleRedirectShortUrl = async (req, res) => {
    const shortId = req.params.shortId;
    try {
        const entry = await URL.findOneAndUpdate(
            {
                shortId,
            },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now()
                    }
                }
            },
            { new: true } // Return the updated document
        )
        if (!entry) {
            return res.status(404).json({ error: "Short URL not found" });
        }
        res.redirect(entry.redirectUrl)
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

const handleAnalytics = async (req, res) => {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId })

    return res.json({
        totalClick: result.visitHistory?.length,
        analytics: result.visitHistory
    })
}

const handleAllUrls = async (req, res) => {
    try {
        // Wait for the results of the database query
        const allUrls = await URL.find({});
        // Create an HTML response with the URLs
        let htmlResponse = `
            <html>
                <head>
                    <title>All Shortened URLs</title>
                </head>
                <body>
                    <h1>All Shortened URLs</h1>
                    <ul>
        `;

        // Append each URL as a list item
        allUrls.forEach((url) => {
            htmlResponse += `
                <li>
                    <strong>Short ID:</strong> ${url.shortId} <br>
                    <strong>Redirect URL:</strong> <a href="${url.redirectUrl}" target="_blank">${url.redirectUrl}</a> <br>
                    <strong>Visit Count:</strong> ${url.visitHistory?.length || 0}
                </li>
                <hr>
            `;
        });

        // Close the HTML tags
        htmlResponse += `
                    </ul>
                </body>
            </html>
        `;

        // Send the HTML response
        return res.send(htmlResponse);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    handleGenerateShortUrl,
    handleRedirectShortUrl,
    handleAnalytics,
    handleAllUrls
}