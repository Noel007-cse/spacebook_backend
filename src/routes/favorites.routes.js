const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, deleteFavorite, isFavorite } = require('../controllers/favorites.controller'); 
const verifyToken = require('../middleware/auth.middleware');

router.get('/', verifyToken, getFavorites);
router.post('/', verifyToken, addFavorite);
router.delete('/:space_id', verifyToken, deleteFavorite);
router.get('/:space_id/isfavorite', verifyToken, isFavorite);

module.exports = router;