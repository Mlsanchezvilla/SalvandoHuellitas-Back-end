require('dotenv').config();
const express = require("express");
const router = require("./routes");
const morgan = require("morgan");
const cors = require("cors");
//const session = require("express-session");
const passport = require("passport");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 
const jwt = require('jsonwebtoken'); 



const createPet = require("./controllers/createPet");
const listPet = require("./controllers/listPet");
const getPet = require("./controllers/getPet");
const createReview = require("./controllers/createReview");
const listRequest = require("./controllers/listRequest");
const listReview = require("./controllers/listReview");
const { createUser } = require("./controllers/createUser");
const { createPetCloudinary } = require("./controllers/createPetCloudinary");

const server = express();

server.use(morgan("dev"));
server.use(cors());
server.use(express.json());
server.use(bodyParser.json({ limit: '10mb' }));
server.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
//server.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
server.use(cookieParser()); // middleware para manejar cookies
server.use(passport.initialize());
//server.use(passport.session());

server.use(router);



// Ruta de callback de Google donde se maneja la respuesta y se establece la cookie
server.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), (req, res) => {
    // En este punto, el usuario ha sido autenticado y el accessToken está disponible en req.authInfo
    const accessToken = req.authInfo.accessToken;
    

    // Guardar el accessToken en una cookie segura
    res.cookie('access_token', accessToken, {
        httpOnly: true, // Evita que la cookie sea accesible desde JavaScript
        secure: true,   // Asegura que la cookie solo se envíe a través de HTTPS
        sameSite: 'Strict', // Previene el envío de la cookie en solicitudes de origen cruzado
        maxAge: 3600000
    });

    res.redirect('/'); // Redirige a la página principal o a donde desees
});

server.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] })); 

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
      return res.status(401).json({ message: 'Access denied, token missing!' });
  }

  try {
      const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = verified;
      next();
  } catch (error) {
      res.status(403).json({ message: 'Invalid token!' });
  }
};



// Use the authentication middleware on protected routes
server.use('/api', authenticateToken, router); 


server.post('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.json({ message: 'Logout successful' });
});

// Crear una nueva mascota
server.post("/pets/", async (req, res) => {
    try {
        const newPet = await createPet(req.body);
        res.status(200).json(newPet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar mascotas según filtros o consultas de búsqueda
server.get("/pets/", async (req, res) => {
    try {
        const petList = await listPet(req.query);
        res.status(200).json(petList);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//* gets a pet by its id
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
server.post("/users/", createUser)

// Crear reseña
server.post("/reviews/", async (req, res) => {
    try {
        const newReview = await createReview(req.body);
        res.status(200).json(newReview);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar reseñas
server.get("/reviews/", async (req, res) => {
    try {
        const reviewList = await listReview(req.query);
        res.status(200).json(reviewList);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar solicitudes
server.get("/requests/", async (req, res) => {
    try {
        const requestList = await listRequest(req.query);
        res.status(200).json(requestList);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});




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
