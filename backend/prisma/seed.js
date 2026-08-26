process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Bắt đầu quá trình seeding (Làm sạch & Nạp lại)...');

  // Tạo/Cập nhật Admin
  const adminEmail = 'admin@mycake.com';
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      fullName: 'Quản Trị Viên',
      role: 'ADMIN',
    },
  });
  console.log('Đã kiểm tra tài khoản Admin.');

  // DỌN DẸP DỮ LIỆU CŨ (Để không bị trùng)
  console.log('Đang xóa dữ liệu cũ để đồng bộ lại...');
  try {
    // Xóa theo thứ tự để tránh lỗi ràng buộc khóa ngoại (Foreign Key)
    await prisma.orderItem.deleteMany({});
    await prisma.cake.deleteMany({});
    await prisma.category.deleteMany({});
    console.log('Đã xóa sạch các danh mục và bánh cũ.');
  } catch (err) {
    console.log('Lưu ý:', err.message);
  }

  //NẠP 4 DANH MỤC MỚI CỦA BẠN
  const categories = ['Bánh mì', 'Bánh Sinh Nhật', 'Bánh ngọt/Mousse', 'Cookies'];

  for (const name of categories) {
    await prisma.category.create({
      data: { name },
    });
  }

  console.log('Đã nạp thành công 4 danh mục: ' + categories.join(', '));
  console.log('Kết thúc seeding!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
