const Sequelize= require('sequelize')
const ENV= require('./index')
console.log('☯ Initialisation de la connexion à MySQL...');

const db=new Sequelize(ENV.DATABASE,ENV.USER,ENV.PASSWORD,{
    host: ENV.HOST,
    dialect: ENV.DIALECT,
    port: ENV.PORT_DATABASE,
    logging: false
})

const connection= async() =>{
    try {
        console.log('💨Tentative de connection à la BDD...')
        await db.authenticate();
        console.log('✅connection réussie à MySQL')
    } catch (error) {
        console.error('❌❌❌ Erreur de connection à la BDD :',error.message);
    }
}
connection();
module.exports = db ;