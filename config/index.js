const dotenv = require('dotenv')

dotenv.config();

const ENV={
    PORT:   process.env.PORT || 3000,
    HOST:   process.env.MYSQLHOST || process.env.HOST,
    USER:   process.env.MYSQLUSER || process.env.USER,
    PORT_DATABASE: process.env.MYSQLPORT || process.env.PORT_DATABASE || 3306,
    PASSWORD:  process.env.MYSQLPASSWORD || process.env.PASSWORD,
    DATABASE:  process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE || process.env.DATABASE,
    DIALECT:  process.env.DIALECT || 'mysql',
    TOKEN:  process.env.TOKEN
}

// Debug des variables d'environnement
console.log('🔧 Variables d\'environnement détectées:', {
    MYSQLHOST: process.env.MYSQLHOST,
    MYSQLUSER: process.env.MYSQLUSER,
    MYSQLPORT: process.env.MYSQLPORT,
    MYSQLPASSWORD: process.env.MYSQLPASSWORD ? '***' : 'undefined',
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    MYSQLDATABASE: process.env.MYSQLDATABASE,
    DATABASE: process.env.DATABASE
});
module.exports = ENV;