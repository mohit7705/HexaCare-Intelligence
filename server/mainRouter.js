import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// TrustChain
import { writeHashToStellar } from "./services/trustchain/writeToStellar.js";
import { verifyOnStellar } from "./services/trustchain/verifyOnStellar.js";

// Gemini Vision
import { analyzeSkinImage } from "../services/geminiService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ==================================================
   PYTHON RUNNER — RENDER SAFE
================================================== */
const runPythonScript = (scriptName, inputData) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, scriptName);

    const python = spawn("python3", [scriptPath], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let output = "";
    let errorOutput = "";

    // ⏱️ HARD TIMEOUT (Render Free Tier Safe)
    const timeout = setTimeout(() => {
      python.kill("SIGKILL");
      reject("Python script timeout");
    }, 15000);

    python.stdin.write(JSON.stringify(inputData));
    python.stdin.end();

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    python.on("close", (code) => {
      clearTimeout(timeout);

      if (code !== 0) {
        return reject(
          `Python ${scriptName} failed: ${errorOutput || "Unknown error"}`
        );
      }

      try {
        resolve(JSON.parse(output));
      } catch {
        reject(`Invalid JSON from ${scriptName}: ${output}`);
      }
    });
  });
};

/* ==================================================
   ROUTES
================================================== */
export const setupRoutes = (app, Scan) => {

  /* 1️⃣ SYMPTOM CHECKER */
  app.post("/api/analyze", async (req, res) => {
    try {
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
      console.error("❌ Symptom Error:", err);
      res.status(500).json({ error: "Symptom analysis failed" });
    }
  });

  /* 2️⃣ DIABETES */
  app.post("/api/diabetes", async (req, res) => {
    try {
      const ai = await runPythonScript("diabetes.py", req.body);

      const scan = await Scan.create({
        userEmail: req.body.userEmail || "guest@hexacare.ai",
        symptoms: `Glucose ${req.body.glucose}, BMI ${req.body.bmi}`,
        prediction: ai.risk,
        confidence: `${Math.round((ai.probability || 0) * 100)}%`,
        recommendation: ai.message,
        type: "diabetes",
      });

      res.json(scan);
    } catch (err) {
      console.error("❌ Diabetes Error:", err);
      res.status(500).json({ error: "Diabetes analysis failed" });
    }
  });

  /* 3️⃣ HEART */
  app.post("/api/heart", async (req, res) => {
    try {
      const ai = await runPythonScript("heart.py", req.body);

      const scan = await Scan.create({
        userEmail: req.body.userEmail || "guest@hexacare.ai",
        symptoms: `Age ${req.body.age}, BP ${req.body.systolic_bp}`,
        prediction: ai.risk,
        confidence: `${Math.round((ai.probability || 0) * 100)}%`,
        recommendation: ai.message,
        type: "heart",
      });

      res.json(scan);
    } catch (err) {
      console.error("❌ Heart Error:", err);
      res.status(500).json({ error: "Heart risk analysis failed" });
    }
  });

  /* 4️⃣ MENTAL HEALTH (NO PYTHON – STABLE) */
  app.post("/api/mental-health", async (req, res) => {
    try {
      const { responses, userEmail } = req.body;

      const score = responses.reduce((s, v) => s + Number(v || 0), 0);

      const level =
        score <= 7 ? "Low" : score <= 15 ? "Moderate" : "High";

      const scan = await Scan.create({
        userEmail: userEmail || "guest@hexacare.ai",
        symptoms: "Mental Health Questionnaire",
        prediction: level,
        confidence: `${score} points`,
        recommendation:
          level === "Low"
            ? "Your mental wellbeing appears stable."
            : level === "Moderate"
            ? "Some stress indicators detected."
            : "High stress detected. Seek professional help.",
        type: "mental-health",
      });

      res.json({ score, level, scanId: scan._id });
    } catch (err) {
      console.error("❌ Mental Health Error:", err);
      res.status(500).json({ error: "Mental health analysis failed" });
    }
  });

  /* 5️⃣ SKIN DISEASE (GEMINI VISION) */
  app.post("/api/vision", async (req, res) => {
    try {
      const ai = await analyzeSkinImage(req.body.image);

      const scan = await Scan.create({
        userEmail: req.body.userEmail || "guest@hexacare.ai",
        symptoms: "Skin Image",
        prediction: ai.summary,
        recommendation: ai.disclaimer,
        type: "vision",
      });

      res.json({ ...ai, scanId: scan._id });
    } catch (err) {
      console.error("❌ Vision Error:", err);
      res.status(500).json({ error: "Vision analysis failed" });
    }
  });

  /* 6️⃣ TRUSTCHAIN WRITE */
  app.post("/api/trustchain/write", async (req, res) => {
    try {
      res.json(await writeHashToStellar(req.body.hash));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /* 7️⃣ TRUSTCHAIN VERIFY */
  app.post("/api/trustchain/verify", async (req, res) => {
    try {
      res.json(await verifyOnStellar(req.body.hash));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

