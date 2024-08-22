const { DataTypes } = require('sequelize');
// exports the function that defines the Pet model on the DB
module.exports = (sequelize) => {
    // definines the model
    sequelize.define('Request', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes. UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      id_user: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      id_pet: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      preferedSpecie: {
        type: DataTypes.ENUM('cat', 'dog'),
        allowNull: false,
      },

      timeAbailable: {
        type: DataTypes.ENUM('0', '-1', '1', '+1'),
        allowNull: false,
      },

      space: {
        type: DataTypes.ENUM('small', 'medium', 'large'),
        allowNull: false,
      },

      petsAllowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },

      totalHabitants: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      allHabitantsAgree: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },

      noScaping: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },

      hasPets: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },

      hasKids: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },

      addedCondition: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },

      agreeToVet: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },

      agreeToExpenses: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      }
      
    }, {
      timestamps: false,
      tableName: 'Requests'
    });
};
