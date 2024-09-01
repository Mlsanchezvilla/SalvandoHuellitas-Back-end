const axios = require("axios");
const { User } =  require("../db");
const {createJWT} = require("../jwt")
const bcrypt = require("bcrypt");


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

        let token = createJWT(user)

        res.status(200).json({token});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

 const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        const response = await axios.get(
            'https://www.googleapis.com/oauth2/v1/userinfo',
            {
                params:{
                    access_token: token,
                }
            }
        );
        let googleData = response.data;
        // Search by google Id
        let user = await User.findOne({
            where: {googleId: googleData.id}
        })
        if(!user){
            let user = await User.findOne({
                where: {email: googleData.email}
            })
        }
        if (!user){
            let user = await User.create({
                email: googleData.email,
                googleId: googleData.id,
                fullName: googleData.name,
            })
        }

        let jwt = createJWT(user)
        res.status(200).json({token: jwt});
    } catch (error){
        res.status(400).json({ error: error.message });
    }


}

module.exports = {googleAuth, getJWT};