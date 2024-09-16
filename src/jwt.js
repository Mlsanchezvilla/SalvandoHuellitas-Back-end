require("dotenv").config(); //* imports the use of .env files
const { User } =  require("./db");
const jwt = require("jsonwebtoken");

// Receives an user generates a JWT
function createJWT (user){
    return jwt.sign({
        userID: user.id,
        name: user.fullName,
        isAdmin: user.isAdmin,
    }, process.env.JWT_SECRET_KEY)
}

// Receives a request (with a token in headers) returns a user
const getAuthUser = async (request) => {
    const authHeader = request.headers.authorization;
  
    if (!authHeader) {
      return null;
    }
  
    const [bearer, token] = authHeader.split(" ");

  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findByPk(decoded.userID);
      
      return user;
    } catch (error) {
      return null;  // Ensure the function returns null on failure
    }
  };
  

    // Use Example:
    // const user = getAuthUser(req)
    // if(!user){throw new Error("Authentication needed")}
    // if(user?.isAdmin){}

module.exports = {createJWT, getAuthUser};