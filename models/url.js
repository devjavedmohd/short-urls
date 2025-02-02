const mongoose = require('mongoose');

// Database schema created
const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        require: true,
        unique: true
    },
    redirectUrl: {
        type: String,
        require: true,
    },
    visitHistory: [{ timestamp: { type: Number } }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamp: true })

// Schema assigned to model
const URL = mongoose.model('url', urlSchema)

// Module exported
module.exports = URL;