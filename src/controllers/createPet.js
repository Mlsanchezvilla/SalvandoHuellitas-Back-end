const { Pet } = require("../db");


//* receives all info needed for the new pet
const createPet = async(data) => {

    //* creates a new instance of Pet
    const newPet = await Pet.create(data);

    return newPet;
};


module.exports = createPet;