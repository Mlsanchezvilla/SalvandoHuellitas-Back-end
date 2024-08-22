const { Request } = require("../db");



//* receives all info needed for the new Request
const createRequest = async (data) => {

    
  //* creates a new instance of Request
    const newRequest = await Request.create(data);
    
    return newRequest;
};


module.exports = createRequest;

