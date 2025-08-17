const Sequelize= require('sequelize')
const ENV= require('./index')
console.log('☯ Initialisation de la connexion à MySQL...');

const db=new Sequelize(ENV.DATABASE,ENV.USER,ENV.PASSWORD,{
    host: ENV.HOST,
    dialect: ENV.DIALECT,
    port: ENV.PORT_DATABASE,
    logging: process.env.NODE_ENV === 'development',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

const connection= async() =>{
    try {
        console.log('💨Tentative de connection à la BDD...')
        console.log('🔧 Configuration DB:', {
            host: ENV.HOST,
            port: ENV.PORT_DATABASE,
            database: ENV.DATABASE,
            user: ENV.USER,
            dialect: ENV.DIALECT
        })
        await db.authenticate();
        console.log('✅connection réussie à MySQL')
    } catch (error) {
        console.error('❌❌❌ Erreur de connection à la BDD :',error.message);
        console.error('🔧 Détails de la configuration:', {
            host: ENV.HOST,
            port: ENV.PORT_DATABASE,
            database: ENV.DATABASE,
            user: ENV.USER
        })
    }
}
connection();
module.exports = db ;