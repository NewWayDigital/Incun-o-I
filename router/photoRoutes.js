const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const { verifyToken, isParent, isMedical, isAdmin } = require('../middlewares/authMiddleware');

// Appliquer le middleware d'authentification à toutes les routes
router.use(verifyToken);

// Récupérer toutes les photos (accessible aux parents, personnel médical et administrateurs)
router.get('/', photoController.getAllPhotos);

// Récupérer les photos d'un patient spécifique (accessible aux parents, personnel médical et administrateurs)
router.get('/patient/:patientId', photoController.getPhotosByPatientId);

// Récupérer une photo spécifique (accessible aux parents, personnel médical et administrateurs)
router.get('/:id', photoController.getPhotoById);

// Créer une nouvelle photo (accessible au personnel médical et administrateurs)
router.post('/', isMedical, photoController.createPhoto);

// Mettre à jour une photo (accessible au personnel médical et administrateurs)
router.put('/:id', isMedical, photoController.updatePhoto);

// Supprimer une photo (accessible aux administrateurs uniquement)
router.delete('/:id', isAdmin, photoController.deletePhoto);

module.exports = router; 