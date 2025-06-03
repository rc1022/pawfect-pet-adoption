require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');

const app = express();
app.use(cors());
// app.use(helmet());
app.use(express.json());




//  Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: { error: 'Too many requests, please try again later.' }
// });
// app.use(limiter);

app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/users'));
app.use('/pets', require('./routes/pets'));
app.use('/chat', require('./routes/chatbot'));

module.exports = app;
