const axios = require("axios");
const { User } =  require("../db");
const createJWT = require("../jwt")


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

module.exports = {googleAuth};