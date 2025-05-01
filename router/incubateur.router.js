const express = require('express');
const router = express.Router();
const incubateur = require('../controllers/incubateur.controleur');

// Routes Incubateur
router.post('/', incubateur.createIncubateur);
router.get('/', incubateur.getAllIncubateur);
router.get('/:id', incubateur.getIncubateurById);
router.put('/:id', incubateur.updateIncubateur);
router.delete('/:id', incubateur.deleteIncubateur);

module.exports = router;
