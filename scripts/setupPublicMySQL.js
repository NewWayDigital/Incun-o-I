// Script d'initialisation avec URL publique MySQL
console.log('🚀 Démarrage de l\'initialisation avec URL publique MySQL...');

// Configuration directe pour MySQL public
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Remplacez ces valeurs par les vraies valeurs de votre MySQL Railway
const DB_CONFIG = {
    host: 'incun-o-i-production.up.railway.app', // URL publique de votre MySQL
    port: 3306,
    user: 'root',
    password: 'SlxhJSLyhVvPsorxRUueaIcKpWCJHbUu',
    database: 'railway'
};

const setupPublicMySQL = async () => {
    try {
        console.log('🔧 Configuration MySQL:', {
            host: DB_CONFIG.host,
            port: DB_CONFIG.port,
            user: DB_CONFIG.user,
            database: DB_CONFIG.database
        });

        // Test de connexion directe
        console.log('📡 Test de connexion directe à MySQL...');
        const connection = await mysql.createConnection(DB_CONFIG);
        console.log('✅ Connexion directe à MySQL réussie !');

        // Créer la base de données si elle n'existe pas
        console.log('📋 Vérification de la base de données...');
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${DB_CONFIG.database}`);
        console.log(`✅ Base de données ${DB_CONFIG.database} prête !`);

        // Utiliser la base de données
        await connection.execute(`USE ${DB_CONFIG.database}`);

        // Créer la table users
        console.log('👤 Création de la table users...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                firstName VARCHAR(255) NOT NULL,
                lastName VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'medical', 'parent') DEFAULT 'parent',
                numberPhone VARCHAR(20),
                status BOOLEAN DEFAULT true,
                patientId INT,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Table users créée !');

        // Vérifier si des utilisateurs existent
        const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
        const userCount = users[0].count;

        if (userCount === 0) {
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
            
            await connection.execute(`
                INSERT INTO users (firstName, lastName, email, password, role, numberPhone, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [adminUser.firstName, adminUser.lastName, adminUser.email, hashedPassword, adminUser.role, adminUser.numberPhone, adminUser.status]);
            
            console.log('✅ Utilisateur administrateur créé !');
            console.log('📊 Informations de connexion :');
            console.log('   - Email:', adminUser.email);
            console.log('   - Mot de passe:', adminUser.password);
        } else {
            console.log(`✅ ${userCount} utilisateur(s) trouvé(s)`);
        }

        await connection.end();
        console.log('🎉 Initialisation MySQL publique terminée avec succès !');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error.message);
        process.exit(1);
    }
};

setupPublicMySQL();
