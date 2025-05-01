const express = require('express');
const router = express.Router();
const alerteController = require('../controllers/alerte.controleur');

// Routes alertes
router.get('/', alerteController.getAllAlertes);
router.post('/', alerteController.createAlerte);
router.delete('/:id', alerteController.deleteAlerte);

module.exports = router; 