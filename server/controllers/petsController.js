const { getDB } = require('../db');


exports.getAllPets = async(req, res) => {
    try {
        const db = getDB();
        // Build filter from query params (e.g., ?category=cats)
        const filter = { ...req.query };
        // If category provided, ensure it's a string (MongoDB is type-sensitive)
        if (filter.category) {
            filter.category = String(filter.category);
        }
        const pets = await db.collection('pets').find(filter).toArray();
        res.json(pets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};