// Charger les variables d'environnement locales
require('dotenv').config({ path: './config/local.env' });

const db = require('../config/db');

const testLocalConnection = async () => {
    try {
        console.log('🔧 Test de connexion locale avec Railway...');
        console.log('📊 Variables d\'environnement chargées :');
        console.log('   - DATABASE:', process.env.DATABASE);
        console.log('   - USER:', process.env.USER);
        console.log('   - HOST:', process.env.HOST);
        console.log('   - PORT:', process.env.PORT_DATABASE);
        console.log('   - PASSWORD:', process.env.PASSWORD ? '***Définie***' : 'Non définie');
        
        // Tester la connexion
        await db.authenticate();
        console.log('✅ Connexion locale réussie !');
        
        // Tester une requête simple
        const result = await db.query('SELECT 1 as test');
        console.log('✅ Requête de test réussie :', result[0]);
        
        // Afficher les informations de connexion
        console.log('📊 Informations de connexion :');
        console.log('   - Host:', db.config.host);
        console.log('   - Port:', db.config.port);
        console.log('   - Database:', db.config.database);
        console.log('   - Dialect:', db.config.dialect);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur de connexion locale :', error.message);
        console.error('💡 Vérifiez la configuration dans config/local.env');
        process.exit(1);
    }
};

testLocalConnection(); 