const db = require('../config/db');

const testRailwayConnection = async () => {
    try {
        console.log('🚂 Test de connexion Railway...');
        console.log('📊 Variables d\'environnement :');
        console.log('   - DATABASE:', process.env.MYSQL_DATABASE || 'Non définie');
        console.log('   - USER:', process.env.MYSQLUSER || 'Non définie');
        console.log('   - HOST:', process.env.MYSQLHOST || 'Non définie');
        console.log('   - PORT:', process.env.MYSQLPORT || 'Non définie');
        console.log('   - PASSWORD:', process.env.MYSQL_ROOT_PASSWORD ? '***Définie***' : 'Non définie');
        
        // Tester la connexion
        await db.authenticate();
        console.log('✅ Connexion Railway réussie !');
        
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
        console.error('❌ Erreur de connexion Railway :', error.message);
        console.error('💡 Vérifiez que les variables d\'environnement Railway sont définies');
        process.exit(1);
    }
};

testRailwayConnection(); 