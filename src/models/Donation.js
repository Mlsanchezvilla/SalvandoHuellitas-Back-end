const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
 sequelize.define('Donation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  id_user: {
    type: DataTypes.UUID,
    references: {
      model: "Users",
      key: "id",
    },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  date: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      min: 0
    }
  },

  }, {
  timestamps: true,
 });
}