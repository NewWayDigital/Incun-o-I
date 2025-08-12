const db = require('../config/db');

const testConnection = async () => {
    try {
        console.log('🔍 Test de connexion à la base de données...');
        
        // Tester la connexion
        await db.authenticate();
        console.log('✅ Connexion réussie !');
        
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
        console.error('❌ Erreur de connexion :', error.message);
        console.error('💡 Vérifiez vos variables d\'environnement');
        process.exit(1);
    }
};

testConnection(); 