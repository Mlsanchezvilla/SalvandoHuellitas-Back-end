const express = require("express"); //*imports server package
const router = require("./routes");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

const createPet = require("./controllers/createPet");
const listPet = require("./controllers/listPet");
const getPet = require("./controllers/getPet");
const createReview = require("./controllers/createReview");
const listRequest = require("./controllers/listRequest");
const listReview = require("./controllers/listReview");
const { createUser } = require("./controllers/createUser");
const { createPetCloudinary } = require("./controllers/createPetCloudinary");

const server = express(); //*creates server

server.use(morgan("dev"));
server.use(express.json());
server.use(cors());
server.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
server.use(bodyParser.json({ limit: "10mb" }));

server.use(router);

// TODO: Refactor this to be more DRY
//* creates a new pet
server.post("/pets/", async (req, res) => {
  try {
    const newPet = await createPet(req.body);
    res.status(200).json(newPet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//* lists pets according to filters or search queries
server.get("/pets/", async (req, res) => {
  try {
    const petList = await listPet(req.query);
    res.status(200).json(petList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//* gets a pet by it's id
server.get("/pets/:idPet", async (req, res) => {
  const petId = req.params.idPet;
  try {
    const petFound = await getPet(petId);
    res.status(200).json(petFound);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

//* gets a pet by it's id
server.get("/pets/:idPet", async (req, res) => {
  const petId = req.params.idPet;
  try {
    const petFound = await getPet(petId);
    res.status(200).json(petFound);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

//*create user
server.post("/users/", createUser);

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

//*create user
server.post("/users/", createUser);

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

server.post(
  "/petcloud/",
  upload.fields([
    { name: "image", maxCount: 1 }, // Manejar un archivo con el campo 'image'
  ]),
  createPetCloudinary
);

module.exports = server; //*exports server
