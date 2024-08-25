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
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['female', 'male']] // Puedes agregar más opciones si es necesario
    }
  }
  }, {
  timestamps: true, 
});
}
