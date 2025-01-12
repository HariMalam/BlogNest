const express = require('express');
const router = express.Router();
const passport = require('passport');

const { startGoogleAuth, googleAuthCallback, googleAuthFailed, googleAuthSuccess } = require('../controllers/google');

router.get('/', startGoogleAuth);
router.get('/callback', passport.authenticate('google', { failureRedirect: '/auth/google/failed' }), googleAuthCallback);
router.get('/failed', googleAuthFailed);
router.get('/success', googleAuthSuccess);

module.exports = router;