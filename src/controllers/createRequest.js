
const { Request } = require('../models/Request');

const createRequest = async (requestData) => {
  try {
    console.log("Datos recibidos:", requestData);
    const newRequest = await Request.create(requestData);
    return newRequest;
  } catch (error) {
    //console.error("Error888 al intentar crear la solicitud:", error); 
    throw new Error('Error al crear la solicitud: ' + error.message);
  }
};

module.exports = createRequest;
