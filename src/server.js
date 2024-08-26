const express = require("express");
const router = require("./routes");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");

// Importar controladores y rutas
const createPet = require("./controllers/createPet");
const listPet = require("./controllers/listPet");
const getPet = require("./controllers/getPet");
const createReview = require("./controllers/createReview");
const listRequest = require("./controllers/listRequest");
const listReview = require("./controllers/listReview");
const getJWT = require("./controllers/getJWT");
const { createUser } = require("./controllers/createUser");

const server = express(); //*creates server

const { findOrCreateUser } = require("./controllers/createUser");
const { createPetCloudinary } = require("./controllers/createPetCloudinary");
// Configuración de estrategias de autenticación
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
//const { Strategy: FacebookStrategy } = require("passport-facebook");

server.use(morgan("dev"));
server.use(cors());
server.use(express.json());
server.use(bodyParser.json({ limit: "10mb" }));
server.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
server.use(
  session({ secret: "your_secret_key", resave: false, saveUninitialized: true })
);
server.use(passport.initialize());
server.use(passport.session());

server.use(router);

// Serialización y deserialización de usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findOrCreateUser({ id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Configuración de estrategias de Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: "GOOGLE_CLIENT_ID",
      clientSecret: "GOOGLE_CLIENT_SECRET",
      callbackURL: "/auth/google",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUser({
          googleId: profile.id,
          fullName: profile.displayName,
          email: profile.emails[0].value,
        });
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// passport.use(new FacebookStrategy({
//     clientID: "YOUR_FACEBOOK_CLIENT_ID",
//     clientSecret: "YOUR_FACEBOOK_CLIENT_SECRET",
//     callbackURL: "/auth/facebook/callback",
//     profileFields: ["id", "displayName", "emails"]
// }, async (accessToken, refreshToken, profile, done) => {
//     try {
//         const user = await findOrCreateUser({ facebookId: profile.id, fullName: profile.displayName, email: profile.emails[0].value });
//         return done(null, user);
//     } catch (err) {
//         return done(err, null);
//     }
// }));

// Rutas de autenticación
server.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
server.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/"); // Redirige a la página principal o a donde desees
  }
);

// server.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));
// server.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
//     res.redirect("/"); // Redirige a la página principal o a donde desees
// });

// Rutas principales
server.use("/api", router); // Asegúrate de usar el prefijo adecuado para tus rutas

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

//* create review

//*create user
server.post("/users/", createUser);

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

  server.get("/auth/google"),
    async (req, res) => {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const offset = (page - 1) * limit;
    };
});

//user authentication with email and password
server.post("/auth/", getJWT);

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
