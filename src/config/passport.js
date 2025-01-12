const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const setupPassport = (app) => {
    const stretergy = {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true
    }

    const callback = (request, accessToken, refreshToken, profile, done) => {
        return done(null, profile)
    }
    
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

    const googleStrategy = new GoogleStrategy(stretergy, callback);
    passport.use(googleStrategy);
}

module.exports = setupPassport;