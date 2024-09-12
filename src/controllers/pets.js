const { Op } = require('sequelize');
const {Pet} = require("../db");
const { getAuthUser } = require("../jwt");
const uploadImageStreamCloudinary = require("../config/uploadImageStreamCloudinary");


const listPets = async (req, res) => {
  try {
    let { status, search, page, species, age, size, energyLevel, okWithPets, okWithKids, gender, sort } = req.query;

    // Default sorting by status (available first, then inactive)
    let order = [['status', 'ASC'], ['name', 'ASC']];  // Sort first by status, then by name
    
    if (sort === 'name') {
      order = [['name', 'ASC']];  // If sorting by name
    }

    // Build query with variables to filter
    let query = { status, species, age, size, energyLevel, okWithPets, okWithKids, gender };

    // Remove undefined or empty fields from the query
    for (let queryKey in query) {
      if (!query[queryKey]) {
        delete query[queryKey];
      }
    }

    // Pagination Variables
    const itemsPerPage = 12;
    page = parseInt(page);

    // If search is provided, handle search criteria
    if (search) {
      query[Op.or] = [
        { breed: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Fetch pets with pagination and sorting
    const petsCount = await Pet.findAndCountAll({
      where: query,
      limit: itemsPerPage,
      offset: itemsPerPage * (page - 1),
      order: order,  // Apply the order for sorting
    });

    res.status(200).json({
      page: page,
      totalPages: Math.ceil(petsCount.count / itemsPerPage),
      results: petsCount.rows,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




const getPet = async (req, res) => {
  const { petId } = req.params;
  try {
    const petFound = await Pet.findByPk(petId);
    res.status(200).json(petFound);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};



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



//Changes the status of a pet
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
};

module.exports = {listPets, getPet, createPet, changePetStatus}