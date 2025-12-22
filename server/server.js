import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { setupRoutes } from "./mainRouter.js";

// Load env vars (local + Render)
dotenv.config();

const app = express();

/* ===============================
   STARTUP DEBUG (SAFE)
================================ */
console.log("================================");
console.log("🚀 HexaCare Server Initializing");
console.log(
  "GEMINI_API_KEY:",
  process.env.GEMINI_API_KEY ? "✅ Loaded" : "❌ Missing"
);
console.log("================================");

/* ===============================
   MIDDLEWARE
================================ */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

/* ===============================
   DATABASE
================================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) =>
    console.error("❌ MongoDB Connection Error:", err.message)
  );

/* ===============================
   SCHEMA
================================ */
const Scan = mongoose.model(
  "Scan",
  new mongoose.Schema({
    userEmail: String,
    symptoms: String,
    prediction: String,
    confidence: String,
    recommendation: String,
    type: String,
    date: { type: Date, default: Date.now },
  })
);

/* ===============================
   ROUTES
================================ */
setupRoutes(app, Scan);

/* ===============================
   SERVER START
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 HexaCare Server running on port ${PORT}`);
});

