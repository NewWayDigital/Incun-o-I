const { Alerte, Patient } = require('../models');
const { ValidationError } = require('sequelize');
const createError = require('../middlewares/error');

// Récupérer toutes les alertes
exports.getAllAlertes = async (req, res, next) => {
  try {
    console.log("Tentative de récupération de toutes les alertes");
    
    const alertes = await Alerte.findAll({
      include: [{
        model: Patient,
        attributes: ['id', 'nom'] // Récupérer seulement l'id et le nom du patient
      }],
      order: [['createdAt', 'DESC']] // Plus récentes en premier
    });
    console.log("Alertes récupérées avec succès:", alertes.length);
    res.status(200).json(alertes);
  } catch (error) {
    console.error("Erreur lors de la récupération des alertes:", error);
    next(createError(500, "Erreur lors de la récupération des alertes", error.message));
  }
};

// Créer une nouvelle alerte
exports.createAlerte = async (req, res, next) => {
  try {
    const nouvelleAlerte = await Alerte.create(req.body);
    res.status(201).json({
      message: 'Alerte créée avec succès',
      alerte: nouvelleAlerte
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    next(createError(500, "Erreur lors de la création de l'alerte", error.message));
  }
};

// Supprimer une alerte
exports.deleteAlerte = async (req, res, next) => {
  try {
    const alerte = await Alerte.findByPk(req.params.id);
    if (!alerte) {
      return next(createError(404, "Alerte non trouvée"));
    }

    await alerte.destroy();
    res.status(200).json({ message: "Alerte supprimée avec succès" });
  } catch (error) {
    next(createError(500, `Erreur lors de la suppression de l'alerte : ${error.message}`));
  }
}; 