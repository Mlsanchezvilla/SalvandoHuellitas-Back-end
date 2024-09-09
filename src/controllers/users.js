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



//gets the user list
const listUser = async (req, res) => {
  try {
    const user = await getAuthUser(req)
    if(!user){return res.status(403).json({ error: "Authentication required" })}
    if(!user.isAdmin){return res.status(403).json({ error: "Only admins can perform this action" })}

    let query = req.query;
    let page;
    if(query.page) {
      page = query.page;
    } else {
      page = 1;
    }

    const itemsPerPage = 10
    page = parseInt(page);
    let usersCount = await User.findAndCountAll({
      limit: itemsPerPage,
      offset: itemsPerPage * (page-1)
    });

    res.status(200).json({
      page: page,
      totalPages: Math.ceil(usersCount / itemsPerPage),
      results: usersCount.rows
    });
  } catch (error) {
    res.status(500)
      .json({ message: "Error getting the user list", error: error.message });
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


module.exports = {
  createUser,
  listUser,
  changeUserStatus
};
