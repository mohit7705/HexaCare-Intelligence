import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { setupRoutes } from "./mainRouter.js";

// --- FIX: Load .env from the root directory ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

// --- Debug Check: Run your server and check terminal ---
console.log("--- Server Initialization ---");
console.log("GEMINI_API_KEY status:", process.env.GEMINI_API_KEY ? "✅ Loaded" : "❌ Missing");
console.log("----------------------------");

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/hexacare")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// --- Database Schema ---
const Scan = mongoose.model("Scan", new mongoose.Schema({
    userEmail: String,
    symptoms: String,
    prediction: String,
    confidence: String,
    recommendation: String,
    type: { type: String, default: "symptom" },
    date: { type: Date, default: Date.now },
}));

// --- Initialize Routes ---
setupRoutes(app, Scan);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 HexaCare Server running on ${PORT}`));
