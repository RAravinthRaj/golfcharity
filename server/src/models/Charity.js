const mongoose = require("mongoose");

const charitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    website: { type: String, default: "" },
    location: { type: String, default: "" },
    categories: [{ type: String }],
    upcomingEvents: [{ type: String }],
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    totalRaised: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Charity", charitySchema);
