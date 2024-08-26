const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Request",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      id_user: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },

 
      id_pet: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Pets",
          key: "id",
        },


      preferedSpecie: {
        type: DataTypes.ENUM("cat", "dog"),
        allowNull: false,
      },

      timeAvailable: {
        type: DataTypes.ENUM("0", "-1", "1", "+1"),
        allowNull: false,
      },

      space: {
        type: DataTypes.ENUM("small", "medium", "large"),
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
      },
    },
    {
      timestamps: false,
    }
  );
};
