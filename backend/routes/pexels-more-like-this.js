// routes/pexels-more-like-this.js
import express from "express";
const router = express.Router();

router.post("/more-like-this", async (req, res) => {
  try {
    const { id, page = 1, pageSize = 12 } = req.body;
    if (!id) return res.status(400).json({ error: "Missing photo id" });

    // 1) fetch the reference photo
    const r1 = await fetch(`https://api.pexels.com/v1/photos/${id}`, {
      headers: { Authorization: process.env.PEXELS_API_KEY }
    });
    if (!r1.ok) {
      const t = await r1.text().catch(() => "");
      return res.status(r1.status).json({ error: "Pexels photo lookup failed", details: t });
    }
    const ref = await r1.json();

    // 2) build a search from its alt + avg_color
    const q = (ref.alt || "street style outfit").trim();
    const colorMap = [
      "red","orange","yellow","green","turquoise","blue","violet",
      "pink","brown","black","gray","white"
    ];
    const color = colorMap.find(c => (ref.avg_color || "").toLowerCase().includes(c)) || undefined;

    const url = new URL("https://api.pexels.com/v1/search");
    url.searchParams.set("query", q);
    url.searchParams.set("per_page", String(pageSize));
    url.searchParams.set("page", String(page));
    url.searchParams.set("orientation", "portrait");
    if (color) url.searchParams.set("color", color);

    const r2 = await fetch(url, { headers: { Authorization: process.env.PEXELS_API_KEY }});
    if (!r2.ok) {
      const t = await r2.text().catch(() => "");
      return res.status(r2.status).json({ error: "Pexels search failed", details: t });
    }
    const data = await r2.json();

    const items = (data.photos || []).map(p => ({
      id: p.id,
      url: p.src?.portrait || p.src?.large2x || p.src?.large,
      alt: p.alt || "outfit photo",
      width: p.width,
      height: p.height,
      photographer: p.photographer,
      photoUrl: p.url
    }));

    res.json({
      items,
      queryUsed: q,
      colorUsed: color || null,
      ref: { id: ref.id, alt: ref.alt, avg_color: ref.avg_color, photographer: ref.photographer }
    });
  } catch (e) {
    console.error("more-like-this error", e);
    res.status(500).json({ error: "Failed to fetch similar photos" });
  }
});

export default router;
