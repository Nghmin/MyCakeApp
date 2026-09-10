import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // State dữ liệu gốc
  const [categories, setCategories] = useState([]);
  const [allCakes, setAllCakes] = useState([]);
  const [currentCat, setCurrentCat] = useState(null);
  const [loading, setLoading] = useState(true);

  // State bộ lọc & sắp xếp
  const [selectedCatId, setSelectedCatId] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'price-asc', 'price-desc'

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Hàm tạo slug đồng bộ
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy danh mục & tất cả bánh
        const [catRes, cakeRes] = await Promise.all([
          api.get('/categories'),
          api.get('/cakes')
        ]);

        setCategories(catRes.data);
        setAllCakes(cakeRes.data);

        // Xác định danh mục hiện tại dựa trên slug
        if (slug && slug !== 'all') {
          const found = catRes.data.find(c => generateSlug(c.name) === slug);
          if (found) {
            setCurrentCat(found);
            setSelectedCatId(found.id || found._id);
          } else {
            setSelectedCatId('ALL');
            setCurrentCat(null);
          }
        } else {
          setSelectedCatId('ALL');
          setCurrentCat(null);
        }
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Xử lý lọc và sắp xếp
  const filteredAndSortedCakes = useMemo(() => {
    let result = [...allCakes];

    // Lọc theo danh mục
    if (selectedCatId !== 'ALL') {
      result = result.filter(cake => {
        const cakeCatId = cake.categoryId || cake.category?.id || cake.category?._id;
        return cakeCatId === selectedCatId;
      });
    }

    // Lọc theo giá
    result = result.filter(cake => cake.price <= maxPrice);

    // Sắp xếp
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    }

    return result;
  }, [allCakes, selectedCatId, maxPrice, sortBy]);

  // Phân trang
  const totalPages = Math.ceil(filteredAndSortedCakes.length / itemsPerPage);
  const displayedCakes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedCakes.slice(start, start + itemsPerPage);
  }, [filteredAndSortedCakes, currentPage]);

  // Chuyển danh mục khi bấm vào Sidebar
  const handleSelectCategory = (cat) => {
    setCurrentPage(1);
    if (!cat) {
      setSelectedCatId('ALL');
      setCurrentCat(null);
      navigate('/category/all');
    } else {
      setSelectedCatId(cat.id || cat._id);
      setCurrentCat(cat);
      navigate(`/category/${generateSlug(cat.name)}`);
    }
  };

  return (
    <div style={{ backgroundColor: '#fdfaf7', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ padding: '30px 8%' }}>
        <div style={{ marginBottom: '20px', fontSize: '13px', color: '#888' }}>
          <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>Trang chủ</Link> /
          <span style={{ color: '#d4883b', marginLeft: '5px', fontWeight: '500' }}>
            {currentCat ? currentCat.name : 'Tất cả sản phẩm'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '35px', alignItems: 'start' }}>
          
          {/* Cột trái: Sidebar bộ lọc */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {/* Box 1: Danh mục sản phẩm */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #f0e6dd' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#2b1e17', borderBottom: '2px solid #f5e9dc', paddingBottom: '10px' }}>
                Danh mục sản phẩm
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li>
                  <button
                    onClick={() => handleSelectCategory(null)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      padding: '6px 0',
                      cursor: 'pointer',
                      color: selectedCatId === 'ALL' ? '#d4883b' : '#444',
                      fontWeight: selectedCatId === 'ALL' ? 'bold' : 'normal',
                      fontSize: '14px',
                      textAlign: 'left'
                    }}
                  >
                    <span>Tất cả sản phẩm</span>
                    <span style={{ fontSize: '12px', background: '#f5f5f5', padding: '2px 8px', borderRadius: '10px', color: '#777' }}>
                      {allCakes.length}
                    </span>
                  </button>
                </li>
                {categories.map(cat => {
                  const catId = cat.id || cat._id;
                  const count = allCakes.filter(c => (c.categoryId || c.category?.id || c.category?._id) === catId).length;
                  const isSelected = selectedCatId === catId;

                  return (
                    <li key={catId}>
                      <button
                        onClick={() => handleSelectCategory(cat)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          justify: 'space-between',
                          alignItems: 'center',
                          background: 'none',
                          border: 'none',
                          padding: '6px 0',
                          cursor: 'pointer',
                          color: isSelected ? '#d4883b' : '#444',
                          fontWeight: isSelected ? 'bold' : 'normal',
                          fontSize: '14px',
                          textAlign: 'left'
                        }}
                      >
                        <span>{cat.name}</span>
                        <span style={{ fontSize: '12px', background: isSelected ? '#fdf2e9' : '#f5f5f5', color: isSelected ? '#d4883b' : '#777', padding: '2px 8px', borderRadius: '10px' }}>
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Box 2: Lọc theo giá */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #f0e6dd' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#2b1e17', borderBottom: '2px solid #f5e9dc', paddingBottom: '10px' }}>
                Lọc theo giá
              </h3>
              <input
                type="range"
                min="0"
                max="1000000"
                step="50000"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{ width: '100%', accentColor: '#d4883b', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666', marginTop: '10px', fontWeight: '500' }}>
                <span>0đ</span>
                <span style={{ color: '#d4883b', fontWeight: 'bold' }}>{maxPrice.toLocaleString()}đ</span>
              </div>
            </div>

          </aside>

          {/* Cột hiển thị danh sách */}
          <main>
            {/* Header danh sách & Sắp xếp */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#fff', padding: '15px 20px', borderRadius: '12px', border: '1px solid #f0e6dd' }}>
              <h2 style={{ color: '#2b1e17', margin: 0, fontSize: '22px' }}>
                {currentCat ? currentCat.name : 'Tất cả sản phẩm'}
                <span style={{ fontSize: '14px', color: '#888', fontWeight: 'normal', marginLeft: '10px' }}>
                  ({filteredAndSortedCakes.length} sản phẩm)
                </span>
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '13px', color: '#666' }}>Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none', fontSize: '13px', cursor: 'pointer', background: '#fff' }}
                >
                  <option value="popular">Phổ biến nhất</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                </select>
              </div>
            </div>

            {/* Grid sản phẩm */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>⏳ Đang tải bánh ngon...</div>
            ) : displayedCakes.length > 0 ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                  {displayedCakes.map(cake => (
                    <div
                      key={cake.id || cake._id}
                      style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                        border: '1px solid #f0f0f0',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justify: 'space-between',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.04)';
                      }}
                    >
                      {/* Badge Bán chạy */}
                      {cake.bestseller && (
                        <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#d4883b', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', zIndex: 1, textTransform: 'uppercase' }}>
                          Bán chạy
                        </span>
                      )}

                      <div>
                        <div style={{ height: '180px', overflow: 'hidden', background: '#f9f9f9' }}>
                          <img
                            src={cake.image || 'https://via.placeholder.com/300x200?text=Cake'}
                            alt={cake.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ padding: '15px' }}>
                          <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#2b1e17', fontWeight: 'bold', height: '38px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {cake.name}
                          </h4>
                          <p style={{ color: '#d4883b', fontWeight: 'bold', fontSize: '17px', margin: 0 }}>
                            {cake.price?.toLocaleString()}đ
                          </p>
                        </div>
                      </div>

                      <div style={{ padding: '0 15px 15px 15px' }}>
                        <button
                          onClick={() => addToCart(cake)}
                          style={{
                            width: '100%',
                            padding: '9px',
                            backgroundColor: '#2b1e17',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '13px',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d4883b'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2b1e17'}
                        >
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* THANH PHÂN TRANG (PAGINATION) */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '35px' }}>
                    <button
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #ddd', background: currentPage === 1 ? '#eee' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '13px' }}
                    >
                      Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #ddd',
                          backgroundColor: currentPage === page ? '#d4883b' : '#fff',
                          color: currentPage === page ? '#fff' : '#333',
                          fontWeight: currentPage === page ? 'bold' : 'normal',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #ddd', background: currentPage === totalPages ? '#eee' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '13px' }}
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 0', background: '#fff', borderRadius: '12px', border: '1px solid #f0e6dd' }}>
                <h3 style={{ color: '#666', fontWeight: 'normal' }}>Không tìm thấy bánh phù hợp với bộ lọc.</h3>
                <button
                  onClick={() => { setSelectedCatId('ALL'); setMaxPrice(1000000); }}
                  style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#d4883b', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer' }}
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CategoryPage;