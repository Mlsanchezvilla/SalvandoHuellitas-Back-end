const { DataTypes } = require('sequelize');
const sequelize = require("../db"); 

module.exports = (sequelize) => {
 sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
 isActive: {
    type: DataTypes.BOOLEAN,
    // allowNull: false,
    defaultValue: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true // Cambiar a true para soportar autenticación social
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  birthDate: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  idCard: {
    type: DataTypes.STRING, 
    allowNull: true
  },
  occupation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  adoptions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },

  }, {
  timestamps: true, 
 });
}
