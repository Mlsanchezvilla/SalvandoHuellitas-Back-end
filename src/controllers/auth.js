const passport = require('passport');

const googleAuth = passport.authenticate('google', { scope: ['profile'] });

const googleAuthCallback = passport.authenticate('google', { failureRedirect: '/' }, (req, res) => {
    res.redirect('/');
});

const facebookAuth = passport.authenticate('facebook');

const facebookAuthCallback = passport.authenticate('facebook', { failureRedirect: '/' }, (req, res) => {
    res.redirect('/');
});

module.exports = {
    googleAuth,
    googleAuthCallback,
    facebookAuth,
    facebookAuthCallback
};
