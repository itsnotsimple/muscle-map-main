require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Импортираме моделите и новия рут файл
const Muscle = require('./models/Muscle');
const seedData = require('./seedData');
const authRoutes = require('./routes/auth'); // <--- ВРЪЗКАТА С НОВИЯ ФАЙЛ

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ВРЪЗКА С БАЗАТА
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/musclewiki')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));


// --- ИЗПОЛЗВАНЕ НА РУТОВЕТЕ ---

// Тук казваме: Всичко, което идва от authRoutes, да започва с /api
// Тоест: /register става /api/register
app.use('/api', authRoutes);

// Пътищата за мускулите си остават тук (може и тях да преместим по-нататък, но нека не пипаме работещо нещо сега)
app.get('/api/muscles/:key', async (req, res) => {
  try {
    const muscle = await Muscle.findOne({ key: req.params.key });
    if (!muscle) return res.status(404).json({ message: "Not found" });
    res.json(muscle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/seed', async (req, res) => {
  try {
    await Muscle.deleteMany({}); 
    await Muscle.insertMany(seedData); 
    res.send("✅ DATABASE RELOADED SUCCESSFULLY from seedData.js!");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));