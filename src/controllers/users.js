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

    console.log(result)
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
      console.log('Correo enviado exitosamente');
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
      return res.status(403).json({ error: "Only admins can perform this action" });
    }

    let { page = 1, status, sort = 'fullName', order = 'ASC' } = req.query;  // Added sorting and order
    const itemsPerPage = 10;
    page = parseInt(page);

    console.log('Status received from frontend:', status);  // Log the status filter received
    console.log('Page received from frontend:', page);  // Log the page number received
    console.log('Sort by:', sort, 'Order:', order);  // Log the sorting criteria

    let whereClause = {};

    // Handle filtering by active/inactive status
    if (status === 'active') {
      whereClause.isActive = true;
    } else if (status === 'inactive') {
      whereClause.isActive = false;
    }

    console.log('WhereClause to apply on DB query:', whereClause);  // Log the where clause

    // Fetch users with filtering, sorting, and pagination
    let usersCount = await User.findAndCountAll({
      where: whereClause,
      limit: itemsPerPage,
      offset: itemsPerPage * (page - 1),
      order: [[sort, order]]  // Apply sorting here
    });

    const totalPages = Math.ceil(usersCount.count / itemsPerPage);

    console.log('Total users found:', usersCount.count);  // Log total users found
    console.log('Total pages calculated:', totalPages);  // Log total pages calculated

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
    if(!user.isAdmin){return res.status(403).json({ error: "Only admins can perform this action" })}

    const { isActive } = req.body;
    const { userId } = req.params;

    let userToChange = await User.findByPk(userId);
    console.log(user.id);
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
    // Get the authenticated user from the token
    const authUser = await getAuthUser(req);

    if (!authUser) {
      console.log("No authenticated user found");
      return res.status(403).json({ error: "Authentication required" });
    }

    console.log("Authenticated user making the request:", authUser);

    // Log the entire request body for debugging
    console.log("Request body:", req.body);

    const userIdFromToken = authUser.id;

    // Ensure the user can only update their own profile
    if (userIdFromToken !== authUser.id) {
      console.log("User attempting to update a profile that is not their own");
      return res.status(403).json({ error: "You can only update your own profile" });
    }

    // Extract fields from the request body
    const { fullName, email, birthDate, phone, occupation } = req.body;

    console.log('Received update request data:', { fullName, email, birthDate, phone, occupation });

    // Prepare fields for update
    let updatedFields = { fullName, email, birthDate, phone, occupation };

    // If a new image is uploaded, handle the image upload
    if (req.files && req.files.idCard) {
      console.log('Uploading new idCard image...');
      const file = req.files.idCard[0];
      const buffer = file.buffer;
      const result = await uploadImageStreamCloudinary(buffer);
      updatedFields.idCard = result.secure_url; // Update idCard with the new image URL
    }

    // Find the user in the database
    const userToUpdate = await User.findByPk(authUser.id);
    if (!userToUpdate) {
      console.log("User not found in the database");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Updating user profile with data:", updatedFields);

    // Update the user with the new data
    await userToUpdate.update(updatedFields);
    console.log("User profile updated successfully");

    res.status(200).json({
      message: "User profile updated successfully",
      object: userToUpdate,
    });
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    res.status(500).json({ message: "Error updating user profile", error: error.message });
  }
};










module.exports = {
  createUser,
  listUser,
  changeUserStatus,
  getUser,
  updateUserProfile,
};