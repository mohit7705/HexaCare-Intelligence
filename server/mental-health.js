// server/mental-health.js
import express from "express";
const router = express.Router();

/**
 * POST /api/mental-health
 * Body: { responses: number[], userEmail?: string }
 *
 * NOTE:
 * This route is aligned EXACTLY with mainroot.js
 * Logic is intentionally identical for consistency.
 */
router.post("/mental-health", async (req, res) => {
  try {
    const { responses } = req.body;

    if (!Array.isArray(responses)) {
      return res.status(400).json({
        error: "responses array required",
      });
    }

    const score = responses.reduce(
      (sum, val) => sum + Number(val || 0),
      0
    );

    let level = "Low";
    if (score > 7 && score <= 15) {
      level = "Moderate";
    } else if (score > 15) {
      level = "High";
    }

    return res.json({
      success: true,
      score,
      level,
    });
  } catch (err) {
    console.error("❌ Mental Health Route Error:", err);
    res.status(500).json({
      error: "Mental health analysis failed",
    });
  }
});

export default router;
