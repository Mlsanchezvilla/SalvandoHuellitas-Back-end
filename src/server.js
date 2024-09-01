const express = require("express");
const router = require("./routes");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
require('dotenv').config();
const {listPets, getPet, createPet, deletePet} = require("./controllers/pets");
const {listRequest, /*createRequest, updateRequest*/} = require("./controllers/requests");
const { createUser } = require("./controllers/users");
const createReview = require("./controllers/createReview");
const listReview = require("./controllers/listReview");
const sgMail = require('./services/sendgrid')
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



server.use(express.json());

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

server.post('/api/mail', async(req, res) => {
  const { to, subject, text, html} = req.body;

  const msg = {
    to,
    from: 'cinthyasem@gmail.com',
    subject,
    text,
    html,
    
  };

  try{
    await sgMail.send(msg);
  }catch(err){
   return res.status(err.code).send(err.message);
  }

  res.status(201).send({ success: true });
});


// Rutas principales
server.use("/api", router); // Asegúrate de usar el prefijo adecuado para tus rutas



// Auth
server.post("/auth/google/", googleAuth);
server.post("/auth/", getJWT);



// Pets endpoints
server.get("/pets/", listPets);
server.get("/pets/:petId/", getPet);
server.delete("/pets/:petId/", deletePet);
server.post(
  "/pets/", upload.fields([
    { name: "photo", maxCount: 1 }, // Manejar un archivo con el campo 'image'
  ]),
  createPet
);


server.post("/users/", createUser);



// Requests
server.get("/requests/", listRequest);
// server.patch("/requests/", updateRequest);



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
})


module.exports = server; //*exports server
