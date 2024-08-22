const express = require("express"); //*imports server package
const router = require("./routes");
const morgan = require("morgan");
const cors = require("cors");

const createPet = require("./controllers/createPet");

const server = express(); //*creates server



server.use(morgan("dev"));
server.use(express.json());
server.use(cors());

server.use(router);



//* create pet
server.post("/pet/", async (req, res) => {
    try {
        const newPet = await createPet(req.body)
        res.status(200).json(newPet);
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
});






module.exports = server; //*exports server