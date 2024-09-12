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
        console.log("No authorization header found");
        return null;
    }

    const [bearer, token] = authHeader.split(" ");
    console.log("Token received in header:", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("Decoded JWT:", decoded); // Log the decoded JWT

        const user = await User.findByPk(decoded.userID);
        console.log("User found from token:", user); // Log the retrieved user

        return user;
    } catch (error) {
        console.error("Error verifying JWT:", error.message);
        throw new Error("Invalid JWT");
    }
};

    // Use Example:
    // const user = getAuthUser(req)
    // if(!user){throw new Error("Authentication needed")}
    // if(user?.isAdmin){}

module.exports = {createJWT, getAuthUser};