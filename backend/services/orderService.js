import prisma from '../config/prisma.js';
import { getDateFilter } from '../utils/dateHelper.js';

export const createOrder = async (userId, orderData) => {
  const { address, phone, items } = orderData;

  let totalPrice = 0;

  for (const item of items) {
    const cake = await prisma.cake.findUnique({
      where: { id: item.cakeId }
    });

    if (!cake) {
      throw new Error(`Bánh với ID ${item.cakeId} không tồn tại`);
    }

    if (cake.stock < item.quantity) {
      throw new Error(`Sản phẩm "${cake.name}" đã hết hàng hoặc không đủ số lượng (Còn lại: ${cake.stock})`);
    }

    totalPrice += cake.price * item.quantity;
  }

  // Thực hiện Transaction  
  return await prisma.$transaction(async (tx) => {
    // Tạo đơn hàng
    const newOrder = await tx.order.create({
      data: {
        userId,
        totalPrice,
        address,
        phone,
        status: 'PENDING',
        items: {
          create: items.map(item => ({
            cakeId: item.cakeId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: true }
    });

    // Trừ kho cho từng bánh
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
};

// User tự hủy đơn hàng
export const cancelMyOrder = async (userId, orderId) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) {
      throw new Error('Đơn hàng không tồn tại');
    }

    // Kiểm tra quyền sở hữu đơn hàng
    if (order.userId !== userId) {
      throw new Error('Bạn không có quyền hủy đơn hàng này');
    }

    // Chỉ cho hủy khi PENDING
    if (order.status !== 'PENDING') {
      throw new Error('Đơn hàng đã được xác nhận hoặc đang giao, không thể tự hủy. Vui lòng liên hệ Hotline!');
    }

    // Hoàn trả lại số lượng bánh vào kho
    for (const item of order.items) {
      await tx.cake.update({
        where: { id: item.cakeId },
        data: {
          stock: { increment: item.quantity }
        }
      });
    }

    // Cập nhật trạng thái đơn thành CANCELLED
    return await tx.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' }
    });
  });
};

export const getMyOrders = async (userId, status, dateRange) => {
  const whereCondition = { userId };

  if (status && status !== 'ALL') {
    whereCondition.status = status;
  }

  const createdAtFilter = getDateFilter(dateRange);
  if (createdAtFilter) {
    whereCondition.createdAt = createdAtFilter;
  }
  return await prisma.order.findMany({
    where: whereCondition,
    include: { items: { include: { cake: true } } },
    orderBy: { createdAt: 'desc' }
  });
};

export const getAllOrders = async (status, dateRange) => {
  const whereCondition = (status && status !== 'ALL') ? { status } : {};

  const createdAtFilter = getDateFilter(dateRange);
  if (createdAtFilter) {
    whereCondition.createdAt = createdAtFilter;
  }

  return await prisma.order.findMany({
    where: whereCondition,
    include: {
      user: { select: { fullName: true, email: true } },
      items: { include: { cake: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

// Cập nhật trạng thái đơn hàng (Admin)
export const updateOrderStatus = async (orderId, newStatus) => {
  return await prisma.$transaction(async (tx) => {
    const currentOrder = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!currentOrder) {
      throw new Error('Đơn hàng không tồn tại');
    }

    // Hoàn trả lại số lượng bánh vào kho
    if (newStatus === 'CANCELLED' && currentOrder.status !== 'CANCELLED') {
      for (const item of currentOrder.items) {
        await tx.cake.update({
          where: { id: item.cakeId },
          data: {
            stock: { increment: item.quantity }
          }
        });
      }
    }

    return await tx.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    });
  });
};
