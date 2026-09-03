import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import OrderHistory from './OrderHistory';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function UserDashboard() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'UserInfo';

  const [activeTab, setActiveTab] = useState(initialTab);

  const authData = JSON.parse(localStorage.getItem('user'));
  const user = authData?.user || authData;

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  useEffect(() => {
    const tab = queryParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [location.search]);

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar user={user} onLogout={handleLogout} />

      <div style={{ flex: 1, padding: '40px 8%' }}>
        {/* Tiêu đề & Tab Switcher */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ color: '#2b1e17', margin: 0 }}>Cài Đặt Tài Khoản</h1>
            <p style={{ color: '#888', marginTop: '5px', fontSize: '14px' }}>Quản lý hồ sơ và theo dõi các đơn hàng của bạn</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', backgroundColor: '#fff', padding: '5px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <button
              onClick={() => setActiveTab('UserInfo')}
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                backgroundColor: activeTab === 'UserInfo' ? '#2b1e17' : 'transparent',
                color: activeTab === 'UserInfo' ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: '0.3s'
              }}
            >
              👤 Hồ sơ của tôi
            </button>
            <button
              onClick={() => setActiveTab('OrderHistory')}
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                backgroundColor: activeTab === 'OrderHistory' ? '#2b1e17' : 'transparent',
                color: activeTab === 'OrderHistory' ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: '0.3s'
              }}
            >
              📜 Lịch sử mua hàng
            </button>
          </div>
        </div>

        {/* Bố cục nội dung */}
        {activeTab === 'UserInfo' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px', alignItems: 'start' }}>
            {/* Cột trái: Tóm tắt thông tin */}
            <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <ProfilePage type="summary" />
            </div>

            {/* Cột phải: Form chỉnh sửa */}
            <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <ProfilePage type="form" />
            </div>
          </div>
        ) : (
          <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <OrderHistory isEmbedded={true} />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default UserDashboard;
