const express = require('express');
const router = express.Router();
const constanceVital = require('../controllers/constanceVital.controleur');

// Route pour récupérer les constantes vitales d'un patient
router.get('/patient/:patientId', constanceVital.getConstantesByPatient);

router.post('/:patientId', constanceVital.addConstante);
router.put('/:constanteId', constanceVital.updateConstante);
router.delete('/:constanteId', constanceVital.deleteConstante);

module.exports = router;
