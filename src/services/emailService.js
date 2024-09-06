const sgMail = require('./sendgrid'); // Importa tu configuración de SendGrid

// Función para enviar correos electrónicos con una plantilla dinámica
const sendWelcomeEmail = async (email, fullName) => {
  const msg = {
    to: email,
    from: 'cinthyasem@gmail.com', // Tu correo verificado en SendGrid
    templateId: 'd-0046d074e98948bf9d7b22ddda836e44', // Reemplaza con tu templateId
    dynamic_template_data: { fullName }, // Datos dinámicos para la plantilla
  };

  try {
    await sgMail.send(msg);
    console.log('Correo enviado exitosamente a:', email);
  } catch (error) {
    console.error('Error al enviar el correo a:', email, error.message);
    throw new Error('Error al enviar el correo electrónico');
  }
};

module.exports = { sendWelcomeEmail };
