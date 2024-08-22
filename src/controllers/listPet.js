const { Pet } = require("../db");
const { Op } = require('sequelize');


const listPet = async (query) => {
    // Obtain search query parameter from query
    let search = query.search;
    // If search is not undefined we should manage that value on query
    if (search){
        // First remove the "search" key from the object
        delete query.search
        // Define a query where breed is iLike search term or name is iLike search term
        // (Check sequelize doc)
        query[Op.or] = [
            {breed: {[Op.iLike]:"%"+search+"%"}},
            {name: {[Op.iLike]:"%"+search+"%"}},
        ]
    }

    //* lists all existing pets
    let pets = await Pet.findAll({
        where: query
    });

    return pets;
};


module.exports = listPet;