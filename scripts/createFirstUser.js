// Charger les variables d'environnement locales
require('dotenv').config({ path: './config/local.env' });

const db = require('../config/db');
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

const createFirstUser = async () => {
    try {
        console.log('👤 Création du premier utilisateur administrateur...');
        
        // Vérifier si des utilisateurs existent déjà
        const existingUsers = await User.count();
        
        if (existingUsers > 0) {
            console.log('⚠️  Des utilisateurs existent déjà dans la base de données');
            console.log('💡 Utilisez les routes d\'inscription normales pour ajouter d\'autres utilisateurs');
            process.exit(0);
        }
        
        // Données du premier utilisateur admin
        const adminUser = {
            nom: 'Administrateur',
            prenom: 'IncuNeo',
            email: 'admin@incuneo.com',
            password: 'Admin123!', // Mot de passe par défaut
            role: 'admin',
            telephone: '+1234567890',
            adresse: 'Adresse par défaut',
            isActive: true
        };
        
        // Hasher le mot de passe
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminUser.password, saltRounds);
        
        // Créer l'utilisateur
        const user = await User.create({
            ...adminUser,
            password: hashedPassword
        });
        
        console.log('✅ Premier utilisateur créé avec succès !');
        console.log('📊 Informations de connexion :');
        console.log('   - Email:', adminUser.email);
        console.log('   - Mot de passe:', adminUser.password);
        console.log('   - Role:', adminUser.role);
        console.log('   - ID:', user.id);
        
        console.log('⚠️  IMPORTANT : Changez ce mot de passe après la première connexion !');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de la création du premier utilisateur :', error.message);
        if (error.parent) {
            console.error('🔍 Détails MySQL:', error.parent.sqlMessage);
        }
        process.exit(1);
    }
};

createFirstUser(); 