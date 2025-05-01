const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Video = db.define('Video', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Patients',
      key: 'id'
    }
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "L'URL de la vidéo est requise" }
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Durée de la vidéo en secondes'
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL de la miniature de la vidéo'
  }
}, {
  timestamps: true
});

module.exports = Video; 