const express = require('express');
const router = express.Router();
const { getAllPets } = require('../controllers/petsController');

router.get('/', getAllPets);

module.exports = router;