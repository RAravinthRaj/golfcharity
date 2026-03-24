const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Charity = require("../models/Charity");
const { signToken } = require("../utils/jwt");

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    location: user.location,
    handicap: user.handicap,
    selectedCharity: user.selectedCharity,
    charityContributionPercentage: user.charityContributionPercentage,
    subscription: user.subscription,
    scores: user.scores,
    drawsEntered: user.drawsEntered,
    winsCount: user.winsCount,
    totalWon: user.totalWon,
    createdAt: user.createdAt
  };
}

async function register(req, res) {
  const {
    name,
    email,
    password,
    charityId,
    charityContributionPercentage = 10
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  const existing = await User.findOne({ email });

  if (existing) {
    return res.status(409).json({ message: "Email already in use." });
  }

  let selectedCharity = null;

  if (charityId) {
    selectedCharity = await Charity.findById(charityId);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: passwordHash,
    selectedCharity: selectedCharity?._id,
    charityContributionPercentage
  });

  await user.populate("selectedCharity");

  return res.status(201).json({
    token: signToken(user),
    user: serializeUser(user)
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate("selectedCharity");

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const matches = await bcrypt.compare(password, user.password);

  if (!matches) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  return res.json({
    token: signToken(user),
    user: serializeUser(user)
  });
}

async function getMe(req, res) {
  return res.json({ user: serializeUser(req.user) });
}

module.exports = { register, login, getMe, serializeUser };
