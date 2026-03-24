const mongoose = require('mongoose');

const DietSchema = new mongoose.Schema({
    identifier: { type: String, required: true, unique: true }, // e.g. "balanced", "keto"
    name: { type: String, required: true },
    description: { type: String, required: true },
    macroSplit: {
        protein: { type: Number, required: true }, // percentage, e.g., 30
        carbs: { type: Number, required: true },   // percentage, e.g., 40
        fats: { type: Number, required: true }     // percentage, e.g., 30
    },
    goodFoods: [{ type: String }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Diet', DietSchema);
