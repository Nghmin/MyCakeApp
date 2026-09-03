import * as authService from '../services/authService.js';

// Đăng ký
export const register = async (req, res) => {
  try {
    const { email, password, fullName, phone, address } = req.body;
    const errors = {};

    if (!email) errors.email = 'Vui lòng nhập Email';
    if (!password) errors.password = 'Vui lòng nhập Mật khẩu';
    if (!fullName) errors.fullName = 'Vui lòng nhập Họ và tên';
    if (!phone) errors.phone = 'Vui lòng nhập Số điện thoại';
    if (!address) errors.address = 'Vui lòng nhập Địa chỉ';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin', errors });
    }

    // Chuyển sang Service xử lý logic lưu Database
    const result = await authService.register(req.body);
    res.status(201).json({ message: 'Đăng ký thành công', ...result });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Đăng nhập
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errors = {};

    if (!email) errors.email = 'Vui lòng nhập Email';
    if (!password) errors.password = 'Vui lòng nhập Mật khẩu';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin', errors });
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Lấy thông tin cá nhân
export const getProfile = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Cập nhật thông tin cá nhân
export const updateProfile = async (req, res) => {
  try {
    const result = await authService.updateProfile(req.user.id, req.body);
    res.json({ message: 'Cập nhật thành công', user: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};