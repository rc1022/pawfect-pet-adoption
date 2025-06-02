const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../db');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

exports.register = async ( req, res ) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

        const db = getDB();
        const existing = await db.collection('users').findOne({ email });
        if (existing) return res.status(400).json({ error: 'Email already registered.' });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = {
            email,
            passwordHash,
            favorites: [],
            createdAt: new Date(),
            lastLogin: null
        };
        await db.collection('users').insertOne(user);

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

exports.login = async ( req, res ) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

        const db = getDB();
        const user = await db.collection('users').findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid email or password.' });

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(400).json({ error: 'Invalid email or password.' });

        // Update lastLogin
        await db.collection('users').updateOne(
            { _id: user._id },
            { $set: { lastLogin: new Date() } }
        );

        const accessToken = jwt.sign(
            { userId: user._id, email: user.email },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user._id, email: user.email },
            REFRESH_TOKEN_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            accessToken,
            refreshToken,
            user: { id: user._id, email: user.email }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};


exports.refresh = async( req, res ) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) return res.status(401).json({ message:' No refresh token'});

        let payload;

        try {
            payload = jwt.verify( refreshToken, REFRESH_TOKEN_SECRET);
        } catch (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
        
        const  accessToken = jwt.sign(
            { userId: user.userId, email: user.email },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        res.json({accessToken})
        
    } catch (err) {
        console.error('Refresh Error', err);
        res.status(500).json({ message: 'Refresh error'});
    }
}

exports.authenticateToken = ( req, res, next ) => {
    const authHeader = req.headers.authorization;
    if ( !authHeader || !authHeader.startsWith('Bearer ') ) {
        return res.status(401).json({ message: 'No token provided '})
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}