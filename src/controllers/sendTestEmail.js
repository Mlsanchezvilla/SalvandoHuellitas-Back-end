require('dotenv').config(); 
const sgMail = require('@sendgrid/mail');

console.log('SendGrid API Key:', process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendTestEmail = async () => {
    const msg = {
        to: 'cinthyasm_@hotmail.com',
        from: 'cinthyasem@gmail.com', // Asegúrate de que este correo esté verificado en SendGrid
        subject: 'Correo de Prueba',
        text: 'Este es un correo de prueba para verificar SendGrid.',
    };

    try {
        await sgMail.send(msg);
        console.log('Correo de prueba enviado exitosamente');
    } catch (error) {
        console.error('Error al enviar el correo de prueba:', error.message);
    }
};

// Llama a esta función para probar el envío de correos
sendTestEmail();


module.exports = sendTestEmail;