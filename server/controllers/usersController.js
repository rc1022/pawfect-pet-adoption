const { getDB } = require('../db');
const { ObjectId } = require('mongodb');

exports.getFavorites = async ( req, res ) => {
    try {
        const db = getDB();
        const user = await db.collection('users').findOne( { _id: new ObjectId(req.user.userId ) })
        res.json({ favorites: user.favorites || [] });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
}
};

exports.addFavorite = async ( req, res ) => {
    try {
        const db = getDB();
        const { petId } = req.body;
        await db.collection('users').updateOne(
            { _id: new ObjectId(req.user.userId) },
            { $addToSet: {favorites: petId} }
        );
        res.json({ message: 'Added to favorites' });
    } catch(err) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.removeFavorite = async ( req, res ) => {
    try {
        const db = getDB();
        const petId = req.params.id;
        await db.collection('users').updateOne(
            { _id: new ObjectId(req.user.userId) },
            { $pull: { favorites: petId} }
        )
        res.json({ message: 'Removed from favorites' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}