// backend/routes/preferences.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Save onboarding answer
router.post("/save", async (req, res) => {
  const { userId, onboardingAnswer } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { onboardingAnswer },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "Answer saved", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to save answer" });
  }
});

// Get onboarding answer
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ onboardingAnswer: user.onboardingAnswer });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch answer" });
  }
});

module.exports = router;
