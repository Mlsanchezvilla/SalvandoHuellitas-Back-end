const { Op } = require('sequelize');
const {Pet} = require("../db");
const { getAuthUser } = require("../jwt");
const uploadImageStreamCloudinary = require("../config/uploadImageStreamCloudinary");


const listPets = async (req, res) => {
  try {
    let {search, page, species, age, size, energyLevel, okWithPets, okWithKids, gender} = req.query;

    // rebuild query with variables to filter
    let query = {status: "available", species, age, size, energyLevel, okWithPets, okWithKids, gender}

    // checks for undefined or null query params and removes them from query
    for (let queryKey in query) {
        if (!query[queryKey]){
            delete query[queryKey]
        }
    }

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

    let petsCount = await Pet.findAndCountAll({
        where: query,
        limit: itemsPerPage,
        offset: itemsPerPage * (page-1),
    });

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
    const petFound = await Pet.findByPk(petId);
    res.status(200).json(petFound);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}



const createPet = async (req, res) => {
  try {
    const file = req.files.photo[0];
    const buffer = file.buffer;
    const result = await uploadImageStreamCloudinary(buffer)
    const newPet = await Pet.create({
          name: req.body.name,
          photo: result.secure_url,
          status: req.body.status,
          species: req.body.species,
          age: req.body.age,
          size: req.body.size,
          gender: req.body.gender,
          breed: req.body.breed,
          energyLevel: req.body.energyLevel,
          okWithPets: req.body.okWithPets,
          okWithKids: req.body.okWithKids,
          history: req.body.history,
        });
    res.status(201).json({
      message: "Mascota creada exitosamente",
      data: newPet,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la mascota", error: error.message });
  }
};



const changePetStatus = async (req, res) => {
  try {
    const user = await getAuthUser(req)
    if(!user){return res.status(403).json({ error: "Authentication required" })}
    console.log(user)
    if(!user.isAdmin){return res.status(403).json({ error: "Only admins can perform this action" })}

    const { petId } = req.params;
    const { status } = req.body;

    let pet = await Pet.findByPk(petId);
    pet.status = status;
    await pet.save();
    res.status(200).json({ message: `Se cambio el status a ${status}`});
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

module.exports = {listPets, getPet, createPet, changePetStatus}