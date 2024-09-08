const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  //* definines the model
  sequelize.define("Adoptions", {
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    petId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pending", // Otros posibles valores podrían ser 'Aprobada', 'Rechazada', etc.
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });
};
