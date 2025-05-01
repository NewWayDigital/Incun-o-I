const express = require('express');
const router = express.Router();
const incubateurTrendController = require('../controllers/incubateurTrend.controleur');

// Routes pour les tendances des incubateurs
router.get('/:incubateurId/trends', incubateurTrendController.getTrendsByIncubateur);
router.post('/:incubateurId/trends', incubateurTrendController.addTrend);

module.exports = router; 