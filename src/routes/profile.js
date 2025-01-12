const express = require('express');
const router = express.Router();

const {handleGetProfile} = require('../controllers/profile')
router.get("/", handleGetProfile);

module.exports = router;