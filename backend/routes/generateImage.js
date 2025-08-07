const express = require("express");
const router = express.Router();
const User = require("../models/User");
const fetch = require("node-fetch");

console.log("🔑 API KEY:", process.env.OPENAI_API_KEY ? "✅ Set" : "❌ Missing");

// Route: POST /api/generate-image
router.post("/generate-image", async (req, res) => {
  const { userId } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    console.log("✅ Received request with userId:", userId);

    if (!apiKey) {
      console.log("❌ Missing OpenAI API key");
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    if (!userId) {
      console.log("❌ Missing userId in request");
      return res.status(400).json({ error: "userId is required" });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.onboardingAnswer) {
      console.log("❌ User missing onboardingAnswer");
      return res.status(404).json({ error: "User onboarding answer not found" });
    }

    const prompt = `Pinterest-style photo of outfit inspiration: ${user.onboardingAnswer}`;
    console.log("🧠 Prompt being sent to OpenAI:", prompt);

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
      }),
    });

    const data = await response.json();
    console.log("📦 OpenAI response status:", response.status);
    console.log("📦 OpenAI response data:", data);

    if (!response.ok) {
      console.log("❌ OpenAI API error:", data);
      return res.status(500).json({ 
        error: data.error?.message || `OpenAI API error: ${response.status}`,
        details: data.error
      });
    }

    const imageUrl = data?.data?.[0]?.url;
    if (!imageUrl) {
      console.log("❌ Image generation failed — no image URL found.");
      console.log("Full response:", JSON.stringify(data, null, 2));
      return res.status(500).json({ error: "Image generation failed - no URL returned" });
    }

    console.log("✅ Image URL generated successfully");
    res.status(200).json({ imageUrl });

  } catch (error) {
    console.error("💥 Server error while generating image:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: "Invalid userId format" });
    }
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(500).json({ error: "Network error - unable to reach OpenAI API" });
    }
    
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.get("/generate-image", (req, res) => {
  res.json({ message: "Generate image route is accessible!" });
});

module.exports = router;