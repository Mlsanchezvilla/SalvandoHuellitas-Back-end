const { User } =  require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const getJWT = async (req, res) => {
    try {
        let {email, password} = req.body;

        const user = await User.findOne({
            where: {email: email}
        })
        if(user === null){
            return res.status(400).json({ error: "No existe el usuario" });
        }

        let validPassword = await bcrypt.compare(password, user.password)

        if(!validPassword){
            return res.status(400).json({ error: "Contraseña Incorrecta" });
        }

        const token = jwt.sign({
            userID: user.id,
            isAdmin: user.isAdmin,
        }, "secret-key") //ToDo change secret key and move to .env

        res.status(200).json({token});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

module.exports = getJWT;