
const { Request } = require('../models/Request');

const createRequest = async (requestData) => {
  try {
    const newRequest = await Request.create(requestData);
    return newRequest;
  } catch (error) {
    throw new Error('Error al crear la solicitud: ' + error.message);
  }
};

module.exports = {
  createRequest,
};
