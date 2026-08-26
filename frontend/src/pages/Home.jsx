import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Ảnh placeholder tạm thời cho giao diện
const PLACEHOLDER_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
  category: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=300&q=80',
  cake: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=500&q=80',
};

// ==========================================
// MAIN COMPONENT HOME
// ==========================================
function Home({ user, onLogout }) {
  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  console.log("User hiện tại:", user);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cakesRes, catsRes] = await Promise.all([
          api.get('/cakes'),
          api.get('/categories')
        ]);
        setCakes(cakesRes.data);
        setCategories(catsRes.data);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCakes = selectedCategory
    ? cakes.filter(cake => cake.categoryId === selectedCategory)
    : cakes;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: '#c68a4c' }}>
        Đang tải danh sách bánh...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#faf6f0', color: '#333', fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>
      
      {/* ĐƯA NAVBAR VÀO ĐÂY */}
      <Navbar user={user} onLogout={onLogout} />

      {/* 1. HERO BANNER SECTION */}
      <section style={{ padding: '20px 8%', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ 
          flex: '2 1 600px', 
          height: '380px', 
          borderRadius: '16px', 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${PLACEHOLDER_IMAGES.hero})`,
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          padding: '40px', 
          color: '#fff' 
        }}>
          <h1 style={{ fontSize: '36px', marginBottom: '15px', lineHeight: '1.2' }}>
            Vị Ngọt Trọn Vẹn Từng<br />Khoảnh Khắc
          </h1>
          <p style={{ fontSize: '14px', maxWidth: '450px', marginBottom: '25px', opacity: 0.9 }}>
            Nguyên liệu tươi ngon tự nhiên được tuyển chọn kỹ lưỡng, mang lại hương vị mềm mịn, ngọt dịu ấm áp cho mỗi bữa tiệc gia đình.
          </p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button style={{ backgroundColor: '#d4883b', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>
              Đặt mua ngay
            </button>
            <button style={{ backgroundColor: 'transparent', color: '#fff', border: '1px solid #fff', padding: '12px 24px', borderRadius: '25px', cursor: 'pointer' }}>
              Tìm hiểu thêm
            </button>
          </div>
        </div>

        <div style={{ 
          flex: '1 1 300px', 
          height: '380px', 
          border: '2px dashed #e2cbb4', 
          borderRadius: '16px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#fff', 
          padding: '20px', 
          textAlign: 'center' 
        }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#fdf6ed', color: '#d4883b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '15px' }}>
            ⚙️
          </div>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#2b1e17' }}>Món Được Yêu Thích</h3>
          <p style={{ color: '#777', fontSize: '13px', marginBottom: '20px' }}>
            Tùy chỉnh đặt chiếc bánh "tủ" của bạn ở đây để tiện gọi món mỗi ngày.
          </p>
          <button style={{ backgroundColor: '#d4883b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            Thêm món tủ ngay
          </button>
        </div>
      </section>

      {/* 2. CATEGORY SECTION */}
      <section style={{ padding: '30px 8%' }}>
        <span style={{ color: '#d4883b', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
          DANH MỤC SẢN PHẨM
        </span>
        <h2 style={{ fontSize: '26px', color: '#2b1e17', margin: '5px 0 25px 0' }}>Thế Giới Bánh Ngọt Đa Dạng</h2>
        
        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
          <div 
            onClick={() => setSelectedCategory(null)}
            style={{ 
              flex: '0 0 160px', 
              backgroundColor: !selectedCategory ? '#fbeee0' : '#fff', 
              border: !selectedCategory ? '2px solid #d4883b' : '1px solid #eee', 
              borderRadius: '12px', 
              padding: '15px', 
              textAlign: 'center', 
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#f5f5f5', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              ALL
            </div>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>Tất cả</span>
          </div>

          {categories.map(cat => (
            <div 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{ 
                flex: '0 0 160px', 
                backgroundColor: selectedCategory === cat.id ? '#fbeee0' : '#fff', 
                border: selectedCategory === cat.id ? '2px solid #d4883b' : '1px solid #eee', 
                borderRadius: '12px', 
                padding: '15px', 
                textAlign: 'center', 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <img 
                src={cat.image || PLACEHOLDER_IMAGES.category} 
                alt={cat.name} 
                style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px', display: 'block' }}
              />
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PRODUCT LIST SECTION */}
      <section style={{ padding: '30px 8%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '25px' }}>
          <div>
            <span style={{ color: '#d4883b', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
              ĐƯỢC MUA NHIỀU NHẤT
            </span>
            <h2 style={{ fontSize: '26px', color: '#2b1e17', margin: '5px 0 0 0' }}>Sản Phẩm Nổi Bật Tuần Này</h2>
          </div>
          <span style={{ color: '#d4883b', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
            Xem tất cả sản phẩm →
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {filteredCakes.length > 0 ? (
            filteredCakes.map(cake => (
              <div key={cake.id} style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={cake.image || PLACEHOLDER_IMAGES.cake}
                    alt={cake.name}
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                  />
                  {cake.tag && (
                    <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#d4883b', color: '#fff', fontSize: '10px', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                      {cake.tag}
                    </span>
                  )}
                </div>

                <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#2b1e17' }}>{cake.name}</h3>
                    <div style={{ color: '#f39c12', fontSize: '12px', marginBottom: '8px' }}>
                      ⭐ 4.9/5.0
                    </div>
                    <p style={{ color: '#777', fontSize: '12px', height: '36px', overflow: 'hidden', margin: '0 0 15px 0', lineHeight: '1.4' }}>
                      {cake.description || 'Hương vị thơm ngon đặc trưng được chế biến tươi mới hàng ngày.'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#d4883b', fontWeight: 'bold', fontSize: '16px' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cake.price)}
                    </span>
                    <button
                      onClick={() => addToCart(cake)}
                      style={{ backgroundColor: '#2b1e17', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                    >
                      🛒 Chọn mua
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', padding: '40px 0' }}>
              Hiện chưa có bánh nào trong danh mục này.
            </p>
          )}
        </div>
      </section>

      {/* 4. FOOTER SECTION TỪ COMPONENT */}
      <Footer />

    </div>
  );
}

export default Home;