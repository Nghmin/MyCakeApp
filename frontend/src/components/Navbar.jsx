import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { DEFAULT_AVATAR } from '../utils/constants';
import api from '../api/axios';

function Navbar({ user, onLogout }) {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { cartItems } = useCart();
  const navigate = useNavigate();

  // Lấy danh mục từ Database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Lỗi lấy danh mục Navbar:', err);
      }
    };
    fetchCategories();
  }, []);
  
  // Kiểm tra quyền Admin
  const isAdmin = user && (user.role === 'ADMIN');

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/([^0-9a-z-\s])/g, "")
      .replace(/(\s+)/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  return (
    <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #eaeaea', position: 'sticky', top: 0, zIndex: 1000 }}>
      {/* Thanh trên cùng */}
      <div style={{ backgroundColor: '#2b1e17', color: '#fff', padding: '6px 8%', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>📞 Hotline: 1234 5678 | 📍 Địa chỉ: Trường đại học Phenikaa</span>
        <span>Kết nối với chúng tôi: 📘 📷</span>
      </div>

      {/* Main Navbar */}
      <div style={{ padding: '15px 8%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#d4883b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>
            🍰
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#2b1e17', fontWeight: 'bold' }}>Phenikaa Cake</h2>
            <span style={{ fontSize: '10px', color: '#888', letterSpacing: '1px' }}>TIỆM BÁNH NGỌT ẤM ÁP</span>
          </div>
        </Link>

        {/* Menu danh mục TỰ ĐỘNG (Lấy từ Database sau khi đã Seed sạch) */}
        <nav style={{ display: 'flex', gap: '25px', alignItems: 'center', fontWeight: '500', fontSize: '15px' }}>
          <Link to="/" style={{ color: '#d4883b', textDecoration: 'none', fontWeight: 'bold' }}>Trang chủ</Link>
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${generateSlug(cat.name)}`}
              style={{ color: '#333', textDecoration: 'none' }}
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Thanh tim kiếm */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>Thanh tim kiếm</div> 

        {/* Khung bên phải (Giỏ hàng & User/Admin) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1000 , borderColor : 'blue' }}>

          {/* Nút Giỏ Hàng */}
          { !isAdmin && (
            <Link to="/cart" style={{ textDecoration: 'none' }}>
              <button style={{ backgroundColor: '#fdf6ed', color: '#d4883b', border: '1px solid #e2cbb4', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🛒 Giỏ hàng ({cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0})
              </button>
            </Link>
          )}

          {/* Phân quyền hiển thị User vs Admin */}
          {user ? (
            isAdmin ? (
              <div
                style={{ position: 'relative', cursor: 'pointer', padding: '5px 0' }}
                onMouseEnter={() => setIsAdminMenuOpen(true)}
                onMouseLeave={() => setIsAdminMenuOpen(false)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '20px', backgroundColor: '#f5f5f5', border: '1px solid #ddd' }}>
                  <span style={{ fontSize: '18px' }}>☰</span>
                  <img
                    src={DEFAULT_AVATAR.ADMIN}
                    alt="Admin Avatar"
                    style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2b1e17' }}>Quản trị</span>
                </div>

                {/* Dropdown Menu Admin */}
                {isAdminMenuOpen && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, width: '200px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '8px', padding: '8px 0', zIndex: 1001, border: '1px solid #eee' }}>
                    <div style={{ padding: '8px 16px', fontSize: '12px', color: '#888', borderBottom: '1px solid #eee' }}>
                      Xin chào, <b>{user.fullName || 'Admin'}</b>
                    </div>
                    <Link to="/admin?tab=cakes" style={{ display: 'block', padding: '10px 16px', color: '#333', textDecoration: 'none', fontSize: '14px' }}>
                      📦 Quản lý bánh
                    </Link>
                    <Link to="/admin?tab=orders" style={{ display: 'block', padding: '10px 16px', color: '#333', textDecoration: 'none', fontSize: '14px' }}>
                      📋 Quản lý đơn hàng
                    </Link>
                    <Link to="/user?tab=UserInfo" style={{ display: 'block', padding: '10px 16px', color: '#333', textDecoration: 'none', fontSize: '14px' }}>
                      👤 Thông tin cá nhân
                    </Link>
                    <div style={{ borderTop: '1px solid #eee', marginTop: '5px' }}>
                      <button
                        onClick={onLogout}
                        style={{ width: '100%', textAlign: 'left', padding: '10px 16px', backgroundColor: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '14px' }}
                      >
                        🚪 Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{ position: 'relative', cursor: 'pointer', padding: '5px 0' }}
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 10px', borderRadius: '20px' }}>
                  <img
                    src={DEFAULT_AVATAR.USER}
                    alt=""
                    style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #d4883b' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2b1e17' }}>
                    {user.fullName || user.email}
                  </span>
                </div>

                {isUserMenuOpen && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, width: '200px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '8px', padding: '8px 0', zIndex: 1001, border: '1px solid #eee' }}>
                    <Link to="/user?tab=UserInfo" style={{ display: 'block', padding: '10px 16px', color: '#333', textDecoration: 'none', fontSize: '14px' }}>
                      👤 Thông tin cá nhân
                    </Link>
                    <Link to="/user?tab=OrderHistory" style={{ display: 'block', padding: '10px 16px', color: '#333', textDecoration: 'none', fontSize: '14px' }}>
                      📜 Lịch sử đơn hàng
                    </Link>
                    <div style={{ borderTop: '1px solid #eee', marginTop: '5px' }}>
                      <button
                        onClick={onLogout}
                        style={{ width: '100%', textAlign: 'left', padding: '10px 16px', backgroundColor: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '14px' }}
                      >
                        🚪 Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          ) : (
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button style={{ backgroundColor: '#2b1e17', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' }}>
                Đăng nhập
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
