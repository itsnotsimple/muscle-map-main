const Diet = require('../models/Diet');

exports.getAllDiets = async (req, res) => {
    try {
        const diets = await Diet.find();
        res.json(diets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
