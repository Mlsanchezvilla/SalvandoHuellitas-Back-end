const { Op } = require('sequelize');
const daoPet = require("../dao/pets")


const listPets = async (req, res) => {
  try {
    let {search, page, status, species, age, size, energyLevel, okWithPets, okWithKids, gender} = req.query;

    // rebuild query with variables to filter
    let query = {status, species, age, size, energyLevel, okWithPets, okWithKids, gender}

    // Pagination Variables
    const itemsPerPage = 12;
    page = parseInt(page);

    // If search is not undefined we should manage that value on query
    if (search){
        // Define a query where breed is iLike search term or name is iLike search term
        // (Check sequelize doc)
        query[Op.or] = [
            {breed: {[Op.iLike]:"%"+search+"%"}},
            {name: {[Op.iLike]:"%"+search+"%"}},
        ]
    }

    let petsCount = await daoPet.getPaginatedPets(
        query,
        itemsPerPage,
        itemsPerPage * (page-1)
    )

    res.status(200).json({
        page: page,
        totalPages: Math.ceil(petsCount.count / itemsPerPage),
        results: petsCount.rows,
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


const getPet = async (req, res) => {
  const { petId } = req.params;
  try {
    const petFound = await daoPet.getById(petId);
    res.status(200).json(petFound);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}


module.exports = {listPets, getPet}