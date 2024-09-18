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
        allowNull: true,
        references: {
          model: "Pets",
          key: "id",
        },
      },

      status: {
        type: DataTypes.ENUM("pending", "denied", "approved", "closed"),
        defaultValue: "pending",
      },

      preferedSpecie: {
        type: DataTypes.ENUM("cat", "dog"),
      },
      timeAvailable: {
        type: DataTypes.ENUM("0", "-1", "1", "+1"),
        allowNull: false,
      },

      space: {
        type: DataTypes.ENUM("small", "medium", "large"),
        allowNull: false,
      },

      totalHabitants: {
        type: DataTypes.INTEGER,
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

      commet: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    },
    {
      timestamps: false,
    }
  );
};
