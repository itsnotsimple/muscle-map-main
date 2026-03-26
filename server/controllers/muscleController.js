const Muscle = require('../models/Muscle');
const seedData = require('../seedData');

exports.getMuscleByKey = async (req, res) => {
  try {
    const muscle = await Muscle.findOne({ key: req.params.key });
    res.json(muscle || { message: "Not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.seedDatabase = async (req, res) => {
  try {
    await Muscle.deleteMany({});
    await Muscle.insertMany(seedData);
    res.send("✅ Database seeded!");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
