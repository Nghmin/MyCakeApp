const jwt = require('jsonwebtoken');

// Kiểm tra Token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Không có token, quyền truy cập bị từ chối' });
  }

  try {
    const actualToken = token.split(' ')[1];
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

// Kiểm tra quyền Admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Truy cập bị từ chối: Yêu cầu quyền Admin' });
  }
};

module.exports = { verifyToken, isAdmin };
