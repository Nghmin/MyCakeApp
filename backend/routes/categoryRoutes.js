const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// @route   GET /api/categories
router.get('/', categoryController.getAllCategories);

// @route   POST /api/categories
// @desc    Thêm danh mục (Chỉ Admin)
router.post('/', verifyToken, isAdmin, categoryController.createCategory);

// @route   DELETE /api/categories/:id
// @desc    Xóa danh mục (Chỉ Admin)
router.delete('/:id', verifyToken, isAdmin, categoryController.deleteCategory);

module.exports = router;
