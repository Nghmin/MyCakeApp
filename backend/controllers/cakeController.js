const prisma = require('../config/prisma');

// Lấy tất cả bánh 
exports.getAllCakes = async (req, res) => {
  try {
    const cakes = await prisma.cake.findMany({
      include: { category: true } // Lấy kèm thông tin danh mục
    });
    res.json(cakes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy chi tiết 1 cái bánh
exports.getCakeById = async (req, res) => {
  try {
    const cake = await prisma.cake.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true }
    });
    if (!cake) return res.status(404).json({ message: 'Không tìm thấy bánh' });
    res.json(cake);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm bánh mới (Admin)
exports.createCake = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, bestseller } = req.body;
    let imageUrl = req.body.image; 

    // File upload từ Multer-Cloudinary
    if (req.file) {
      imageUrl = req.file.path;
    }

    const newCake = await prisma.cake.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryId: parseInt(categoryId),
        image: imageUrl,
        bestseller: bestseller === 'true' || bestseller === true
      }
    });
    res.status(201).json(newCake);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật bánh (Admin)
exports.updateCake = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, bestseller, isAvailable } = req.body;
    let imageUrl = req.body.image;

    if (req.file) {
      imageUrl = req.file.path;
    }

    const updatedCake = await prisma.cake.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        stock: stock ? parseInt(stock) : undefined,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        image: imageUrl,
        bestseller: bestseller === 'true' || bestseller === true,
        isAvailable: isAvailable === 'true' || isAvailable === true
      }
    });
    res.json(updatedCake);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa bánh (Admin)
exports.deleteCake = async (req, res) => {
  try {
    await prisma.cake.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Đã xóa bánh thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
