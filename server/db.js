const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'pawfect';

let db;

async function connectDB() {
    if (db) return db;
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
    return db;
}

function getDB() {
    if (!db) throw new Error('Database not initialized. Call connectDB first.');
    return db;
}

module.exports = { connectDB, getDB };