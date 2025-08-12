// Charger les variables d'environnement locales
require('dotenv').config({ path: './config/local.env' });

const db = require('../config/db');

// Importer TOUS les modèles dans l'ordre des dépendances
const User = require('../models/User.model');
const Patient = require('../models/Patient.model');
const Incubateur = require('../models/Incubateur.model');
const ConstanteVitale = require('../models/constanceVitale.model');
const Traitement = require('../models/Traitement.model');
const Photo = require('../models/Photo.model');
const Video = require('../models/Video.model');
const Alerte = require('../models/Alerte.model');
const IncubateurTrend = require('../models/IncubateurTrend.model');

const migrateLocal = async () => {
    try {
        console.log('🚀 Début de la migration locale avec Railway...');
        console.log('📊 Base de données:', process.env.DATABASE);
        console.log('🌐 Host:', process.env.HOST);
        console.log('🔌 Port:', process.env.PORT_DATABASE);
        
        console.log('📋 Modèles chargés :');
        console.log('   - User (table de base)');
        console.log('   - Patient (dépend de User)');
        console.log('   - Incubateur');
        console.log('   - ConstanteVitale');
        console.log('   - Traitement');
        console.log('   - Photo');
        console.log('   - Video');
        console.log('   - Alerte');
        console.log('   - IncubateurTrend');
        
        // Synchroniser tous les modèles avec la base de données
        // force: false = ne pas recréer les tables existantes
        // alter: true = modifier les tables existantes si nécessaire
        await db.sync({ force: false, alter: true });
        
        console.log('✅ Migration terminée avec succès !');
        console.log('🎯 Base de données Railway prête !');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de la migration :', error.message);
        if (error.parent) {
            console.error('🔍 Détails MySQL:', error.parent.sqlMessage);
        }
        process.exit(1);
    }
};

migrateLocal(); 