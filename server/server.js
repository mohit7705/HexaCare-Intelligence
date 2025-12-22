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

// Load .env only if not in production
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
}

const app = express();

// --- CORS Configuration (FINAL & CORRECT) ---
app.use(
  cors({
    origin: [
      // ✅ Vercel production (exact match)
      "https://hexa-care-intelligence-git-main-mohit-raos-projects-49eaa0e4.vercel.app",
      "https://hexa-care-intelligence.vercel.app",

      // ✅ Local development
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

// --- Middleware ---
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// --- Debug Logs (kept) ---
console.log("────────────────────────────");
console.log("🚀 HexaCare Server Booting");
console.log("NODE_ENV:", process.env.NODE_ENV || "development");
console.log(
  "GEMINI_API_KEY:",
  process.env.GEMINI_API_KEY ? "✅ Loaded" : "❌ Missing"
);
console.log(
  "MONGO_URI:",
  process.env.MONGO_URI ? "✅ Loaded" : "❌ Missing"
);
console.log("────────────────────────────");

// --- MongoDB Connection ---
const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/hexacare";

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) =>
    console.error("❌ MongoDB Connection Error:", err.message)
  );

// --- Database Schema (unchanged) ---
const ScanSchema = new mongoose.Schema({
  userEmail: String,
  symptoms: String,
  prediction: String,
  confidence: String,
  recommendation: String,
  type: { type: String, default: "symptom" },
  date: { type: Date, default: Date.now }
});

const Scan = mongoose.model("Scan", ScanSchema);

// --- Initialize API Routes ---
setupRoutes(app, Scan);

// --- Root Health Check ---
app.get("/", (req, res) => {
  res.status(200).send("✅ HexaCare Intelligence API is running");
});

// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 HexaCare Server running on port ${PORT}`);
});
