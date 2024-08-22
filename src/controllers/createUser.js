const User = require('../models/User'); 
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
  try {
    
    const { fullName, email, password, age, phone, idCard, occupation, adoptions } = req.body;

    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      age,
      phone,
      idCard,
      occupation,
      adoptions
    });

    res.status(201).json({ 
      message: 'Usuario creado exitosamente',
      user: newUser 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
  }
};

module.exports = {
  createUser
};