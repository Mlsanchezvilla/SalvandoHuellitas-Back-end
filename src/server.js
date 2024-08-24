const express = require("express");
const router = require("./routes");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
//config de estretagias de auth de google y fb
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Strategy: FacebookStrategy } = require("passport-facebook");

const createPet = require("./controllers/createPet");
const listPet = require("./controllers/listPet");
const getPet = require("./controllers/getPet");
const createReview = require("./controllers/createReview");
const listRequest = require("./controllers/listRequest");
const listReview = require("./controllers/listReview");
const { createUser, findOrCreateUser } = require("./controllers/createUser");

const server = express();

server.use(morgan("dev"));
server.use(express.json());
server.use(cors());
server.use(session({ secret: "your_secret_key", resave: false, saveUninitialized: true }));
server.use(passport.initialize());
server.use(passport.session());

// Serializar y deserializar usuario
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

// Configurar Google Strategy
passport.use(new GoogleStrategy({
    clientID: "YOUR_GOOGLE_CLIENT_ID",
    clientSecret: "YOUR_GOOGLE_CLIENT_SECRET",
    callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await findOrCreateUser({ googleId: profile.id, fullName: profile.displayName, email: profile.emails[0].value });
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// Configurar Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: "YOUR_FACEBOOK_CLIENT_ID",
    clientSecret: "YOUR_FACEBOOK_CLIENT_SECRET",
    callbackURL: "/auth/facebook/callback",
    profileFields: ["id", "displayName", "emails"]
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await findOrCreateUser({ facebookId: profile.id, fullName: profile.displayName, email: profile.emails[0].value });
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// Rutas de autenticación
server.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

server.get("/auth/google/callback", 
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("/"); // Redirige a la página principal o a donde desees
    }
);

server.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));

server.get("/auth/facebook/callback", 
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("/"); // Redirige a la página principal o a donde desees
    }
);

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

// Obtener una mascota por su id
server.get('/pets/:idPet', async(req, res) => {
    const petId = req.params.idPet;
    try {
        const petFound = await getPet(petId);
        res.status(200).json(petFound);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Crear usuario
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
router.get("/requests/", async (req, res) => {
    try {
        const requestList = await listRequest(req.query);
        res.status(200).json(requestList);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = server;
