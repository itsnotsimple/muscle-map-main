const express = require('express');
const router = express.Router();
const Diet = require('../models/Diet');

// GET all generic diets
router.get('/diets', async (req, res) => {
    try {
        const diets = await Diet.find();
        res.json(diets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
