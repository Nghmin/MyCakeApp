import prisma from '../config/prisma.js';
import { cloudinary } from '../config/cloudinary.js';

// Hàm xóa ảnh trên Cloudinary
const deleteCloudinaryImage = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) return;
  try {
    const parts = imageUrl.split('/');
    const myCakeAppIndex = parts.indexOf('MyCakeApp');
    if (myCakeAppIndex !== -1) {
      const fileWithExtension = parts[parts.length - 1];
      const publicId = `MyCakeApp/${fileWithExtension.split('.')[0]}`;
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error('Lỗi xóa ảnh cũ trên Cloudinary:', error);
  }
};

// Lấy tất cả bánh 
export const getAllCakes = async (req, res) => {
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
export const getCakeById = async (req, res) => {
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
export const createCake = async (req, res) => {
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
export const updateCake = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, bestseller, isAvailable } = req.body;
    let imageUrl = req.body.image;

    // Nếu có file mới, xóa ảnh cũ trên Cloudinary
    if (req.file) {
      const oldCake = await prisma.cake.findUnique({
        where: { id: parseInt(req.params.id) },
        select: { image: true }
      });

      if (oldCake?.image) {
        await deleteCloudinaryImage(oldCake.image);
      }

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
export const deleteCake = async (req, res) => {
  try {
    const cakeId = parseInt(req.params.id);

    // Lấy thông tin bánh để lấy URL ảnh trước khi xóa
    const cake = await prisma.cake.findUnique({
      where: { id: cakeId },
      select: { image: true }
    });

    if (cake?.image) {
      await deleteCloudinaryImage(cake.image);
    }

    await prisma.cake.delete({
      where: { id: cakeId }
    });
    res.json({ message: 'Đã xóa bánh và ảnh thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
