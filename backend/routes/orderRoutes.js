import express from 'express';
const router = express.Router();
import * as orderController from '../controllers/orderController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

// @route   POST /api/orders
// @desc    Tạo đơn hàng mới (User)
router.post('/', verifyToken, orderController.createOrder);

// @route   PUT /api/orders/:id/cancel
// @desc    Hủy đơn hàng của tôi (User)
router.put('/my/:id/cancel', verifyToken, orderController.cancelMyOrder);

// @route   GET /api/orders/my
// @desc    Lấy lịch sử đơn hàng của tôi (User)
router.get('/my', verifyToken, orderController.getMyOrders);

// @route   GET /api/orders
// @desc    Lấy tất cả đơn hàng (Admin)
router.get('/', verifyToken, isAdmin, orderController.getAllOrders);

// @route   PUT /api/orders/:id
// @desc    Cập nhật trạng thái đơn hàng (Admin)
router.put('/:id', verifyToken, isAdmin, orderController.updateOrderStatus);

export default router;
