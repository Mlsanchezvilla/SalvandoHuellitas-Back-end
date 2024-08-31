const express = require("express");
const router = require("./routes");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const {listPets, getPet, createPet} = require("./controllers/pets");
const createReview = require("./controllers/createReview");
const listRequest = require("./controllers/listRequest");
const listReview = require("./controllers/listReview");
const getJWT = require("./controllers/getJWT");
const { createUser } = require("./controllers/users");
const { googleAuth } = require("./controllers/auth");

const server = express(); //*creates server



server.use(morgan("dev"));
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
server.use(cors());
server.use(express.json());
server.use(bodyParser.json({ limit: "10mb" }));
server.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
server.use(
  session({ secret: "your_secret_key", resave: false, saveUninitialized: true })
);


server.use(router);


const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Rutas principales
server.use("/api", router); // Asegúrate de usar el prefijo adecuado para tus rutas


// Auth
server.post("/auth/google/", googleAuth);
server.post("/auth/", getJWT);


// Pets endpoints
server.get("/pets/", listPets);
server.get("/pets/:petId/", getPet);
server.post(
  "/pets/", upload.fields([
    { name: "photo", maxCount: 1 }, // Manejar un archivo con el campo 'image'
  ]),
  createPet
);

// Users
server.post("/users/", createUser);

// Reviews
server.post("/reviews/", async (req, res) => {
  try {
    const newReview = await createReview(req.body);
    res.status(200).json(newReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

server.get("/reviews/", async (req, res) => {
  try {
    const reviewList = await listReview(req.query);
    res.status(200).json(reviewList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Requests
server.get("/requests/", async (req, res) => {
  try {
    const requestList = await listRequest(req.query);
    res.status(200).json(requestList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = server; //*exports server
