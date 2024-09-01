const { User } = require("../db");
const { getAuthUser } = require("../jwt");
const bcrypt = require("bcrypt");
const sgMail = require("../services/sendgrid"); // Import SendGrid

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
      idCard,
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

    const newUser = await User.create({
      isAdmin,
      fullName,
      email,
      password: hashedPassword,
      birthDate,
      phone,
      idCard,
      occupation,
    });

    
    const msg = {
      to:email,
      from: 'cinthyasem@gmail.com',
      subject: '¡Registro Completo!',
      text: `Hola ${fullName}, tu registro se ha completado exitosamente.`,
      html: `<strong>Hola ${fullName},</strong><br><br>Tu registro se ha completado exitosamente. ¡Gracias por Salvar más huellitas!`,
      
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

module.exports = {
  createUser
};
