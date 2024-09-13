const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Review",
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

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      score: {
        type: DataTypes.ENUM("1", "2", "3", "4", "5"),
        allowNull: false,
      },

      comment: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
    }
  );
};
