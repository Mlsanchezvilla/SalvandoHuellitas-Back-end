const jwt = require("jsonwebtoken");


function createJWT (user){
    return jwt.sign({
        userID: user.id,
        name: user.fullName,
        isAdmin: user.isAdmin,
    }, "secret-key") //ToDo change secret key and move to .env
}

module.exports = createJWT;