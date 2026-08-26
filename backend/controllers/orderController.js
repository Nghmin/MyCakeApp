const prisma = require('../config/prisma');

// Tạo đơn hàng (User)
exports.createOrder = async (req, res) => {
  try {
    const { address, phone, items } = req.body;
    const userId = req.user.id;

    // Tính tổng tiền từ các items
    const totalPrice = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Đảm bảo tạo đơn và trừ kho thành công cùng lúc
    const order = await prisma.$transaction(async (tx) => {
      // Tạo đơn hàng
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalPrice,
          address,
          phone,
          items: {
            create: items.map(item => ({
              cakeId: item.cakeId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      });

      // Cập nhật số lượng kho cho từng bánh
      for (const item of items) {
        await tx.cake.update({
          where: { id: item.cakeId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return newOrder;
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy lịch sử đơn hàng (User)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { cake: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy tất cả đơn hàng (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { fullName: true, email: true } },
        items: { include: { cake: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật trạng thái đơn hàng (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
