const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cấu hình thông tin tài khoản Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Thiết lập kho lưu trữ Cloudinary cho Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'MyCakeApp',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
