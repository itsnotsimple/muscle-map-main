const express = require('express');
const router = express.Router();
const dietController = require('../controllers/dietController');

router.get('/diets', dietController.getAllDiets);

module.exports = router;
