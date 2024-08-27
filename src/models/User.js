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
  age: {
    type: DataTypes.INTEGER,
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
    allowNull: false,
    defaultValue: 0
  },

  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  facebookId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },

  gender: {
    type: DataTypes.STRING,
    validate: {
      isIn: [['female', 'male']] 
    }

  }
  }, {
  timestamps: true, 
 });
}
