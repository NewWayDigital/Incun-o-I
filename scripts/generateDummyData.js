const { Alerte, Patient } = require('../models');

/**
 * Script pour générer des données de test pour les alertes
 * Doit être exécuté après le démarrage du serveur une fois
 */
async function generateDummyAlertes() {
  try {
    console.log('Génération de données fictives pour les alertes...');
    
    // Vérifier s'il y a déjà des alertes
    const alertCount = await Alerte.count();
    if (alertCount > 0) {
      console.log(`Il y a déjà ${alertCount} alertes dans la base de données. Aucune génération nécessaire.`);
      return;
    }
    
    // Récupérer tous les patients pour créer des alertes associées
    const patients = await Patient.findAll();
    if (patients.length === 0) {
      console.log('Aucun patient trouvé dans la base de données. Impossible de créer des alertes.');
      return;
    }
    
    // Données d'exemple pour les alertes
    const dummyAlertes = [
      {
        type: 'critical',
        title: 'Température élevée',
        time: 'Il y a 10 minutes',
        incubator: patients[0].incubateur || 'C3',
        date: new Date(Date.now() - 10*60000),
        temperature: '38.2°C',
        pouls: '155 bpm',
        respiration: 'Élevée',
        poids: '1.9 kg',
        humiditeCorp: '70%',
        patientId: patients[0].id
      },
      {
        type: 'warning',
        title: 'Humidité basse',
        time: 'Il y a 25 minutes',
        incubator: patients.length > 1 ? patients[1].incubateur : 'B2',
        date: new Date(Date.now() - 25*60000),
        temperature: '37.8°C',
        pouls: '145 bpm',
        respiration: 'Normale',
        poids: '2.3 kg',
        humiditeCorp: '58%',
        patientId: patients.length > 1 ? patients[1].id : patients[0].id
      },
      {
        type: 'info',
        title: 'Maintenance planifiée - Incubateur',
        time: 'Il y a 3 heures',
        incubator: 'D4',
        date: new Date(Date.now() - 3*60*60000),
        temperature: 'N/A',
        pouls: 'N/A',
        respiration: 'N/A',
        poids: 'N/A',
        humiditeCorp: 'N/A',
        patientId: null
      }
    ];
    
    // Créer les alertes
    await Alerte.bulkCreate(dummyAlertes);
    
    console.log(`✅ ${dummyAlertes.length} alertes créées avec succès.`);
  } catch (error) {
    console.error('❌ Erreur lors de la génération des alertes:', error);
  }
}

// Exporter la fonction pour l'utiliser dans d'autres scripts
module.exports = { generateDummyAlertes };

// Si ce script est exécuté directement
if (require.main === module) {
  // Se connecter à la base de données et générer les données
  const { db } = require('../models');
  db.sync()
    .then(() => generateDummyAlertes())
    .then(() => {
      console.log('Terminé');
      process.exit(0);
    })
    .catch(err => {
      console.error('Erreur:', err);
      process.exit(1);
    });
} 