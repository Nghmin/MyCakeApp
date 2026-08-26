const prisma = require('../config/prisma');

// Lấy tất cả danh mục
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm danh mục (Admin)
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await prisma.category.create({
      data: { name }
    });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa danh mục (Admin)
exports.deleteCategory = async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Đã xóa danh mục thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
