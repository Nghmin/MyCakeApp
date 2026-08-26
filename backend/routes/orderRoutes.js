const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// @route   POST /api/orders
// @desc    Tạo đơn hàng mới (User)
router.post('/', verifyToken, orderController.createOrder);

// @route   GET /api/orders/my
// @desc    Lấy lịch sử đơn hàng của tôi (User)
router.get('/my', verifyToken, orderController.getMyOrders);

// @route   GET /api/orders
// @desc    Lấy tất cả đơn hàng (Admin)
router.get('/', verifyToken, isAdmin, orderController.getAllOrders);

// @route   PUT /api/orders/:id
// @desc    Cập nhật trạng thái đơn hàng (Admin)
router.put('/:id', verifyToken, isAdmin, orderController.updateOrderStatus);

module.exports = router;
