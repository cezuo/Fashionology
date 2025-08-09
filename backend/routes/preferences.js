import express from "express";
import User from "../models/User.js";

const router = express.Router();

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

export default router;
