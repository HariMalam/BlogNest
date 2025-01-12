const session = require('express-session');
const generateSecretKey = require('../utils/generateSecretKey');

const setupSession = (app) => {
    const secretKey = generateSecretKey();
    app.use(session({
        secret: secretKey,
        resave: false,
        saveUninitialized: true,
        cookie: {
            expires: false,
        }
    }));
}

module.exports =  setupSession;