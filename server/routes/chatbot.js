const express = require('express');
const router = express.Router();
const { chatWithPet } = require('../controllers/chatbotController')

router.post('/', chatWithPet);

module.exports = router;