const User = require("../models/User");
const Draw = require("../models/Draw");
const Charity = require("../models/Charity");
const { appendLatestScore, normalizeScores } = require("../utils/score");
const { getRenewalDate } = require("../utils/subscription");
const env = require("../config/env");
const Stripe = require("stripe");

const stripe = env.stripeSecretKey ? new Stripe(env.stripeSecretKey) : null;

function getPlanPrice(plan) {
  return plan === "yearly" ? env.yearlyPlanPrice : env.monthlyPlanPrice;
}

async function getDashboard(req, res) {
  const draws = await Draw.find({ status: "published" })
    .sort({ publishedAt: -1 })
    .limit(6)
    .populate("winners.user", "name email");

  const upcomingDraw = new Date();
  upcomingDraw.setMonth(upcomingDraw.getMonth() + 1);
  upcomingDraw.setDate(1);

  res.json({
    profile: {
      ...req.user.toObject(),
      password: undefined
    },
    summary: {
      drawsEntered: req.user.drawsEntered,
      winsCount: req.user.winsCount,
      totalWon: req.user.totalWon,
      upcomingDrawDate: upcomingDraw
    },
    recentDraws: draws
  });
}

async function updateProfile(req, res) {
  const allowedFields = [
    "name",
    "phone",
    "location",
    "handicap",
    "charityContributionPercentage",
    "selectedCharity"
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.user[field] = req.body[field];
    }
  });

  if (req.body.selectedCharity) {
    const charity = await Charity.findById(req.body.selectedCharity);

    if (!charity) {
      return res.status(400).json({ message: "Selected charity does not exist." });
    }
  }

  await req.user.save();
  await req.user.populate("selectedCharity");

  return res.json({ user: req.user });
}

async function addScore(req, res) {
  const { value, playedAt } = req.body;

  if (!value || !playedAt) {
    return res.status(400).json({ message: "Score and played date are required." });
  }

  req.user.scores = appendLatestScore(req.user.scores, { value, playedAt });
  await req.user.save();

  return res.status(201).json({ scores: normalizeScores(req.user.scores) });
}

async function updateScore(req, res) {
  const score = req.user.scores.id(req.params.scoreId);

  if (!score) {
    return res.status(404).json({ message: "Score not found." });
  }

  score.value = req.body.value ?? score.value;
  score.playedAt = req.body.playedAt ?? score.playedAt;
  req.user.scores = normalizeScores(req.user.scores);

  await req.user.save();
  return res.json({ scores: normalizeScores(req.user.scores) });
}

async function deleteScore(req, res) {
  const score = req.user.scores.id(req.params.scoreId);

  if (!score) {
    return res.status(404).json({ message: "Score not found." });
  }

  score.deleteOne();
  await req.user.save();
  return res.json({ scores: normalizeScores(req.user.scores) });
}

async function createCheckoutSession(req, res) {
  const { plan = "monthly" } = req.body;

  if (!stripe) {
    return res.status(400).json({
      message: "Stripe is not configured. Use demo activation for local evaluation."
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: req.user.email,
    success_url: `${env.clientUrl}/dashboard?subscription=success`,
    cancel_url: `${env.clientUrl}/dashboard?subscription=cancelled`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: getPlanPrice(plan) * 100,
          product_data: {
            name: `Golf Charity ${plan} subscription`
          }
        }
      }
    ],
    metadata: {
      userId: String(req.user._id),
      plan
    }
  });

  return res.json({ url: session.url });
}

async function activateDemoSubscription(req, res) {
  const { plan = "monthly" } = req.body;
  const startedAt = new Date();

  req.user.subscription = {
    plan,
    status: "active",
    price: getPlanPrice(plan),
    startedAt,
    renewalDate: getRenewalDate(plan, startedAt)
  };

  await req.user.save();

  return res.json({
    subscription: req.user.subscription
  });
}

async function listUserDraws(req, res) {
  const draws = await Draw.find({})
    .sort({ createdAt: -1 })
    .limit(12)
    .populate("winners.user", "name email");

  res.json({ draws });
}

async function uploadWinnerProof(req, res) {
  const draw = await Draw.findById(req.params.drawId);

  if (!draw) {
    return res.status(404).json({ message: "Draw not found." });
  }

  const winner = draw.winners.find((item) => String(item.user) === String(req.user._id));

  if (!winner) {
    return res.status(403).json({ message: "You are not a winner for this draw." });
  }

  winner.proofStatus = "pending";
  winner.proofImage = req.file ? `/uploads/${req.file.filename}` : winner.proofImage;
  winner.proofNotes = req.body.notes || "";

  await draw.save();

  return res.json({ draw });
}

module.exports = {
  getDashboard,
  updateProfile,
  addScore,
  updateScore,
  deleteScore,
  createCheckoutSession,
  activateDemoSubscription,
  listUserDraws,
  uploadWinnerProof
};
