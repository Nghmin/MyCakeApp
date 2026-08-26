const express = require('express');
const router = express.Router();
const cakeController = require('../controllers/cakeController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const uploadCloud = require('../config/cloudinary');

// @route   GET /api/cakes
// @desc    Lấy tất cả bánh
router.get('/', cakeController.getAllCakes);

// @route   GET /api/cakes/:id
// @desc    Lấy chi tiết 1 cái bánh
router.get('/:id', cakeController.getCakeById);

// @route   POST /api/cakes
// @desc    Thêm bánh mới (Chỉ Admin)
router.post('/', verifyToken, isAdmin, uploadCloud.single('image'), cakeController.createCake);

// @route   PUT /api/cakes/:id
// @desc    Cập nhật bánh (Chỉ Admin)
router.put('/:id', verifyToken, isAdmin, uploadCloud.single('image'), cakeController.updateCake);

// @route   DELETE /api/cakes/:id
// @desc    Xóa bánh (Chỉ Admin)
router.delete('/:id', verifyToken, isAdmin, cakeController.deleteCake);

module.exports = router;
