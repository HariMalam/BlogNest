const express = require('express');
const router = express.Router();

const {handleGetHome, handleGetBlog} = require('../controllers/home')

router.get("/", handleGetHome);
router.get("/blog/:id/:slug", handleGetBlog);

module.exports = router;