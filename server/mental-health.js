// server/mental-health.js
const express = require("express");
const router = express.Router();

/**
 * POST /mental-health/screen
 * Body: { responses: number[] }
 */
router.post("/mental-health/screen", (req, res) => {
  const { responses } = req.body;

  if (!Array.isArray(responses) || responses.length === 0) {
    return res.status(400).json({
      score: 0,
      level: "Invalid",
    });
  }

  const score = responses.reduce((sum, val) => sum + Number(val || 0), 0);

  let level = "Low";
  if (score > 7 && score <= 15) {
    level = "Moderate";
  } else if (score > 15) {
    level = "High";
  }

  return res.json({
    score,
    level,
  });
});

module.exports = router;
