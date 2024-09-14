const { User } = require("../db");
const { getAuthUser } = require("../jwt");
const bcrypt = require("bcrypt");
const sgMail = require("../services/sendgrid");
const uploadImageStreamCloudinary = require("../config/uploadImageStreamCloudinary"); // Import SendGrid

const createUser = async (req, res) => {
  try {
    let isAdmin = false;

    const user = await getAuthUser(req)
    if(user?.isAdmin){
      isAdmin = true;
    }

    const {
      fullName,
      email,
      password,
      birthDate,
      phone,
      occupation,
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

    const file = req.files.idCard[0];
    const buffer = file.buffer;
    const result = await uploadImageStreamCloudinary(buffer)
    const newUser = await User.create({
      isAdmin,
      fullName,
      email,
      password: hashedPassword,
      birthDate,
      phone,
      idCard: result.secure_url,
      occupation,
    });

    const msg = {
      to: email,
      from: 'cinthyasem@gmail.com',
      templateId: 'd-0046d074e98948bf9d7b22ddda836e44',
      dynamic_template_data: {},
    };




    // Envía el correo electrónico
    try {
      // console.log('Enviando correo a:', email);
      await sgMail.send(msg);
    } catch (emailError) {
      console.error('Error al enviar el correo:', emailError.message);
      return res.status(500).json({
        message: "Usuario creado, pero ocurrió un error al enviar el correo",
        object: newUser,
        error: emailError.message
      });
    }


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



// Gets the user list with status filtering
const listUser = async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return res.status(403).json({ error: "Authentication required" });
    }
    if (!user.isAdmin) {
      return res.status(403).json({ error: "Only admins can perform this action listuser" });
    }

    let { page = 1, status, sort = 'fullName', order = 'ASC' } = req.query;  // Added sorting and order
    const itemsPerPage = 10;
    page = parseInt(page);

    let whereClause = {};

    // Handle filtering by active/inactive status
    if (status === 'active') {
      whereClause.isActive = true;
    } else if (status === 'inactive') {
      whereClause.isActive = false;
    }

    // Fetch users with filtering, sorting, and pagination
    let usersCount = await User.findAndCountAll({
      where: whereClause,
      limit: itemsPerPage,
      offset: itemsPerPage * (page - 1),
      order: [[sort, order]]  // Apply sorting here
    });

    const totalPages = Math.ceil(usersCount.count / itemsPerPage);

    res.status(200).json({
      page: page,
      totalPages: totalPages,
      results: usersCount.rows,
    });
  } catch (error) {
    console.error('Error getting the user list:', error.message);  // Log the actual error for debugging
    res.status(500).json({ message: "Error getting the user list", error: error.message });
  }
};


//Changes the status of a user
const changeUserStatus = async (req, res) => {
  try {
    const user = await getAuthUser(req)
    if(!user){return res.status(403).json({ error: "Authentication required" })}
    if(!user.isAdmin){return res.status(403).json({ error: "Only admins can perform this action change status user" })}

    const { isActive } = req.body;
    const { userId } = req.params;

    let userToChange = await User.findByPk(userId);
    userToChange.isActive = isActive;
    await userToChange.save();
    res.status(200).json({ message: `Se cambio el status a ${isActive}`});
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};



// Controller to get a user by ID
const getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const userFound = await User.findByPk(userId);
    if (!userFound) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(userFound);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to update user profile
const updateUserProfile = async (req, res) => {
  try {
    const authUser = await getAuthUser(req); // Fetch the authenticated user from JWT
    if (!authUser) {
      return res.status(403).json({ error: "Authentication required" });
    }

    // You do not need to check `req.params.userId` here, as this route is for the authenticated user
    const { fullName, email, birthDate, phone, occupation } = req.body;
    let updatedFields = { fullName, email, birthDate, phone, occupation };

    // If the user has uploaded a new idCard, handle the file upload
    if (req.files && req.files.idCard) {
      const file = req.files.idCard[0];
    
      if (!file || !file.buffer) {
        return res.status(400).json({ error: "No file buffer found" });
      }
    
      const buffer = file.buffer;
    
      try {
        const result = await uploadImageStreamCloudinary(buffer);  // Ensure this function is working
        updatedFields.idCard = result.secure_url;
      } catch (uploadError) {
        return res.status(500).json({ message: "Error uploading image", error: uploadError.message });
      }
    }
    

    // Find the user by their ID (which we get from the JWT token)
    const userToUpdate = await User.findByPk(authUser.id);
    if (!userToUpdate) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's profile with the new data
    await userToUpdate.update(updatedFields);
    return res.status(200).json({ message: "User profile updated successfully", object: userToUpdate });
  } catch (error) {
    return res.status(500).json({ message: "Error updating user profile", error: error.message });
  }
}

module.exports = {
  createUser,
  listUser,
  changeUserStatus,
  getUser,
  updateUserProfile,
};