const axios = require("axios");
const { User } =  require("../db");
const {createJWT} = require("../jwt")
const bcrypt = require("bcrypt");
const sgMail = require('../services/sendgrid');

const getJWT = async (req, res) => {
    try {
        let {email, password} = req.body;

        const user = await User.findOne({
            where: {email: email}
        })
        if(user === null){
            return res.status(400).json({ error: "No existe el usuario" });
        }

        let validPassword = await bcrypt.compare(password, user.password)

        if(!validPassword){
            return res.status(400).json({ error: "Contraseña Incorrecta" });
        }

        let token = createJWT(user)

        res.status(200).json({token});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

 const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        const response = await axios.get(
            'https://www.googleapis.com/oauth2/v1/userinfo',
            {
                params:{
                    access_token: token,
                }
            }
        );
        let googleData = response.data;
        // Search by google Id
        let user = await User.findOne({
            where: {googleId: googleData.id}
        })

        let isNewUser = false;

        if (!user) {
            user = await User.findOne({
                where: { email: googleData.email }
            });
        }

        if (!user) {
           

            user = await User.create({
                email: googleData.email,
                googleId: googleData.id,
                fullName: googleData.name,
            });
            isNewUser = true;
        }

        // Configurar el mensaje de correo
        if (isNewUser) {
            console.log("Enviando correo de bienvenida");
        const msg = {
            to: user.email,
            from: 'cinthyasem@gmail.com', // Asegúrate de que este correo esté verificado en SendGrid
            templateId: 'd-0046d074e98948bf9d7b22ddda836e44', // Tu Template ID de SendGrid
            dynamic_template_data: { 
                fullName: user.fullName // Variable dinámica para el template
            },
        };

        // Enviar el correo
        try {
            await sgMail.send(msg);
            console.log('Correo de bienvenida enviado exitosamente');
        } catch (emailError) {
            console.error('Error al enviar el correo:', emailError.message);
            return res.status(500).json({
                message: isNewUser ? "Usuario creado, pero ocurrió un error al enviar el correo de bienvenida" : "Usuario autenticado, pero ocurrió un error al enviar el correo de notificación",
                object: user,
                error: emailError.message
            });
        }
    }
        let jwt = createJWT(user);
        res.status(200).json({ token: jwt });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {googleAuth, getJWT};

