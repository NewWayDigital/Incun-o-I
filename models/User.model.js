const { DataTypes } = require('sequelize')
const db = require ('../config/db');

//Définir le modèle de la table user 
const User = db.define ('User', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    firstName:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notNull:{msg:"le prenom est requis"},
            notEmpty:{msg:"le prenom est vide"},
            isAlpha:{msg:"le prenom ne correspond pas au format alpha"}
        }
    },
    lastName:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notNull:{msg:"le nom est requis"},
            notEmpty:{msg:"le nom est vide"},
            isAlpha:{msg:"le Nom ne correspond pas au format alpha"}
        }
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: {msg:"l'email est déjà utilisé"},
        validate:{
            isEmail:{msg:"l'email ne respecte pas la constitution d'un email normal"},
            notNull:{msg:"l'email est requis"},
            notEmpty:{msg:"l'email est vide"}

        }
    },
    numberPhone:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notNull:{msg:"le numéro est requis"},
            isNumeric: {msg:"Seulement le format numérique utilisé"},
            notEmpty:{msg:"le numéro de téléphone est vide"},
            len:[10,10]
        }
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            isIn:{
                args:[ ['admin','doctor','nurse','parent']],
                msg:"le type doit appartenir à la liste ['admin','doctor','nurse','parent']"
            }
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    status:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Patients',
            key: 'id'
        }
    }
},
{
    timesTamps: true
}
);

module.exports = User;
