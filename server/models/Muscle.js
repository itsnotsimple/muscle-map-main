const mongoose = require('mongoose');

const MuscleSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subTitle: { type: String }, // НОВО: Подзаглавие (напр. "Deltoid anterior head")
  exercises: [
    {
      name: { type: String, required: true },
      text: { type: String, required: true },
      difficulty: { type: String }, // Beginner / Intermediate / Advanced
      equipment: { type: String },  // Dumbbells / Barbell / Machine
      location: { type: String },   // Gym / Home
      steps: [{ type: String }],    // Масив от стъпки (Инструкции)
      gif: { type: String },
      youtubeUrl: { type: String } // НОВО: Линкове към туториали
    }
  ]
});

module.exports = mongoose.model('Muscle', MuscleSchema);