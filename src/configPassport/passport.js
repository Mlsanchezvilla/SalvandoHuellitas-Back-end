const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); 
const jwt = require('jsonwebtoken'); // Asegúrate de requerir jsonwebtoken

passport.use(new GoogleStrategy({
    clientID: 'GOOGLE_CLIENT_ID',
    clientSecret: 'GOOGLE_CLIENT_SECRET',
    callbackURL: "http://localhost:3001/auth/google"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOrCreate({ googleId: profile.id });
        return done(null, user, { accessToken }); // Pasar accessToken como tercer argumento
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
