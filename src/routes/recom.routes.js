const express = require('express');
const router = express.Router();
const {getRecom, addRecom} = require('../controllers/recom.controller');
const verifyToken = require('../middleware/auth.middleware');

router.get('/',  verifyToken, getRecom);
router.post('/',  verifyToken, addRecom);

module.exports = router;