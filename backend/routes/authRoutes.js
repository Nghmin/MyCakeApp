import express from 'express';
const router = express.Router();
import * as authController from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

// @route   POST /api/auth/register
router.post('/register', authController.register);

// @route   POST /api/auth/login
router.post('/login', authController.login);

// @route   GET /api/auth/profile
router.get('/profile', verifyToken, authController.getProfile);

// @route   PUT /api/auth/profile
router.put('/profile', verifyToken, authController.updateProfile);

export default router;
