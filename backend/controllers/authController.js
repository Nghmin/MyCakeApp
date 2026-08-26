const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng kí
exports.register = async (req, res) => {
  try {
    const { email, password, fullName, phone, address } = req.body;

    // Kiểm tra email tồn tại chưa
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'Email đã được sử dụng' });

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Lưu vào DB (Mặc định là USER, bạn có thể chỉnh manual trong DB thành ADMIN sau)
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        phone,
        address
      }
    });

    res.status(201).json({ message: 'Đăng ký thành công', userId: newUser.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });

    // Tạo Token (JWT)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Trả về thông tin (không trả password)
    const { password: _, ...userData } = user;
    res.json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy thông tin cá nhân
exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
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
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật thông tin cá nhân
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
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
    res.json({ message: 'Cập nhật thành công', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
