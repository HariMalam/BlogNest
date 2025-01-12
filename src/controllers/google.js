const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Handler function to start Google authentication
const startGoogleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// Handler function for Google callback after authentication
const googleAuthCallback = (req, res) => {
    res.redirect('/auth/google/success');
};

// Handler function for failed Google authentication
const googleAuthFailed = (req, res) => {
    res.send('You failed to login with Google');
};

// Handler function for successful Google authentication
const googleAuthSuccess = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }

    let user = await User.findOne({ id: req.user.id });

    if (!user) {
        const data = {
            id: req.user.id,
            displayName: req.user.displayName,
            name: {
                familyName: req.user.name.familyName,
                givenName: req.user.name.givenName,
            },
            email: req.user.emails[0].value,
            photo: req.user.photos[0].value,
        };
        const newUser = new User(data);
        try {
            user = await newUser.save();
        } catch (error) {
            console.error('Error saving user to database:', error);
            return res.status(500).send('Something went wrong!');
        }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie('jwt', token, { httpOnly: true, secure: true });
    res.redirect('/');
};

module.exports = {
    startGoogleAuth,
    googleAuthCallback,
    googleAuthFailed,
    googleAuthSuccess,
};