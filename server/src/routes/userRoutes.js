const express = require("express");
const {
  getDashboard,
  updateProfile,
  addScore,
  updateScore,
  deleteScore,
  createCheckoutSession,
  activateDemoSubscription,
  listUserDraws,
  uploadWinnerProof
} = require("../controllers/userController");
const { auth } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(auth);
router.get("/dashboard", getDashboard);
router.put("/profile", updateProfile);
router.post("/scores", addScore);
router.put("/scores/:scoreId", updateScore);
router.delete("/scores/:scoreId", deleteScore);
router.post("/subscriptions/checkout-session", createCheckoutSession);
router.post("/subscriptions/demo-activate", activateDemoSubscription);
router.get("/draws", listUserDraws);
router.post("/draws/:drawId/proof", upload.single("proof"), uploadWinnerProof);

module.exports = router;
