const express = require('express');
const router = express.Router();

const {handleGetLogin, handleGetLogout} = require('../controllers/auth');

router.get("/login", handleGetLogin);
router.get("/logout", handleGetLogout);

module.exports = router;