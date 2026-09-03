import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import AdminOrders from './AdminOrders';
import AdminCakes from './AdminCakes';
import ProfilePage from './ProfilePage';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function AdminDashboard() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'cakes';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState([]);

  const authData = JSON.parse(localStorage.getItem('user'));
  const user = authData?.user || authData;

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
          <div>
            <h1 style={{ color: '#2b1e17', margin: 0 }}>Bảng Điều Khiển Quản Trị</h1>
            <p style={{ color: '#888', marginTop: '5px' }}>Chào Admin, chúc bạn một ngày làm việc hiệu quả!</p>
          </div>

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
              📋 Đơn Hàng
            </button>
            <button
              onClick={() => setActiveTab('UserInfo')}
              style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: activeTab === 'UserInfo' ? '#2b1e17' : 'transparent', color: activeTab === 'UserInfo' ? 'white' : '#666', border: 'none', borderRadius: '8px', fontWeight: 'bold', transition: '0.3s' }}
            >
              👤 Hồ Sơ
            </button>
          </div>
        </div>

        {activeTab === 'cakes' && <AdminCakes />}

        {activeTab === 'orders' && <AdminOrders />}

        {activeTab === 'UserInfo' && (
          <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px', alignItems: 'start' }}>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <ProfilePage type="summary" />
            </div>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <ProfilePage type="form" />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default AdminDashboard;
