import * as orderService from '../services/orderService.js';

// Tạo đơn hàng (User)
export const createOrder = async (req, res) => {
  try {
    const result = await orderService.createOrder(req.user.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.error(err);
  }
};

// Hủy đơn hàng (User)
export const cancelMyOrder = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const result = await orderService.cancelMyOrder(req.user.id, orderId);
    res.json({ message: 'Hủy đơn hàng thành công', order: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.error(err);
  }
};

// Lấy lịch sử đơn hàng (User)
export const getMyOrders = async (req, res) => {
  try {
    const { status, dateRange } = req.query;
    const orders = await orderService.getMyOrders(req.user.id, status, dateRange);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err);
  }
};

// Lấy tất cả đơn hàng (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const { status, dateRange } = req.query;
    const orders = await orderService.getAllOrders(status, dateRange);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err); 
  }
};

// Cập nhật trạng thái đơn hàng (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const result = await orderService.updateOrderStatus(parseInt(req.params.id), status);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err);
  }
};
