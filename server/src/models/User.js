const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true, min: 1, max: 45 },
    playedAt: { type: Date, required: true }
  },
  { _id: true }
);

const subscriptionSchema = new mongoose.Schema(
  {
    plan: { type: String, enum: ["monthly", "yearly", "none"], default: "none" },
    status: {
      type: String,
      enum: ["active", "inactive", "cancelled", "lapsed"],
      default: "inactive"
    },
    price: { type: Number, default: 0 },
    renewalDate: { type: Date },
    startedAt: { type: Date },
    cancelledAt: { type: Date }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    avatar: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    handicap: { type: Number, default: 0 },
    selectedCharity: { type: mongoose.Schema.Types.ObjectId, ref: "Charity" },
    charityContributionPercentage: { type: Number, default: 10, min: 10, max: 100 },
    subscription: { type: subscriptionSchema, default: () => ({}) },
    scores: {
      type: [scoreSchema],
      default: [],
      validate: {
        validator: (scores) => scores.length <= 5,
        message: "Only 5 latest scores may be stored."
      }
    },
    drawsEntered: { type: Number, default: 0 },
    winsCount: { type: Number, default: 0 },
    totalWon: { type: Number, default: 0 },
    notificationPreferences: {
      marketing: { type: Boolean, default: true },
      drawResults: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
