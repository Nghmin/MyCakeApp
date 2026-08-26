const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
router.post('/register', authController.register);

// @route   POST /api/auth/login
router.post('/login', authController.login);

// @route   GET /api/auth/profile
router.get('/profile', verifyToken, authController.getProfile);

// @route   PUT /api/auth/profile
router.put('/profile', verifyToken, authController.updateProfile);

module.exports = router;
