const { Pet } = require("../db");
const { Op } = require('sequelize');


const listPet = async () => {

    //* lists all existing pets
    let pets = await Pet.findAll();

    return pets;
};


module.exports = listPet;