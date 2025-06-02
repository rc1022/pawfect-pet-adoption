const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post(
    '/register', 
    [
        body('email').isEmail().withMessage('Invalid email address'),
        body('password')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
            .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
            .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    register
);


router.post(
    '/login', 
    [
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    ( req, res, next ) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    login);


module.exports = router;