const dotenv = require('dotenv')

dotenv.config();

const ENV={
    PORT:   process.env.PORT,
    HOST:   process.env.HOST,
    USER:  process.env.DB_USER,
    PORT_DATABASE: process.env.PORT_DATABASE,
    PASSWORD:  process.env.PASSWORD,
    DATABASE:  process.env.DATABASE,
    DIALECT:  process.env.DIALECT,
    TOKEN:  process.env.TOKEN

}
module.exports = ENV;