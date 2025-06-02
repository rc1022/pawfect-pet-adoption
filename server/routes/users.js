const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controllers/authController');
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/usersController');

router.use(authenticateToken);

router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);
router.delete('/favorites/:id', removeFavorite);

module.exports = router;