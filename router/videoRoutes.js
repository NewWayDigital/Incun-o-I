const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { verifyToken, isParent, isMedical, isAdmin } = require('../middlewares/authMiddleware');

// Appliquer le middleware d'authentification à toutes les routes
router.use(verifyToken);

// Récupérer toutes les vidéos (accessible aux parents, personnel médical et administrateurs)
router.get('/', videoController.getAllVideos);

// Récupérer les vidéos d'un patient spécifique (accessible aux parents, personnel médical et administrateurs)
router.get('/patient/:patientId', videoController.getVideosByPatientId);

// Récupérer une vidéo spécifique (accessible aux parents, personnel médical et administrateurs)
router.get('/:id', videoController.getVideoById);

// Créer une nouvelle vidéo (accessible au personnel médical et administrateurs)
router.post('/', isMedical, videoController.createVideo);

// Mettre à jour une vidéo (accessible au personnel médical et administrateurs)
router.put('/:id', isMedical, videoController.updateVideo);

// Supprimer une vidéo (accessible aux administrateurs uniquement)
router.delete('/:id', isAdmin, videoController.deleteVideo);

module.exports = router; 