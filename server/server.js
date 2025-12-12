// server/server.js (ES Module Version)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MOCK DATABASE CONNECTION
console.log("✅ Database Interface Initiated");

// --- API ROUTES ---

// 1. Health Check
app.get('/', (req, res) => {
    res.send('HexaCare Intelligence API is Running...');
});

// 2. The AI Analysis Endpoint
app.post('/api/analyze', (req, res) => {
    const { symptomData, userType } = req.body;

    console.log("Received data for analysis:", symptomData);

    // SIMULATING AI DELAY
    setTimeout(() => {
        res.json({
            status: "success",
            riskScore: Math.floor(Math.random() * 20) + 10,
            analysis: "Based on the provided parameters, AI detects no immediate high-risk anomalies. Routine monitoring recommended.",
            blockchainHash: "0x" + Math.random().toString(16).substr(2, 40),
            timestamp: new Date()
        });
    }, 2000);
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 HexaCare Backend running on http://localhost:${PORT}`);
});