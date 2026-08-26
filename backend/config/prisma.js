const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// Lấy URL kết nối từ biến môi trường
const connectionString = process.env.DATABASE_URL;

// Khởi tạo Pool kết nối của thư viện 'pg'
const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false 
  }
});

// Sử dụng adapter của Prisma 7 để kết nối PostgreSQL
const adapter = new PrismaPg(pool);

// Tạo instance PrismaClient với adapter
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
