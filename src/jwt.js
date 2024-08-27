const jwt = require("jsonwebtoken");


function createJWT (user){
    return jwt.sign({
        userID: user.id,
        isAdmin: user.isAdmin,
    }, "secret-key") //ToDo change secret key and move to .env
}

module.exports = createJWT;