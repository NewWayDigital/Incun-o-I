const { Photo, Patient } = require('../models');

// Récupérer toutes les photos
exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.findAll({
      include: [{
        model: Patient,
        attributes: ['id', 'nom']
      }],
      order: [['date', 'DESC']]
    });
    res.status(200).json({ success: true, data: photos });
  } catch (error) {
    console.error('Erreur lors de la récupération des photos:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des photos' });
  }
};

// Récupérer les photos d'un patient spécifique
exports.getPhotosByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const photos = await Photo.findAll({
      where: { patientId },
      order: [['date', 'DESC']]
    });
    res.status(200).json({ success: true, data: photos });
  } catch (error) {
    console.error('Erreur lors de la récupération des photos du patient:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des photos du patient' });
  }
};

// Récupérer une photo spécifique
exports.getPhotoById = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Photo.findByPk(id, {
      include: [{
        model: Patient,
        attributes: ['id', 'nom']
      }]
    });
    
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo non trouvée' });
    }
    
    res.status(200).json({ success: true, data: photo });
  } catch (error) {
    console.error('Erreur lors de la récupération de la photo:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération de la photo' });
  }
};

// Créer une nouvelle photo
exports.createPhoto = async (req, res) => {
  try {
    const { patientId, url, description } = req.body;
    
    // Vérifier si le patient existe
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient non trouvé' });
    }
    
    const photo = await Photo.create({
      patientId,
      url,
      description,
      date: new Date()
    });
    
    res.status(201).json({ success: true, data: photo });
  } catch (error) {
    console.error('Erreur lors de la création de la photo:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la création de la photo' });
  }
};

// Mettre à jour une photo
exports.updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, description } = req.body;
    
    const photo = await Photo.findByPk(id);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo non trouvée' });
    }
    
    await photo.update({
      url: url || photo.url,
      description: description || photo.description
    });
    
    res.status(200).json({ success: true, data: photo });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la photo:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour de la photo' });
  }
};

// Supprimer une photo
exports.deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    
    const photo = await Photo.findByPk(id);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo non trouvée' });
    }
    
    await photo.destroy();
    
    res.status(200).json({ success: true, message: 'Photo supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la photo:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression de la photo' });
  }
};