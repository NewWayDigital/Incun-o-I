const { IncubateurTrend, Incubateur } = require('../models');
const { ValidationError } = require('sequelize');
const createError = require('../middlewares/error');

// Récupérer toutes les tendances d'un incubateur
exports.getTrendsByIncubateur = async (req, res, next) => {
  try {
    console.log(`Récupération des tendances pour l'incubateur ${req.params.incubateurId}`);
    const trends = await IncubateurTrend.findAll({
      where: { incubateurId: req.params.incubateurId },
      order: [['timestamp', 'DESC']],
      limit: 24 // Limiter aux 24 dernières tendances
    });
    
    // Vérifier si des tendances existent, sinon générer des données de test
    if (trends.length === 0) {
      console.log(`Aucune tendance trouvée pour l'incubateur ${req.params.incubateurId}, génération de données test`);
      
      // Vérifier si l'incubateur existe
      const incubateur = await Incubateur.findByPk(req.params.incubateurId);
      if (!incubateur) {
        return next(createError(404, "Incubateur non trouvé"));
      }
      
      // Générer quelques données de test (12 dernières heures)
      const testTrends = [];
      const now = new Date();
      
      for (let i = 0; i < 12; i++) {
        const hourAgo = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hour = hourAgo.getHours().toString().padStart(2, '0');
        const minutes = hourAgo.getMinutes().toString().padStart(2, '0');
        
        // Générer des variations légères
        const baseTemp = 37.0 + Math.random() * 0.3;
        const baseHR = 130 + Math.floor(Math.random() * 10);
        const baseOxy = 95 + Math.floor(Math.random() * 5);
        
        testTrends.push({
          incubateurId: req.params.incubateurId,
          time: `${hour}:${minutes}`,
          timestamp: hourAgo,
          temperature: baseTemp.toFixed(1),
          heartRate: `${baseHR}`,
          oxygenLevel: `${baseOxy}`
        });
      }
      
      // Sauvegarder les données de test
      await IncubateurTrend.bulkCreate(testTrends);
      
      // Récupérer les tendances générées
      const generatedTrends = await IncubateurTrend.findAll({
        where: { incubateurId: req.params.incubateurId },
        order: [['timestamp', 'DESC']],
        limit: 24
      });
      
      return res.status(200).json(generatedTrends);
    }
    
    res.status(200).json(trends);
  } catch (error) {
    console.error(`Erreur lors de la récupération des tendances de l'incubateur ${req.params.incubateurId}:`, error);
    next(createError(500, `Erreur lors de la récupération des tendances de l'incubateur`, error.message));
  }
};

// Ajouter une nouvelle tendance
exports.addTrend = async (req, res, next) => {
  try {
    const { incubateurId } = req.params;
    
    // Vérifier si l'incubateur existe
    const incubateur = await Incubateur.findByPk(incubateurId);
    if (!incubateur) {
      return next(createError(404, "Incubateur non trouvé"));
    }
    
    // Créer une nouvelle tendance
    const newTrend = await IncubateurTrend.create({
      ...req.body,
      incubateurId
    });
    
    res.status(201).json({
      message: 'Tendance ajoutée avec succès',
      trend: newTrend
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    next(createError(500, "Erreur lors de l'ajout de la tendance", error.message));
  }
}; 