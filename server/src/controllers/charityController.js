const Charity = require("../models/Charity");

async function listCharities(req, res) {
  const { q = "", featured } = req.query;
  const filter = {
    active: true,
    name: { $regex: q, $options: "i" }
  };

  if (featured === "true") {
    filter.featured = true;
  }

  const charities = await Charity.find(filter).sort({ featured: -1, name: 1 });
  res.json({ charities });
}

async function getCharity(req, res) {
  const charity = await Charity.findOne({
    $or: [{ _id: req.params.id }, { slug: req.params.id }]
  });

  if (!charity) {
    return res.status(404).json({ message: "Charity not found." });
  }

  return res.json({ charity });
}

async function createCharity(req, res) {
  const charity = await Charity.create(req.body);
  return res.status(201).json({ charity });
}

async function updateCharity(req, res) {
  const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!charity) {
    return res.status(404).json({ message: "Charity not found." });
  }

  return res.json({ charity });
}

async function deleteCharity(req, res) {
  const charity = await Charity.findByIdAndDelete(req.params.id);

  if (!charity) {
    return res.status(404).json({ message: "Charity not found." });
  }

  return res.json({ message: "Charity removed." });
}

module.exports = {
  listCharities,
  getCharity,
  createCharity,
  updateCharity,
  deleteCharity
};
