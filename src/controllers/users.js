const { User } = require("../db");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      birthDate,
      phone,
      idCard,
      occupation,
      adoptions,
    } = req.body;

    const existingUser = await User.findOne({
      where: { email: email },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está en uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      birthDate,
      phone,
      idCard,
      occupation,
      adoptions,
    });

    res.status(201).json({
      message: "Usuario creado exitosamente",
      object: newUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el usuario", error: error.message });
  }
};

module.exports = {
  createUser
};
