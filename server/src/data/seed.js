const bcrypt = require("bcryptjs");
const connectDb = require("../config/db");
const Charity = require("../models/Charity");
const User = require("../models/User");
const Draw = require("../models/Draw");
const { getRenewalDate } = require("../utils/subscription");

async function seed() {
  await connectDb();

  await Promise.all([Charity.deleteMany({}), User.deleteMany({}), Draw.deleteMany({})]);

  const charities = await Charity.insertMany([
    {
      name: "First Tee Futures",
      slug: "first-tee-futures",
      description: "Helping young golfers access coaching, equipment, and travel support.",
      location: "London",
      categories: ["Youth", "Education"],
      featured: true,
      totalRaised: 12450
    },
    {
      name: "Fairway for All",
      slug: "fairway-for-all",
      description: "Opening the game to underrepresented communities through local golf days.",
      location: "Manchester",
      categories: ["Community", "Access"],
      upcomingEvents: ["Spring charity scramble", "Women in golf clinic"],
      featured: true,
      totalRaised: 8900
    },
    {
      name: "Green Hearts Trust",
      slug: "green-hearts-trust",
      description: "Mental health support funded by golf-led fundraising events.",
      location: "Birmingham",
      categories: ["Health", "Wellness"],
      featured: true,
      totalRaised: 15620
    }
  ]);

  const passwordHash = await bcrypt.hash("Admin@123", 10);
  const userPasswordHash = await bcrypt.hash("User@123", 10);

  await User.create({
    name: "Platform Admin",
    email: "admin@golfcharity.com",
    password: passwordHash,
    role: "admin"
  });

  await User.insertMany([
    {
      name: "Ava Thompson",
      email: "ava@golfcharity.com",
      password: userPasswordHash,
      role: "user",
      selectedCharity: charities[0]._id,
      charityContributionPercentage: 15,
      subscription: {
        plan: "monthly",
        status: "active",
        price: 29,
        startedAt: new Date(),
        renewalDate: getRenewalDate("monthly")
      },
      scores: [
        { value: 22, playedAt: new Date("2026-03-20") },
        { value: 18, playedAt: new Date("2026-03-18") },
        { value: 25, playedAt: new Date("2026-03-15") },
        { value: 12, playedAt: new Date("2026-03-12") },
        { value: 30, playedAt: new Date("2026-03-10") }
      ],
      drawsEntered: 4,
      winsCount: 1,
      totalWon: 140
    },
    {
      name: "Luca Green",
      email: "luca@golfcharity.com",
      password: userPasswordHash,
      role: "user",
      selectedCharity: charities[1]._id,
      charityContributionPercentage: 20,
      subscription: {
        plan: "yearly",
        status: "active",
        price: 299,
        startedAt: new Date(),
        renewalDate: getRenewalDate("yearly")
      },
      scores: [
        { value: 14, playedAt: new Date("2026-03-22") },
        { value: 21, playedAt: new Date("2026-03-18") },
        { value: 35, playedAt: new Date("2026-03-16") },
        { value: 9, playedAt: new Date("2026-03-11") },
        { value: 27, playedAt: new Date("2026-03-04") }
      ],
      drawsEntered: 6
    }
  ]);

  console.log("Seed complete");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
