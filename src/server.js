const express = require("express");
const router = require("./routes");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");

require("dotenv").config();
const {
  listPets,
  getPet,
  createPet,
  changePetStatus,
} = require("./controllers/pets");
const {
  listRequest,
  createRequest,
  updateRequest,
} = require("./controllers/requests");
const {
  createUser,
  listUser,
  changeUserStatus,
} = require("./controllers/users");

require('dotenv').config();
const {listPets, getPet, createPet, changePetStatus, suggestPetsForUser} = require("./controllers/pets");
const {listRequest, createRequest, updateRequest} = require("./controllers/requests");
const { createUser, listUser, changeUserStatus } = require("./controllers/users");

const createReview = require("./controllers/createReview");
const reviewManagement = require("./controllers/reviewManagement");
const listReview = require("./controllers/listReview");

const { googleAuth, getJWT } = require("./controllers/auth");

const server = express(); //*creates server

server.use(morgan("dev"));

// Test if this can be deleted
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
//

server.use(router);

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

server.post("/api/mail", async (req, res) => {
  const { to, subject, text, html } = req.body;

  const msg = {
    to,
    from: "cinthyasem@gmail.com",
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
  } catch (err) {
    return res.status(err.code).send(err.message);
  }

  res.status(201).send({ success: true });
});

// Rutas principales
server.use("/api", router); // Asegúrate de usar el prefijo adecuado para tus rutas

// Auth
server.post("/auth/google/", googleAuth);
server.post("/auth/", getJWT);


server.get("/pets/", listPets);
server.get("/pets/:petId/", getPet);
server.patch("/pets/:petId/", changePetStatus);
server.post(
  "/pets/",
  upload.fields([
    { name: "photo", maxCount: 1 }, // Manejar un archivo con el campo 'image'
  ]),
  createPet
);
// Ruta para filtrar mascotas con base en el formulario de adopción
server.post("/pets/suggest", suggestPetsForUser);


//* User endpoints

server.post("/users/", upload.fields([

    { name: "idCard", maxCount: 1 }, // Manejar un archivo con el campo 'image'
  ]),
  createUser
);
server.get("/users/", listUser);
server.patch("/users/:userId/", changeUserStatus);

//* Requests

server.get("/requests/", listRequest);

// Ruta para actualizar una solicitud de adopción
server.patch("/requests/:id", updateRequest);

// Ruta para crear una nueva solicitud de adopción
server.post("/requests", createRequest);

// Reviews
server.post("/reviews/ ", createReview);

server.post("/reviews/", reviewManagement);

server.get("/reviews/", async (req, res) => {
  try {
    const reviewList = await listReview(req.query);
    res.status(200).json(reviewList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = server; //*exports server
