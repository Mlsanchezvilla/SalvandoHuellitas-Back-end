const express = require("express"); //*imports server package
const router = require("./routes");
const morgan = require("morgan");
const cors = require("cors");

const createPet = require("./controllers/createPet");
const listPet = require("./controllers/listPet");
const createRequest = require("./controllers/createRequest"); 
const listRequest = require("./controllers/listRequest");

const server = express(); //*creates server



server.use(morgan("dev"));
server.use(express.json());
server.use(cors());

server.use(router);



//* create pet
server.post("/pets/", async (req, res) => {
    try {
        const newPet = await createPet(req.body)
        res.status(200).json(newPet);
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
});

//* lists pets
server.get("/pets/", async (req, res) => {
    try {
        const petList = await listPet(req.query)
        res.status(200).json(petList);
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
})

//* create request
server.post("/requests/", async (req, res) => {
    try {
        const newRequest = await createRequest(req.body);
        res.status(200).json(newRequest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});





module.exports = server; //*exports server