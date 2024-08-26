const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User'); 

passport.use(new GoogleStrategy({
    clientID: 'GOOGLE_CLIENT_ID',
    clientSecret: 'GOOGLE_CLIENT_SECRET',
    callbackURL: 'http://localhost:3000/home'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOrCreate({ googleId: profile.id });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

passport.use(new FacebookStrategy({
    clientID: 'YOUR_FACEBOOK_APP_ID',  // Reemplaza con tu Facebook App ID
    clientSecret: 'YOUR_FACEBOOK_APP_SECRET',  // Reemplaza con tu Facebook App Secret
    callbackURL: '/auth/facebook/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOrCreate({ facebookId: profile.id });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

module.exports = passport;
