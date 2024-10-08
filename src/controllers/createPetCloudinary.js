const uploadImageStreamCloudinary = require("../config/uploadImageStreamCloudinary");
const { Pet } = require("../db");

const createPetCloudinary = async (req, res) => {
  try {
    const file = req.files.image[0];
    const buffer = file.buffer;
    await uploadImageStreamCloudinary(buffer)
      .then((result) => {
        console.log(result.secure_url)
        const newPet =  Pet.create({
          name: req.body.name,
          photo: result.secure_url,
          status: req.body.status,
          species: "dog",
          age: "adult",
          size: "medium",
          breed: "bulldog",
          energyLevel: "medium",
          okWithPets: true,
          okWithKids: true,
          history: ""
        });
      })
      .catch((error) => {
        console.error('Error al subir la imagen a Cloudinary:', error);
      });
    res.status(201).json({
      message: "Mascota creada exitosamente",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la mascota", error: error.message });
  }
};

module.exports = {
  createPetCloudinary,
};
