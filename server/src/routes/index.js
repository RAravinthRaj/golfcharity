const express = require("express");
const authRoutes = require("./authRoutes");
const charityRoutes = require("./charityRoutes");
const userRoutes = require("./userRoutes");
const adminRoutes = require("./adminRoutes");
const Draw = require("../models/Draw");
const Charity = require("../models/Charity");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

router.get("/public/home", async (req, res) => {
  const featuredCharities = await Charity.find({ active: true, featured: true }).limit(3);
  const recentDraws = await Draw.find({ status: "published" }).sort({ publishedAt: -1 }).limit(3);

  res.json({
    heroStats: {
      activeSubscribers: await require("../models/User").countDocuments({
        role: "user",
        "subscription.status": "active"
      }),
      totalDraws: await Draw.countDocuments({ status: "published" }),
      featuredCharities: featuredCharities.length
    },
    featuredCharities,
    recentDraws
  });
});

router.use("/auth", authRoutes);
router.use("/charities", charityRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
