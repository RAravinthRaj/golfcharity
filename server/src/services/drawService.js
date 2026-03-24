const Draw = require("../models/Draw");
const User = require("../models/User");
const env = require("../config/env");

function getMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function countMatches(userScores, drawNumbers) {
  const scoreValues = userScores.map((score) => score.value);
  return drawNumbers.filter((num) => scoreValues.includes(num)).length;
}

function buildRandomNumbers() {
  const picked = new Set();

  while (picked.size < 5) {
    picked.add(Math.floor(Math.random() * 45) + 1);
  }

  return [...picked].sort((a, b) => a - b);
}

function buildAlgorithmicNumbers(users) {
  const frequencies = new Map();

  users.forEach((user) => {
    user.scores.forEach((score) => {
      frequencies.set(score.value, (frequencies.get(score.value) || 0) + 1);
    });
  });

  const sorted = [...frequencies.entries()].sort((a, b) => b[1] - a[1]);
  const values = sorted.slice(0, 5).map(([value]) => value);

  if (values.length < 5) {
    const fallback = buildRandomNumbers();
    fallback.forEach((value) => {
      if (!values.includes(value) && values.length < 5) {
        values.push(value);
      }
    });
  }

  return values.sort((a, b) => a - b);
}

function getSubscriptionRevenue(user) {
  if (user.subscription.plan === "yearly") {
    return env.yearlyPlanPrice;
  }

  if (user.subscription.plan === "monthly") {
    return env.monthlyPlanPrice;
  }

  return 0;
}

async function simulateDraw(drawMode = "random") {
  const activeUsers = await User.find({
    role: "user",
    "subscription.status": "active"
  });
  const monthKey = getMonthKey();
  const numbers = drawMode === "algorithmic" ? buildAlgorithmicNumbers(activeUsers) : buildRandomNumbers();
  const totalRevenue = activeUsers.reduce((sum, user) => sum + getSubscriptionRevenue(user), 0);
  const totalPrizePool = Number((totalRevenue * 0.4).toFixed(2));
  const fiveMatchPool = Number((totalPrizePool * 0.4).toFixed(2));
  const fourMatchPool = Number((totalPrizePool * 0.35).toFixed(2));
  const threeMatchPool = Number((totalPrizePool * 0.25).toFixed(2));
  const winnersByTier = { 3: [], 4: [], 5: [] };

  activeUsers.forEach((user) => {
    const matches = countMatches(user.scores, numbers);

    if (matches >= 3) {
      winnersByTier[matches].push(user);
    }
  });

  const winners = [];
  const pushWinners = (users, matchCount, pool) => {
    if (!users.length) {
      return;
    }

    const share = Number((pool / users.length).toFixed(2));
    users.forEach((user) => {
      winners.push({
        user: user._id,
        matchCount,
        amount: share
      });
    });
  };

  pushWinners(winnersByTier[5], 5, fiveMatchPool);
  pushWinners(winnersByTier[4], 4, fourMatchPool);
  pushWinners(winnersByTier[3], 3, threeMatchPool);

  const rollover = winnersByTier[5].length ? 0 : fiveMatchPool;

  const draw = await Draw.findOneAndUpdate(
    { monthKey },
    {
      monthKey,
      numbers,
      drawMode,
      status: "simulated",
      activeSubscribers: activeUsers.length,
      totalPrizePool,
      prizeBreakdown: {
        fiveMatch: fiveMatchPool,
        fourMatch: fourMatchPool,
        threeMatch: threeMatchPool,
        rollover
      },
      winners,
      simulationSummary: `${winners.length} winners across 3 tiers.`
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).populate("winners.user", "name email");

  return draw;
}

async function publishDraw(monthKey) {
  const draw = await Draw.findOne({ monthKey });

  if (!draw) {
    throw new Error("Draw not found.");
  }

  draw.status = "published";
  draw.publishedAt = new Date();

  await draw.save();

  const winners = draw.winners || [];

  for (const winner of winners) {
    const user = await User.findById(winner.user);

    if (!user) {
      continue;
    }

    user.winsCount += 1;
    user.totalWon = Number((user.totalWon + winner.amount).toFixed(2));
    user.drawsEntered += 1;
    await user.save();
  }

  return draw.populate("winners.user", "name email");
}

module.exports = {
  simulateDraw,
  publishDraw,
  getMonthKey
};
