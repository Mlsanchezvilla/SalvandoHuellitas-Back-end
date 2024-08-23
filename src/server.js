const express = require("express"); //*imports server package
const router = require("./routes");
const morgan = require("morgan");
const cors = require("cors");

const createPet = require("./controllers/createPet");
const listPet = require("./controllers/listPet");
const createReview = require("./controllers/createReview");

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


//* create review
server.post("/reviews/", async (req, res) => {
    try {
        const newReview = await createReview(req.body);
        res.status(200).json(newReview);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//* lists reviews
server.get("/reviews/", async (req, res) => {
    try {
        const reviewList = await listReview(req.query);
        res.status(200).json(reviewList);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//* lists requests
router.get("/requests/", async (req, res) => {
    try {
        const requestList = await listRequest(req.query);
        res.status(200).json(requestList);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = server; //*exports server