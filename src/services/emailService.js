const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = async (user) => {
  const msg = {
    to: user.email,
    from: 'cinthyasem@gmail.com',
    templateId: 'd-0046d074e98948bf9d7b22ddda836e44',
    dynamic_template_data: { fullName: user.fullName },
  };

  try {
    await sgMail.send(msg);
    console.log('Correo de bienvenida enviado exitosamente');
  } catch (emailError) {
    console.error('Error al enviar el correo de bienvenida:', emailError.message);
    throw new Error('Error al enviar el correo de bienvenida');
  }
};




const requestNotification = async (user, requestId, petName) => {
  const msg = {
    to: user.email,
    from: 'cinthyasem@gmail.com',
    templateId: 'd-5ae758b6dd5942aa8166ded66e7243df',
    dynamic_template_data: { 
      fullName: user.fullName,
      requestId: requestId,
      petName: petName || 'una mascota',
    },
  };

  try {
    await sgMail.send(msg);
    console.log('Correo de notificación de solicitud de adopción enviado exitosamente');
  } catch (emailError) {
    console.error('Error al enviar el correo de notificación de solicitud de adopción:', emailError.message);
    throw new Error('Error al enviar el correo de notificación de solicitud de adopción');
  }
};



const updateRequestStatus = async (email, fullName, status, comment) => {
  // Determinar el template ID basado en el estado de la solicitud
  let templateId;

  if (status === 'aprobada') {
    templateId = 'd-680f0beefdb34a068b6cd10111bfc0e1'; // Template para solicitudes aprobadas
  } else if (status === 'rechazada') {
    templateId = 'd-a627021843484c7e9409aa939942a57c'; // Template para solicitudes no aprobadas
  }

  const msg = {
    to: email,
    from: 'cinthyasem@gmail.com',
    templateId: templateId, // Usar el template dinámicamente
    dynamic_template_data: {
      fullName: fullName,
      status: status,
      comment: comment || 'Sin comentarios adicionales',
    },
  };

  try {
    await sgMail.send(msg);
    console.log('Correo de actualización de estado enviado exitosamente');
  } catch (error) {
    console.error('Error al enviar el correo de actualización de estado:', error.message);
    throw new Error('Error al enviar el correo de actualización de estado');
  }
};




module.exports = {
  sendWelcomeEmail, requestNotification, updateRequestStatus
};
