const { Incubateur } = require('../models');
const { ValidationError, UniqueConstraintError } = require('sequelize');
const createError = require('../middlewares/error');

// Créer un nouveau incubateur
exports.createIncubateur = async (req, res, next) => {
  try {
    const newIncubateur = await Incubateur.create(req.body);
    res.status(201).json({
      message: 'Incubateur ajouté avec succès',
      Incubateur: newIncubateur
    });
  } catch (error) {
    if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    next(createError(500, "Erreur lors de l'ajout du Incubateur", error.message));
  }
};

// Récupérer tous les incubateurs
exports.getAllIncubateur = async (req, res, next) => {
  try {
    const incubateur = await Incubateur.findAll();
    res.status(200).json(incubateur);
  } catch (error) {
    next(createError(500, "Erreur lors de la récupération des incubateur", error.message));
  }
};

// Récupérer un seul incubateur par ID
exports.getIncubateurById = async (req, res, next) => {
  try {
    const incubateur = await Incubateur.findByPk(req.params.id);
    if (!incubateur) {
      return next(createError(404, "incubateur non trouvé"));
    }
    res.status(200).json(incubateur);
  } catch (error) {
    next(createError(500, "Erreur lors de la récupération du incubateur", error.message));
  }
};

// Mettre à jour un incubateur
exports.updateIncubateur = async (req, res, next) => {
  try {
    const incubateur = await Incubateur.findByPk(req.params.id);
    if (!incubateur) {
      return next(createError(404, "incubateur non trouvé"));
    }

    await incubateur.update(req.body);
    res.status(200).json({
      message: "incubateur mis à jour avec succès",
      incubateur
    });
  } catch (error) {
    if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    next(createError(500, `Erreur lors de la mise à jour de l'incubateur : ${error.message}`));
  }
};

// Supprimer un incubateur
exports.deleteIncubateur = async (req, res, next) => {
  try {
    const incubateur = await Incubateur.findByPk(req.params.id);
    if (!incubateur) {
      return next(createError(404, "Incubateur non trouvé"));
    }

    await incubateur.destroy();
    res.status(200).json({ message: "incubateur supprimé avec succès" });
  } catch (error) {
    next(createError(500, `Erreur lors de la suppression de l'incubateur : ${error.message}`));
  }
};
