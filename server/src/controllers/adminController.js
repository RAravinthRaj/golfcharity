const User = require("../models/User");
const Draw = require("../models/Draw");
const Charity = require("../models/Charity");
const { simulateDraw, publishDraw, getMonthKey } = require("../services/drawService");

async function getDashboardStats(req, res) {
  const totalUsers = await User.countDocuments({ role: "user" });
  const activeSubscribers = await User.countDocuments({
    role: "user",
    "subscription.status": "active"
  });
  const charities = await Charity.find({});
  const draws = await Draw.find({}).sort({ createdAt: -1 }).limit(6);
  const totalPrizePool = draws.reduce((sum, draw) => sum + draw.totalPrizePool, 0);
  const totalCharityRaised = charities.reduce((sum, charity) => sum + charity.totalRaised, 0);

  res.json({
    stats: {
      totalUsers,
      activeSubscribers,
      totalPrizePool,
      totalCharityRaised,
      drawCount: draws.length
    },
    draws,
    charities
  });
}

async function listUsers(req, res) {
  const users = await User.find({ role: "user" })
    .sort({ createdAt: -1 })
    .populate("selectedCharity");

  res.json({ users });
}

async function updateUser(req, res) {
  const allowed = [
    "name",
    "phone",
    "location",
    "handicap",
    "charityContributionPercentage",
    "selectedCharity",
    "subscription"
  ];

  const payload = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      payload[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.params.id, payload, {
    new: true
  }).populate("selectedCharity");

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.json({ user });
}

async function replaceUserScores(req, res) {
  const { scores = [] } = req.body;

  if (!Array.isArray(scores) || scores.length > 5) {
    return res.status(400).json({ message: "Provide up to 5 scores." });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  user.scores = scores;
  await user.save();

  return res.json({ user });
}

async function simulate(req, res) {
  const draw = await simulateDraw(req.body.drawMode || "random");
  res.json({ draw });
}

async function publish(req, res) {
  const monthKey = req.body.monthKey || getMonthKey();
  const draw = await publishDraw(monthKey);
  res.json({ draw });
}

async function getDraws(req, res) {
  const draws = await Draw.find({})
    .sort({ createdAt: -1 })
    .populate("winners.user", "name email");

  res.json({ draws });
}

async function getWinners(req, res) {
  const draws = await Draw.find({})
    .sort({ createdAt: -1 })
    .populate("winners.user", "name email");

  const winners = draws.flatMap((draw) =>
    draw.winners.map((winner) => ({
      drawId: draw._id,
      monthKey: draw.monthKey,
      numbers: draw.numbers,
      ...winner.toObject()
    }))
  );

  res.json({ winners });
}

async function updateWinnerStatus(req, res) {
  const draw = await Draw.findById(req.params.drawId);

  if (!draw) {
    return res.status(404).json({ message: "Draw not found." });
  }

  const winner = draw.winners.id(req.params.winnerId);

  if (!winner) {
    return res.status(404).json({ message: "Winner not found." });
  }

  winner.proofStatus = req.body.proofStatus || winner.proofStatus;
  winner.proofNotes = req.body.proofNotes ?? winner.proofNotes;
  await draw.save();

  res.json({ draw });
}

module.exports = {
  getDashboardStats,
  listUsers,
  updateUser,
  replaceUserScores,
  simulate,
  publish,
  getDraws,
  getWinners,
  updateWinnerStatus
};
