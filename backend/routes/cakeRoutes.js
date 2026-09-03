import express from 'express';
const router = express.Router();
import * as cakeController from '../controllers/cakeController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import uploadCloud from '../config/cloudinary.js';

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

export default router;
