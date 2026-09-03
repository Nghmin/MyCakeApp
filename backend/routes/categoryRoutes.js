import express from 'express';
const router = express.Router();
import * as categoryController from '../controllers/categoryController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

// @route   GET /api/categories
router.get('/', categoryController.getAllCategories);

// @route   POST /api/categories
// @desc    Thêm danh mục (Admin)
router.post('/', verifyToken, isAdmin, categoryController.createCategory);

// @route   DELETE /api/categories/:id
// @desc    Xóa danh mục (Admin)
router.delete('/:id', verifyToken, isAdmin, categoryController.deleteCategory);

export default router;
