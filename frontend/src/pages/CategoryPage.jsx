import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

function CategoryPage() {
  const { slug } = useParams();
  const [cakes, setCakes] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Hàm chuyển đổi slug ngược lại tên danh mục để hiển thị hoặc gọi API
  // Tuy nhiên, cách tốt nhất là Backend hỗ trợ lọc theo slug hoặc ID
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Lấy danh sách danh mục để tìm tên thật từ slug
        const catRes = await api.get('/categories');
        const currentCat = catRes.data.find(c => {
          const s = c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").replace(/([^0-9a-z-\s])/g, "").replace(/(\s+)/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
          return s === slug;
        });

        if (currentCat) {
          setCategoryName(currentCat.name);
          // 2. Lấy bánh theo ID danh mục
          const cakeRes = await api.get(`/cakes?categoryId=${currentCat.id}`);
          setCakes(cakeRes.data);
        }
      } catch (err) {
        console.error("Lỗi lấy dữ liệu danh mục:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  return (
    <div style={{ backgroundColor: '#fdfaf7', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ padding: '40px 8%' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '20px', fontSize: '14px', color: '#888' }}>
          <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>Trang chủ</Link> /
          <span style={{ color: '#d4883b', marginLeft: '5px' }}>{categoryName || 'Danh mục'}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#2b1e17', margin: 0, fontSize: '32px' }}>{categoryName}</h1>
          <p style={{ color: '#666' }}>Hiển thị {cakes.length} sản phẩm</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải bánh ngon...</div>
        ) : cakes.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            {cakes.map(cake => (
              <div key={cake.id} style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img
                    src={cake.image || 'https://via.placeholder.com/300x200?text=Cake'}
                    alt={cake.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#2b1e17' }}>{cake.name}</h3>
                  <p style={{ color: '#d4883b', fontWeight: 'bold', fontSize: '20px', margin: '0 0 15px 0' }}>
                    {cake.price?.toLocaleString()}đ
                  </p>
                  <button
                    onClick={() => addToCart(cake)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#2b1e17',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#888' }}>
            <h3>Chưa có sản phẩm nào trong danh mục này.</h3>
            <Link to="/" style={{ color: '#d4883b' }}>Quay lại trang chủ</Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default CategoryPage;
