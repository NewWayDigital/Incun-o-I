const express = require('express');
const router = express.Router();
const controller = require('../controllers/traitement.controleur');

router.post('/:patientId', controller.addTraitement);
router.put('/:traitementId', controller.updateTraitement);
router.delete('/:traitementId', controller.deleteTraitement);
router.post('/multiple/:patientId', controller.addMultipleTraitements);
module.exports = router;
