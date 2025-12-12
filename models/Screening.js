// server/models/Screening.js
const mongoose = require('mongoose');

const ScreeningSchema = new mongoose.Schema({
    patientName: String,
    symptoms: String,
    aiPrediction: String,
    riskScore: Number,
    blockchainTxHash: String, // To store the Stellar verification
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Screening', ScreeningSchema);