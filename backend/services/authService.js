import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Đăng ký
export const register = async (userData) => {
  const { email, password, fullName, phone, address } = userData;

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) throw new Error('Email đã được sử dụng');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName,
      phone,
      address
    }
  });

  return { userId: newUser.id };
};

// Đăng nhập
export const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Email hoặc mật khẩu không đúng');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Email hoặc mật khẩu không đúng');

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  const { password: _, ...userData } = user;
  return { token, user: userData };
};

// Lấy profile
export const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      address: true,
      role: true,
      createdAt: true
    }
  });

  if (!user) throw new Error('Không tìm thấy người dùng');
  return user;
};

// Cập nhật profile
export const updateProfile = async (userId, updateData) => {
  const { fullName, phone, address } = updateData;

  return await prisma.user.update({
    where: { id: userId },
    data: { fullName, phone, address },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      address: true,
      role: true
    }
  });
};
