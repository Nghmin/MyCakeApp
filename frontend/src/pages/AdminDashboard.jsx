import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import AdminOrders from './AdminOrders';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function AdminDashboard() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'cakes';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const [newCake, setNewCake] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    bestseller: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  useEffect(() => {
    const tab = queryParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [location.search]);

  useEffect(() => {
    fetchCakes();
    fetchCategories();
  }, []);

  const fetchCakes = async () => {
    try {
      const res = await api.get('/cakes');
      setCakes(res.data);
    } catch (err) {
      console.error('Lỗi lấy danh sách bánh:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Lỗi lấy danh mục:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'image') {
      setImageFile(files[0]);
    } else {
      setNewCake({
        ...newCake,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', newCake.name);
      formData.append('price', newCake.price);
      formData.append('stock', newCake.stock);
      formData.append('categoryId', newCake.categoryId);
      formData.append('description', newCake.description);
      formData.append('bestseller', newCake.bestseller);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await api.post('/cakes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Thêm bánh thành công!');
      setNewCake({ name: '', description: '', price: '', stock: '', categoryId: '', bestseller: false });
      setImageFile(null);
      fetchCakes();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi thêm bánh');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bánh này?')) {
      try {
        await api.delete(`/cakes/${id}`);
        fetchCakes();
      } catch (err) {
        alert('Lỗi khi xóa bánh');
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar user={user} onLogout={handleLogout} />

      <div style={{ flex: 1, padding: '40px 8%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#2b1e17', margin: 0 }}>Bảng Điều Khiển Admin</h1>
          <div style={{ display: 'flex', gap: '10px', backgroundColor: '#fff', padding: '5px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <button
              onClick={() => setActiveTab('cakes')}
              style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: activeTab === 'cakes' ? '#2b1e17' : 'transparent', color: activeTab === 'cakes' ? 'white' : '#666', border: 'none', borderRadius: '8px', fontWeight: 'bold', transition: '0.3s' }}
            >
              🎂 Quản Lý Bánh
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: activeTab === 'orders' ? '#2b1e17' : 'transparent', color: activeTab === 'orders' ? 'white' : '#666', border: 'none', borderRadius: '8px', fontWeight: 'bold', transition: '0.3s' }}
            >
              📋 Quản Lý Đơn Hàng
            </button>
          </div>
        </div>

        {activeTab === 'cakes' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '30px', alignItems: 'start' }}>
            {/* Form thêm bánh */}
            <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#2b1e17' }}>✨ Thêm Bánh Mới</h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '5px' }}>Tên sản phẩm</label>
                  <input type="text" name="name" placeholder="Ví dụ: Bánh Mousse Dâu" value={newCake.name} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '5px' }}>Giá tiền (VND)</label>
                    <input type="number" name="price" placeholder="50000" value={newCake.price} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '5px' }}>Số lượng kho</label>
                    <input type="number" name="stock" placeholder="10" value={newCake.stock} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '5px' }}>Danh mục</label>
                  <select name="categoryId" value={newCake.categoryId} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', appearance: 'none', background: '#fff' }}>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '5px' }}>Hình ảnh sản phẩm</label>
                  <input type="file" name="image" accept="image/*" onChange={handleInputChange} style={{ width: '100%', padding: '8px', border: '1px dashed #ccc', borderRadius: '8px' }} />
                </div>

                <div>
                  <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '5px' }}>Mô tả sản phẩm</label>
                  <textarea name="description" placeholder="Nhập mô tả ngắn về bánh..." value={newCake.description} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', height: '80px', boxSizing: 'border-box', resize: 'none' }}></textarea>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
                  <input type="checkbox" name="bestseller" checked={newCake.bestseller} onChange={handleInputChange} style={{ width: '18px', height: '18px' }} />
                  <span>Đánh dấu là sản phẩm bán chạy</span>
                </label>

                <button type="submit" disabled={loading} style={{ marginTop: '10px', padding: '15px', backgroundColor: '#d4883b', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                  {loading ? '⏳ Đang xử lý...' : '➕ Thêm Vào Cửa Hàng'}
                </button>
              </form>
            </div>

            {/* Danh sách bánh */}
            <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#2b1e17' }}>🍱 Danh Sách Bánh ({cakes.length})</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f5f5f5', color: '#888', fontSize: '14px' }}>
                      <th style={{ padding: '12px' }}>Sản phẩm</th>
                      <th style={{ padding: '12px' }}>Giá</th>
                      <th style={{ padding: '12px' }}>Kho</th>
                      <th style={{ padding: '12px' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cakes.map(cake => (
                      <tr key={cake.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                        <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={cake.image || 'https://via.placeholder.com/40'} alt="" style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div style={{ fontWeight: '500', color: '#333' }}>{cake.name}</div>
                        </td>
                        <td style={{ padding: '12px', color: '#d4883b', fontWeight: 'bold' }}>{new Intl.NumberFormat('vi-VN').format(cake.price)}đ</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '12px', backgroundColor: cake.stock < 5 ? '#fff3f3' : '#f0f9f4', color: cake.stock < 5 ? '#e74c3c' : '#27ae60', fontSize: '12px', fontWeight: 'bold' }}>
                            {cake.stock} chiếc
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => handleDelete(cake.id)} style={{ padding: '6px 12px', color: '#e74c3c', border: '1px solid #ffecec', backgroundColor: '#fff5f5', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                            🗑️ Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <AdminOrders />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default AdminDashboard;
