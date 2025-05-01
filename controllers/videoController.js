const { Video, Patient } = require('../models');

// Récupérer toutes les vidéos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.findAll({
      include: [{
        model: Patient,
        attributes: ['id', 'nom']
      }],
      order: [['date', 'DESC']]
    });
    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des vidéos' });
  }
};

// Récupérer les vidéos d'un patient spécifique
exports.getVideosByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const videos = await Video.findAll({
      where: { patientId },
      order: [['date', 'DESC']]
    });
    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos du patient:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des vidéos du patient' });
  }
};

// Récupérer une vidéo spécifique
exports.getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByPk(id, {
      include: [{
        model: Patient,
        attributes: ['id', 'nom']
      }]
    });
    
    if (!video) {
      return res.status(404).json({ success: false, message: 'Vidéo non trouvée' });
    }
    
    res.status(200).json({ success: true, data: video });
  } catch (error) {
    console.error('Erreur lors de la récupération de la vidéo:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération de la vidéo' });
  }
};

// Créer une nouvelle vidéo
exports.createVideo = async (req, res) => {
  try {
    const { patientId, url, description, duration, thumbnail } = req.body;
    
    // Vérifier si le patient existe
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient non trouvé' });
    }
    
    const video = await Video.create({
      patientId,
      url,
      description,
      duration,
      thumbnail,
      date: new Date()
    });
    
    res.status(201).json({ success: true, data: video });
  } catch (error) {
    console.error('Erreur lors de la création de la vidéo:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la création de la vidéo' });
  }
};

// Mettre à jour une vidéo
exports.updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, description, duration, thumbnail } = req.body;
    
    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Vidéo non trouvée' });
    }
    
    await video.update({
      url: url || video.url,
      description: description || video.description,
      duration: duration || video.duration,
      thumbnail: thumbnail || video.thumbnail
    });
    
    res.status(200).json({ success: true, data: video });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la vidéo:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour de la vidéo' });
  }
};

// Supprimer une vidéo
exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Vidéo non trouvée' });
    }
    
    await video.destroy();
    
    res.status(200).json({ success: true, message: 'Vidéo supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la vidéo:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression de la vidéo' });
  }
}; 