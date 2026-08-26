import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my');
        setOrders(res.data);
      } catch (err) {
        console.error('Lỗi lấy lịch sử đơn hàng', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#f39c12';
      case 'CONFIRMED': return '#3498db';
      case 'SHIPPING': return '#9b59b6';
      case 'DELIVERED': return '#2ecc71';
      case 'CANCELLED': return '#e74c3c';
      default: return '#7f8c8d';
    }
  };

  return (
    <div style={{ backgroundColor: '#faf6f0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar user={user} onLogout={handleLogout} />

      <div style={{ flex: 1, padding: '40px 8%', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ color: '#2b1e17', marginBottom: '30px', textAlign: 'center' }}>Lịch sử đơn hàng của bạn</h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#d4883b' }}>Đang tải lịch sử...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '18px', color: '#777' }}>Bạn chưa có đơn hàng nào.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {orders.map(order => (
              <div key={order.id} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '25px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f5f5f5', paddingBottom: '15px', marginBottom: '15px' }}>
                  <div>
                    <span style={{ fontSize: '14px', color: '#888' }}>Mã đơn hàng:</span>
                    <strong style={{ marginLeft: '8px', color: '#2b1e17' }}>#{order.id.slice(-8).toUpperCase()}</strong>
                  </div>
                  <div style={{
                    backgroundColor: getStatusColor(order.status) + '15',
                    color: getStatusColor(order.status),
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    border: `1px solid ${getStatusColor(order.status)}30`
                  }}>
                    {order.status}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {order.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '45px', height: '45px', borderRadius: '8px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🍰</div>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: '500', color: '#333' }}>{item.cake.name}</div>
                          <div style={{ fontSize: '13px', color: '#888' }}>Số lượng: {item.quantity}</div>
                        </div>
                      </div>
                      <span style={{ fontWeight: '500', color: '#555' }}>{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '13px', color: '#888' }}>
                    Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                  <div>
                    <span style={{ fontSize: '14px', color: '#555', marginRight: '10px' }}>Tổng cộng:</span>
                    <strong style={{ fontSize: '20px', color: '#d4883b' }}>{new Intl.NumberFormat('vi-VN').format(order.totalPrice)}đ</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default OrderHistory;
