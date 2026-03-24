const mongoose = require("mongoose");

const prizeBreakdownSchema = new mongoose.Schema(
  {
    fiveMatch: { type: Number, default: 0 },
    fourMatch: { type: Number, default: 0 },
    threeMatch: { type: Number, default: 0 },
    rollover: { type: Number, default: 0 }
  },
  { _id: false }
);

const winnerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    matchCount: { type: Number, enum: [3, 4, 5], required: true },
    amount: { type: Number, required: true },
    proofStatus: {
      type: String,
      enum: ["not_submitted", "pending", "approved", "rejected", "paid"],
      default: "not_submitted"
    },
    proofImage: { type: String, default: "" },
    proofNotes: { type: String, default: "" }
  },
  { timestamps: true }
);

const drawSchema = new mongoose.Schema(
  {
    monthKey: { type: String, required: true, unique: true },
    numbers: [{ type: Number, required: true }],
    drawMode: { type: String, enum: ["random", "algorithmic"], default: "random" },
    status: { type: String, enum: ["draft", "simulated", "published"], default: "draft" },
    activeSubscribers: { type: Number, default: 0 },
    totalPrizePool: { type: Number, default: 0 },
    prizeBreakdown: { type: prizeBreakdownSchema, default: () => ({}) },
    winners: { type: [winnerSchema], default: [] },
    simulationSummary: { type: String, default: "" },
    publishedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Draw", drawSchema);
