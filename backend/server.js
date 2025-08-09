// backend/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Routes
import authRoutes from "./routes/auth.js";
import preferencesRoutes from "./routes/preferences.js";
import pexelsRouter from "./routes/pexels.js"; // ✅ renamed from outfits.js
import moreLikeThis from "./routes/pexels-more-like-this.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Vite dev server
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" })); // replaces body-parser

// Health checks
app.get("/test", (req, res) => {
  res.json({ message: "✅ Server is working!", timestamp: new Date() });
});
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ API route is working!", timestamp: new Date() });
});

// Mount your routes
app.use("/api", authRoutes);
app.use("/api/preferences", preferencesRoutes);
app.use("/api", pexelsRouter); // ✅ exposes POST /api/generate-outfits
app.use("/api", moreLikeThis);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI, { dbName: "fashionapp" })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
