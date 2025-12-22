import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// ✅ TrustChain Stellar services (SERVER SIDE)
import { writeHashToStellar } from "./services/trustchain/writeToStellar.js";
import { verifyOnStellar } from "./services/trustchain/verifyOnStellar.js";

// ✅ Gemini Vision service (shared service folder)
import { analyzeSkinImage } from "../services/geminiService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------- HELPER: RUN PYTHON SCRIPT ----------------
const runPythonScript = (scriptName, inputData) => {
  return new Promise((resolve, reject) => {
    const python = spawn("python", [path.join(__dirname, scriptName)]);

    let output = "";
    let errorOutput = "";

    python.stdin.write(JSON.stringify(inputData));
    python.stdin.end();

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) {
        reject(`Python script ${scriptName} failed: ${errorOutput}`);
      } else {
        try {
          resolve(JSON.parse(output));
        } catch {
          reject(`Invalid JSON from ${scriptName}: ${output}`);
        }
      }
    });
  });
};

// ---------------- ROUTES SETUP ----------------
export const setupRoutes = (app, Scan) => {

  // 1️⃣ SYMPTOM ANALYSIS
  app.post("/api/analyze", async (req, res) => {
    try {
      if (!req.body.symptomData) {
        return res.status(400).json({ error: "Missing symptom data" });
      }

      const ai = await runPythonScript("symptoms.py", req.body.symptomData);

      const scan = await Scan.create({
        userEmail: req.body.userEmail || "guest@hexacare.ai",
        symptoms: req.body.symptomData,
        prediction: ai.diagnosis,
        confidence: ai.confidence,
        recommendation: ai.recommendation,
        type: "symptom",
      });

      res.json(scan);
    } catch (err) {
      res.status(500).json({ error: err.toString() });
    }
  });

  // 2️⃣ DIABETES PREDICTION
  app.post("/api/diabetes", async (req, res) => {
    try {
      const ai = await runPythonScript("diabetes.py", req.body);

      const scan = await Scan.create({
        userEmail: req.body.userEmail || "guest@hexacare.ai",
        symptoms: `Glucose: ${req.body.glucose}, BMI: ${req.body.bmi}`,
        prediction: ai.risk,
        confidence: `${Math.round((ai.probability || 0) * 100)}%`,
        recommendation: ai.message,
        type: "diabetes",
      });

      res.json(scan);
    } catch (err) {
      res.status(500).json({ error: err.toString() });
    }
  });

  // 3️⃣ HEART RISK PREDICTION
  app.post("/api/heart", async (req, res) => {
    try {
      const ai = await runPythonScript("heart.py", req.body);

      const scan = await Scan.create({
        userEmail: req.body.userEmail || "guest@hexacare.ai",
        symptoms: `Age: ${req.body.age}, BP: ${req.body.systolic_bp}`,
        prediction: ai.risk,
        confidence: `${Math.round((ai.probability || 0) * 100)}%`,
        recommendation: ai.message,
        type: "heart",
      });

      res.json(scan);
    } catch (err) {
      res.status(500).json({ error: err.toString() });
    }
  });

  // 4️⃣ MENTAL HEALTH SCREENING
  app.post("/api/mental-health", async (req, res) => {
    try {
      const { responses, userEmail } = req.body;

      if (!Array.isArray(responses) || responses.length === 0) {
        return res.status(400).json({ score: 0, level: "Invalid" });
      }

      const score = responses.reduce((sum, val) => sum + Number(val || 0), 0);

      let level = "Low";
      if (score > 7 && score <= 15) level = "Moderate";
      else if (score > 15) level = "High";

      const scan = await Scan.create({
        userEmail: userEmail || "guest@hexacare.ai",
        symptoms: "Mental Health Questionnaire",
        prediction: level,
        confidence: `${score} points`,
        recommendation:
          level === "Low"
            ? "Your mental wellbeing appears stable."
            : level === "Moderate"
            ? "Some stress indicators detected. Consider relaxation."
            : "High stress detected. Professional consultation recommended.",
        type: "mental-health",
      });

      res.json({ score, level, scanId: scan._id });
    } catch (err) {
      res.status(500).json({ error: err.toString() });
    }
  });

  // 5️⃣ SKIN DISEASE DETECTION (GEMINI VISION)
  app.post("/api/vision", async (req, res) => {
    try {
      const { image, userEmail } = req.body;

      if (!image) {
        return res.status(400).json({ error: "No image provided" });
      }

      const aiResult = await analyzeSkinImage(image);

      const scan = await Scan.create({
        userEmail: userEmail || "guest@hexacare.ai",
        symptoms: "Skin Image Analysis",
        prediction: aiResult.summary,
        recommendation: aiResult.disclaimer,
        type: "vision",
      });

      res.json({ ...aiResult, scanId: scan._id });
    } catch (err) {
      res.status(500).json({
        error: "Vision analysis failed. Ensure API key is valid.",
      });
    }
  });

  // 6️⃣ TRUSTCHAIN — STELLAR WRITE
  app.post("/api/trustchain/write", async (req, res) => {
    try {
      const { hash } = req.body;
      if (!hash) {
        return res.status(400).json({ error: "Missing hash" });
      }

      const result = await writeHashToStellar(hash);
      if (!result.success) {
        return res.status(500).json(result);
      }

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // 7️⃣ TRUSTCHAIN — STELLAR VERIFY ✅ FIXED
  app.post("/api/trustchain/verify", async (req, res) => {
    try {
      const { hash } = req.body;
      if (!hash) {
        return res.status(400).json({ error: "Missing transaction hash" });
      }

      const result = await verifyOnStellar(hash);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};
