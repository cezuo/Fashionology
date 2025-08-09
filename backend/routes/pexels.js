// backend/routes/pexels.js
import express from "express";
import dotenv from "dotenv";
import buildPrompt from "../utils/buildPrompt.js"; // ← smart keyword extractor

dotenv.config();

const router = express.Router();

// POST /api/generate-outfits
router.post("/generate-outfits", async (req, res) => {
  try {
    const { answers = [], page = 1, pageSize = 12, hint = "" } = req.body;

    if (!process.env.PEXELS_API_KEY) {
      return res.status(500).json({ error: "Missing PEXELS_API_KEY" });
    }

    // Build a strong keyword query (and optional color hint)
    const { query, color } = buildPrompt({ answers, hint });

    const searchOnce = async (q, colorHint) => {
      const url = new URL("https://api.pexels.com/v1/search");
      url.searchParams.set("query", q);
      url.searchParams.set("per_page", String(pageSize));
      url.searchParams.set("page", String(page));
      url.searchParams.set("orientation", "portrait");
      if (colorHint) url.searchParams.set("color", colorHint);

      const r = await fetch(url, {
        headers: { Authorization: process.env.PEXELS_API_KEY },
      });

      if (!r.ok) {
        const text = await r.text().catch(() => "");
        return { error: `Pexels ${r.status}`, status: r.status, details: text };
      }
      return r.json();
    };

    // Try 1: full query + color if we have one
    let data = await searchOnce(query, color);

    // Fallback 1: soften brand & shoe terms if results are thin
    const tooFew = (d) => (d?.photos?.length || 0) < Math.min(6, pageSize);
    if (tooFew(data)) {
      // remove some niche/brand words to broaden results
      const softer = query
        .replace(/maison margiela|margiela/gi, "")
        .replace(/air jordan|jordans?|aj1|nike dunk|yeezy/gi, "")
        .replace(/designer fashion|high fashion/gi, "")
        .replace(/\s*,\s*,/g, ",")
        .replace(/(^,|,$)/g, "")
        .trim();

      data = await searchOnce(softer || "streetwear, outfit, full body, urban, natural light", undefined);
    }

    // Fallback 2: generic streetwear set if still thin
    if (tooFew(data)) {
      data = await searchOnce("streetwear, hip hop, outfit, full body, street style, natural light", undefined);
    }

    if (data?.error) {
      return res.status(data.status || 500).json({ error: data.error, details: data.details });
    }

    const items = (data?.photos || []).map((p) => ({
      id: p.id,
      url: p.src?.portrait || p.src?.large2x || p.src?.large,
      alt: p.alt || "outfit photo",
      width: p.width,
      height: p.height,
      photographer: p.photographer,
      photoUrl: p.url,
    }));

    return res.json({
      items,
      page,
      pageSize,
      queryUsed: query,
      colorUsed: color || null,
      total: data?.total_results ?? 0,
    });
  } catch (error) {
    console.error("Error fetching outfits from Pexels:", error);
    res.status(500).json({ error: "Failed to fetch outfits" });
  }
});

export default router;
