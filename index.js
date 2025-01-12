// core modules
const cookieParser = require('cookie-parser');
const express = require('express');
const dotenv = require('dotenv');

// config files
const connectToMongoDB = require('./src/config/db.js');
const setupSession = require('./src/config/session.js');
const setupPassport = require('./src/config/passport.js');

// middlewares files
const { preventCache } = require('./src/middlewares/cacheControl.js');
const { restrictToLoggedinUserOnly, adminOnly } = require('./src/middlewares/authMiddleware.js')

// routes files
const googleRoutes = require('./src/routes/google.js');
const authRoutes = require('./src/routes/auth.js');
const homeRoutes = require('./src/routes/home.js');
const profileRoutes = require('./src/routes/profile.js');
const adminPanelRoutes = require('./src/routes/admin.js')

dotenv.config();
const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;
const app = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

connectToMongoDB(uri);
setupSession(app);
setupPassport(app);
app.use(preventCache);

app.use('/auth', authRoutes);
app.use('/auth/google', googleRoutes);

app.use(restrictToLoggedinUserOnly)
app.use('/', homeRoutes);
app.use('/profile', profileRoutes);
app.use('/admin',adminOnly, adminPanelRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});