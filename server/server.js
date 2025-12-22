import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { setupRoutes } from "./mainRouter.js";

// --- FIX: Resolve paths for ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env only if not in production (Render/Vercel provide env vars directly)
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.resolve(__dirname, "../.env") });
}

const app = express();

// --- CORS Configuration ---
// This allows your Vercel frontend to talk to your Render backend
app.use(cors({
    origin: [
        "https://hexa-care-intelligence.vercel.app", // Your production URL
        "http://localhost:5173",                     // Your local Vite dev URL
        "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// --- Middleware ---
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// --- Debug Check ---
console.log("--- Server Initialization ---");
console.log("GEMINI_API_KEY status:", process.env.GEMINI_API_KEY ? "✅ Loaded" : "❌ Missing");
console.log("Environment:", process.env.NODE_ENV || "development");
console.log("----------------------------");

// --- MongoDB Connection ---
// Uses the MONGO_URI from Render's dashboard environment variables
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/hexacare";
mongoose
    .connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// --- Database Schema ---
const ScanSchema = new mongoose.Schema({
    userEmail: String,
    symptoms: String,
    prediction: String,
    confidence: String,
    recommendation: String,
    type: { type: String, default: "symptom" },
    date: { type: Date, default: Date.now },
});

const Scan = mongoose.model("Scan", ScanSchema);

// --- Initialize Routes ---
setupRoutes(app, Scan);

// Root route for health check
app.get("/", (req, res) => {
    res.send("HexaCare Intelligence API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 HexaCare Server running on port ${PORT}`);
});