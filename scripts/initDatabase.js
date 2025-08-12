// Script d'initialisation complet de la base de données
require('dotenv').config({ path: './config/local.env' });

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

const initDatabase = async () => {
    try {
        console.log('🚀 Initialisation complète de la base de données Railway...');
        console.log('📊 Base de données:', process.env.DATABASE);
        console.log('🌐 Host:', process.env.HOST);
        console.log('🔌 Port:', process.env.PORT_DATABASE);
        
        // ÉTAPE 1: Migration des tables
        console.log('\n📋 ÉTAPE 1: Création des tables...');
        await db.sync({ force: false, alter: true });
        console.log('✅ Tables créées avec succès !');
        
        // ÉTAPE 2: Vérifier si des utilisateurs existent
        console.log('\n📋 ÉTAPE 2: Vérification des utilisateurs...');
        const existingUsers = await User.count();
        
        if (existingUsers === 0) {
            console.log('👤 Aucun utilisateur trouvé, création du premier administrateur...');
            
            // Créer le premier utilisateur admin
            const adminUser = {
                firstName: 'IncuNeo',
                lastName: 'Administrateur',
                email: 'admin@incuneo.com',
                password: 'Admin123!',
                role: 'admin',
                numberPhone: '1234567890',
                status: true
            };
            
            // Hasher le mot de passe
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(adminUser.password, saltRounds);
            
            // Créer l'utilisateur
            const user = await User.create({
                ...adminUser,
                password: hashedPassword
            });
            
            console.log('✅ Premier utilisateur administrateur créé !');
            console.log('📊 Informations de connexion :');
            console.log('   - Prénom:', adminUser.firstName);
            console.log('   - Nom:', adminUser.lastName);
            console.log('   - Email:', adminUser.email);
            console.log('   - Mot de passe:', adminUser.password);
            console.log('   - Role:', adminUser.role);
            console.log('   - Téléphone:', adminUser.numberPhone);
            console.log('   - ID:', user.id);
            console.log('\n⚠️  IMPORTANT : Changez ce mot de passe après la première connexion !');
        } else {
            console.log(`✅ ${existingUsers} utilisateur(s) trouvé(s) dans la base de données`);
        }
        
        // ÉTAPE 3: Résumé final
        console.log('\n🎯 Initialisation terminée avec succès !');
        console.log('📊 Base de données Railway prête pour la production !');
        console.log('🚂 Prêt pour le déploiement du backend !');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation :', error.message);
        if (error.parent) {
            console.error('🔍 Détails MySQL:', error.parent.sqlMessage);
        }
        process.exit(1);
    }
};

initDatabase(); 