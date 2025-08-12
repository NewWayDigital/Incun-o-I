const dotenv = require('dotenv')

dotenv.config();

const ENV={
    PORT:   process.env.PORT || 3000,
    HOST:   process.env.HOST,
    USER:  process.env.USER,
    PORT_DATABASE: process.env.PORT_DATABASE,
    PASSWORD:  process.env.PASSWORD,
    DATABASE:  process.env.DATABASE,
    DIALECT:  process.env.DIALECT || 'mysql',
    TOKEN:  process.env.TOKEN
}
module.exports = ENV;