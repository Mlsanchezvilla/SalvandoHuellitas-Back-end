const axios = require("axios");
const { User } =  require("../db");
const { createJWT } = require("../jwt");
const bcrypt = require("bcrypt");
const sgMail = require('@sendgrid/mail');

// Configurar SendGrid
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const getJWT = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: "No existe el usuario" });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ error: "Contraseña Incorrecta" });
        }

        const token = createJWT(user);
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        const response = await axios.get(
            'https://www.googleapis.com/oauth2/v1/userinfo',
            {
                params: { access_token: token }
            }
        );

        const googleData = response.data;
        console.log(googleData); 
        let user = await User.findOne({ where: { googleId: googleData.id } });

        // Si no se encuentra por googleId, buscar por correo
        if (!user) {
            user = await User.findOne({ where: { email: googleData.email } });
        }

        // Si el usuario no existe, crearlo
        if (!user) {
            user = await User.create({
                email: googleData.email,
                googleId: googleData.id,
                fullName: googleData.name,
            });

            // Enviar correo de bienvenida al nuevo usuario
            const msg = {
                to: user.email,
                from: 'cinthyasem@gmail.com',
                templateId: 'd-0046d074e98948bf9d7b22ddda836e44',
                dynamic_template_data: { fullName: user.fullName }
            };

            try {
                await sgMail.send(msg);
                console.log('Correo de bienvenida enviado exitosamente');
            } catch (emailError) {
                console.error('Error al enviar el correo de bienvenida:', emailError.message);
                return res.status(500).json({
                    message: "Usuario creado, pero ocurrió un error al enviar el correo de bienvenida",
                    object: user,
                    error: emailError.message
                });
            }
        }

        const jwt = createJWT(user);
        res.status(200).json({ token: jwt, user});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { googleAuth, getJWT };
