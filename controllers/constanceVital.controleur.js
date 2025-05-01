const { ConstanteVitale, Patient } = require('../models');
const createError = require('../middlewares/error');

// Récupérer les constantes vitales d'un patient
exports.getConstantesByPatient = async (req, res, next) => {
  try {
    console.log(`Récupération des constantes vitales pour le patient ${req.params.patientId}`);
    
    const patient = await Patient.findByPk(req.params.patientId);
    if (!patient) {
      return next(createError(404, "Patient non trouvé"));
    }

    const constantes = await ConstanteVitale.findAll({
      where: { patientId: req.params.patientId },
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`${constantes.length} constantes vitales trouvées`);
    res.status(200).json(constantes);
  } catch (error) {
    console.error("Erreur lors de la récupération des constantes vitales:", error);
    next(createError(500, "Erreur lors de la récupération des constantes vitales", error.message));
  }
};

exports.addConstante = async (req, res, next) => {
  try {
    const patient = await Patient.findByPk(req.params.patientId);
    if (!patient) return next(createError(404, "Patient non trouvé"));

    const constante = await ConstanteVitale.create({
      ...req.body,
      patientId: patient.id
    });

    res.status(201).json({ message: "Constante vitale ajoutée", constante });
  } catch (error) {
    next(createError(500, "Erreur lors de l'ajout de la constante", error.message));
  }
};

exports.updateConstante = async (req, res, next) => {
  try {
    const constante = await ConstanteVitale.findByPk(req.params.constanteId);
    if (!constante) return next(createError(404, "Constante non trouvée"));

    await constante.update(req.body);
    res.status(200).json({ message: "Constante mise à jour", constante });
  } catch (error) {
    next(createError(500, "Erreur lors de la mise à jour de la constante", error.message));
  }
};

exports.deleteConstante = async (req, res, next) => {
  try {
    const constante = await ConstanteVitale.findByPk(req.params.constanteId);
    if (!constante) return next(createError(404, "Constante non trouvée"));

    await constante.destroy();
    res.status(200).json({ message: "Constante supprimée avec succès" });
  } catch (error) {
    next(createError(500, "Erreur lors de la suppression de la constante", error.message));
  }
};
