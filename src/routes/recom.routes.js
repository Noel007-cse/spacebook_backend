const express = require('express');
const router = express.Router();
const {
    getRecom
} = require('../controllers/recom.controller');
const verifyToken = require('../middleware/auth.middleware');

router.get('/',  verifyToken, getRecom);

module.exports = router;