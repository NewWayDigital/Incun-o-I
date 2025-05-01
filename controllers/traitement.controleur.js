const { Traitement, Patient } = require('../models');
const createError = require('../middlewares/error');

exports.addTraitement = async (req, res, next) => {
  try {
    const patient = await Patient.findByPk(req.params.patientId);
    if (!patient) return next(createError(404, "Patient non trouvé"));

    const traitement = await Traitement.create({
      ...req.body,
      patientId: patient.id
    });

    res.status(201).json({ message: "Traitement ajouté avec succès", traitement });
  } catch (error) {
    next(createError(500, "Erreur lors de l'ajout du traitement", error.message));
  }
};

exports.updateTraitement = async (req, res, next) => {
  try {
    const traitement = await Traitement.findByPk(req.params.traitementId);
    if (!traitement) return next(createError(404, "Traitement non trouvé"));

    await traitement.update(req.body);
    res.status(200).json({ message: "Traitement mis à jour", traitement });
  } catch (error) {
    next(createError(500, "Erreur lors de la mise à jour du traitement", error.message));
  }
};

exports.deleteTraitement = async (req, res, next) => {
  try {
    const traitement = await Traitement.findByPk(req.params.traitementId);
    if (!traitement) return next(createError(404, "Traitement non trouvé"));

    await traitement.destroy();
    res.status(200).json({ message: "Traitement supprimé avec succès" });
  } catch (error) {
    next(createError(500, "Erreur lors de la suppression du traitement", error.message));
  }
};

exports.addMultipleTraitements = async (req, res, next) => {
  try {
    console.log("Données reçues du frontend:", req.body);
    
    const patient = await Patient.findByPk(req.params.patientId);
    if (!patient) return next(createError(404, "Patient non trouvé"));

    // Vérifier si les données sont envoyées dans un tableau ou dans un objet avec la propriété traitements
    const traitementsData = Array.isArray(req.body) ? req.body : 
                           (req.body.traitements ? req.body.traitements : []);
    
    console.log("Données des traitements à créer:", traitementsData);
    
    if (!traitementsData.length) {
      return next(createError(400, "Aucun traitement à ajouter"));
    }

    const traitements = await Traitement.bulkCreate(
      traitementsData.map(traitement => ({
        ...traitement,
        patientId: patient.id
      }))
    );

    res.status(201).json({
      message: `${traitements.length} traitements ajoutés avec succès`,
      traitements
    });
  } catch (error) {
    console.error("Erreur complète:", error);
    next(createError(500, "Erreur lors de l'ajout des traitements", error.message));
  }
};
  