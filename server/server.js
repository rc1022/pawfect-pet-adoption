require('dotenv').config();
const { connectDB } = require('./db');
const app = require('./app');


const PORT = process.env.PORT || 4000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}`);
    });
});

