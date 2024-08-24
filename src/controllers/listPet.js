const { Pet } = require("../db");
const { Op } = require('sequelize');


const listPet = async (queryParams) => {
    let {search, page, status, species, age, size, energyLevel, okWithPets, okWithKids} = queryParams;

    // rebuild query with variables to filter
    let query = {status, species, age, size, energyLevel, okWithPets, okWithKids}

    // Remove undefined values from query to avoid filter issues
    for (let queryKey in query) {
        if (!query[queryKey]){
            delete query[queryKey]
        }
    }

    // Pagination Variables
    page = parseInt(page);
    const itemsPerPage = 12;

    // If search is not undefined we should manage that value on query
    if (search){
        // Define a query where breed is iLike search term or name is iLike search term
        // (Check sequelize doc)
        query[Op.or] = [
            {breed: {[Op.iLike]:"%"+search+"%"}},
            {name: {[Op.iLike]:"%"+search+"%"}},
        ]
    }

    //* lists all existing pets
    let petsCount = await Pet.findAndCountAll({
        where: query,
        limit: itemsPerPage,
        offset: itemsPerPage * (page-1),
    });

    return {
        page: page,
        totalPages: Math.ceil(petsCount.count / itemsPerPage),
        results: petsCount.rows,
    };
};


module.exports = listPet;