const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedExercises: [
    {
      name: String,
      muscleGroup: String,
      gif: String,
      difficulty: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);