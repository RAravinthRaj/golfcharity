const express = require("express");
const {
  getDashboardStats,
  listUsers,
  updateUser,
  replaceUserScores,
  simulate,
  publish,
  getDraws,
  getWinners,
  updateWinnerStatus
} = require("../controllers/adminController");
const { auth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.use(auth, requireAdmin);
router.get("/dashboard", getDashboardStats);
router.get("/users", listUsers);
router.put("/users/:id", updateUser);
router.put("/users/:id/scores", replaceUserScores);
router.post("/draws/simulate", simulate);
router.post("/draws/publish", publish);
router.get("/draws", getDraws);
router.get("/winners", getWinners);
router.put("/draws/:drawId/winners/:winnerId", updateWinnerStatus);

module.exports = router;
