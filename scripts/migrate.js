const db = require('../config/db');
const Patient = require('../models/Patient.model');
const Incubateur = require('../models/Incubateur.model');
const ConstanteVitale = require('../models/constanceVitale.model');
const Traitement = require('../models/Traitement.model');
const Photo = require('../models/Photo.model');
const Video = require('../models/Video.model');
const Alerte = require('../models/Alerte.model');
const IncubateurTrend = require('../models/IncubateurTrend.model');

const migrate = async () => {
    try {
        console.log('🚀 Début de la migration...');
        
        // Synchroniser tous les modèles avec la base de données
        await db.sync({ force: false, alter: true });
        
        console.log('✅ Migration terminée avec succès !');
        console.log('📊 Tables créées :');
        console.log('   - Patients');
        console.log('   - Incubateurs');
        console.log('   - Constantes Vitales');
        console.log('   - Traitements');
        console.log('   - Photos');
        console.log('   - Vidéos');
        console.log('   - Alertes');
        console.log('   - Tendances Incubateurs');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de la migration :', error);
        process.exit(1);
    }
};

migrate(); 