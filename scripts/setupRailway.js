// Script d'initialisation spécifique pour Railway
console.log('🚀 Démarrage de l\'initialisation Railway...');

// Charger les variables d'environnement
const db = require('../config/db');
const User = require('../models/User.model');
const Patient = require('../models/Patient.model');
const Incubateur = require('../models/Incubateur.model');
const ConstanteVitale = require('../models/constanceVitale.model');
const Traitement = require('../models/Traitement.model');
const Photo = require('../models/Photo.model');
const Video = require('../models/Video.model');
const Alerte = require('../models/Alerte.model');
const IncubateurTrend = require('../models/IncubateurTrend.model');
const bcrypt = require('bcrypt');

const setupRailway = async () => {
    try {
        console.log('🔧 Configuration détectée:', {
            host: process.env.MYSQLHOST,
            port: process.env.MYSQLPORT,
            database: process.env.MYSQL_DATABASE,
            user: process.env.MYSQLUSER,
            nodeEnv: process.env.NODE_ENV
        });

        // Test de connexion
        console.log('📡 Test de connexion à la base de données...');
        await db.authenticate();
        console.log('✅ Connexion à la base de données réussie !');

        // Création des tables
        console.log('📋 Création des tables...');
        await db.sync({ force: false, alter: true });
        console.log('✅ Tables créées avec succès !');

        // Vérification des utilisateurs
        console.log('👤 Vérification des utilisateurs...');
        const existingUsers = await User.count();
        
        if (existingUsers === 0) {
            console.log('➕ Création de l\'utilisateur administrateur...');
            
            const adminUser = {
                firstName: 'IncuNeo',
                lastName: 'Administrateur',
                email: 'admin@incuneoi.com',
                password: 'Admin123!',
                role: 'admin',
                numberPhone: '1234567890',
                status: true
            };
            
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(adminUser.password, saltRounds);
            
            const user = await User.create({
                ...adminUser,
                password: hashedPassword
            });
            
            console.log('✅ Utilisateur administrateur créé !');
            console.log('📊 Informations de connexion :');
            console.log('   - Email:', adminUser.email);
            console.log('   - Mot de passe:', adminUser.password);
            console.log('   - ID:', user.id);
        } else {
            console.log(`✅ ${existingUsers} utilisateur(s) trouvé(s)`);
        }

        console.log('🎉 Initialisation Railway terminée avec succès !');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error.message);
        if (error.parent) {
            console.error('🔍 Détails MySQL:', error.parent.sqlMessage);
        }
        process.exit(1);
    }
};

setupRailway();
