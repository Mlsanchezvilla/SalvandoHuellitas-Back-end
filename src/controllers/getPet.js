const { Pet } = require("../db");

//* used by detail view

const getPet = async (petId) => {

    //* executes query searching pet by id
    const pet = await Pet.findByPk(petId);
    return pet;
};

module.exports = getPet;