const { Patient, Traitement, ConstanteVitale } = require('../models');
const { ValidationError, UniqueConstraintError } = require('sequelize');
const createError = require('../middlewares/error');

// Créer un nouveau patient
exports.createPatient = async (req, res, next) => {
  try {
    const newPatient = await Patient.create(req.body);
    res.status(201).json({
      message: 'Patient ajouté avec succès',
      patient: newPatient
    });
  } catch (error) {
    if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    next(createError(500, "Erreur lors de l'ajout du patient", error.message));
  }
};

// Récupérer tous les patients avec traitements et constantes
exports.getAllPatients = async (req, res, next) => {
  try {
    console.log("Tentative de récupération de tous les patients");
    const patients = await Patient.findAll({
      include: [Traitement, ConstanteVitale]
    });
    console.log("Patients récupérés avec succès:", patients.length);
    res.status(200).json(patients);
  } catch (error) {
    console.error("Erreur détaillée lors de la récupération des patients:", error);
    console.error("Stack trace:", error.stack);
    next(createError(500, "Erreur lors de la récupération des patients", error.message));
  }
};

// Récupérer un seul patient par ID
exports.getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findByPk(req.params.id, {
      include: [Traitement, ConstanteVitale]
    });
    if (!patient) {
      return next(createError(404, "Patient non trouvé"));
    }
    res.status(200).json(patient);
  } catch (error) {
    next(createError(500, "Erreur lors de la récupération du patient", error.message));
  }
};

// Mettre à jour un patient
exports.updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return next(createError(404, "Patient non trouvé"));
    }

    await patient.update(req.body);
    res.status(200).json({
      message: "Patient mis à jour avec succès",
      patient
    });
  } catch (error) {
    if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    next(createError(500, `Erreur lors de la mise à jour du patient : ${error.message}`));
  }
};

// Supprimer un patient
exports.deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return next(createError(404, "Patient non trouvé"));
    }

    await patient.destroy();
    res.status(200).json({ message: "Patient supprimé avec succès" });
  } catch (error) {
    next(createError(500, `Erreur lors de la suppression du patient : ${error.message}`));
  }
};
