const { DataTypes } = require("sequelize");

//* exports the function that defines the Pet model on the DB
module.exports = (sequelize) => {
  //* definines the model
  sequelize.define(
    "Pet",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      status: {
        type: DataTypes.ENUM("available", "adopted", "onHold", "inactive"),
        allowNull: false,
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      name: {
        type: DataTypes.STRING,
      },
      species: {
        type: DataTypes.ENUM("cat", "dog"),
        allowNull: false,
      },
      age: {
        type: DataTypes.ENUM("puppy", "young", "adult", "elder"),
        allowNull: false,
      },
      size: {
        type: DataTypes.ENUM("small", "medium", "large"),
        allowNull: false,
      },
      breed: {
        type: DataTypes.STRING,
      },
      energyLevel: {
        type: DataTypes.ENUM("low", "medium", "high"),
        allowNull: false,
      },
      okWithPets: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      okWithKids: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      history: {
        type: DataTypes.TEXT,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["female", "male"]],
        },
      },
    },
    {
      timestamps: false,
    }
  );
};
