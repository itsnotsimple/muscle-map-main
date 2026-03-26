const express = require('express');
const router = express.Router();
const muscleController = require('../controllers/muscleController');

router.get('/muscles/seed', muscleController.seedDatabase);
router.get('/muscles/:key', muscleController.getMuscleByKey);

module.exports = router;