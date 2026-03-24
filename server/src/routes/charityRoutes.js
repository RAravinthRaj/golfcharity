const express = require("express");
const {
  listCharities,
  getCharity,
  createCharity,
  updateCharity,
  deleteCharity
} = require("../controllers/charityController");
const { auth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", listCharities);
router.get("/:id", getCharity);
router.post("/", auth, requireAdmin, createCharity);
router.put("/:id", auth, requireAdmin, updateCharity);
router.delete("/:id", auth, requireAdmin, deleteCharity);

module.exports = router;
