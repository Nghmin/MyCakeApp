import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function OrderHistory({ isEmbedded = false }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States cho Bộ lọc
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterDate, setFilterDate] = useState('ALL'); // ALL, TODAY, 7_DAYS, 30_DAYS

  const user = JSON.parse(localStorage.getItem('user'));

  const statusTabs = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PENDING', label: 'Chờ xác nhận' },
    { key: 'CONFIRMED', label: 'Đã xác nhận' },
    { key: 'SHIPPING', label: 'Đang giao' },
    { key: 'DELIVERED', label: 'Hoàn thành' },
    { key: 'CANCELLED', label: 'Đã hủy' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, filterDate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'ALL') params.append('status', filterStatus);
      if (filterDate !== 'ALL') params.append('dateRange', filterDate);

      const res = await api.get(`/orders/my?${params.toString()}`);
      setOrders(res.data);
    } catch (err) {
      console.error('Lỗi lấy lịch sử đơn hàng', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Hàm xử lý Hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?');
    if (!confirmCancel) return;

    try {
      await api.put(`/orders/my/${orderId}/cancel`);
      alert('Đã hủy đơn hàng thành công!');
      fetchOrders(); // Reload danh sách sau khi hủy
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn');
      console.log('Lỗi khi hủy đơn hàng:', err);
    }
  };

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

  const content = (
    <div style={{ flex: 1, padding: isEmbedded ? '0' : '40px 8%', maxWidth: isEmbedded ? 'none' : '900px', margin: isEmbedded ? '0' : '0 auto', width: '100%' }}>
      {!isEmbedded && <h1 style={{ color: '#2b1e17', marginBottom: '20px', textAlign: 'center' }}>Lịch sử đơn hàng của bạn</h1>}

      {/* FRAME BỘ LỌC TRẠNG THÁI & THỜI GIAN */}
      <div style={{ backgroundColor: '#fff', padding: '15px 20px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        
        {/* Tab trạng thái */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: '0.2s',
                backgroundColor: filterStatus === tab.key ? '#2b1e17' : '#f0f0f0',
                color: filterStatus === tab.key ? '#fff' : '#555',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lọc theo Thời gian */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Thời gian:</span>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer',
              backgroundColor: '#fff'
            }}
          >
            <option value="ALL">Tất cả thời gian</option>
            <option value="TODAY">Hôm nay</option>
            <option value="7_DAYS">7 ngày gần đây</option>
            <option value="30_DAYS">30 ngày gần đây</option>
          </select>
        </div>

      </div>

      {/* DANH SÁCH ĐƠN HÀNG */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#d4883b' }}>⏳ Đang tải lịch sử...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: isEmbedded ? 'none' : '0 2px 10px rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize: '16px', color: '#777' }}>Không tìm thấy đơn hàng nào phù hợp với bộ lọc.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order.id} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '20px 25px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f5f5f5', paddingBottom: '12px', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '13px', color: '#888' }}>Mã đơn hàng:</span>
                  <strong style={{ marginLeft: '8px', color: '#2b1e17' }}>
                    DH{String(order.id).padStart(6, '0')}
                  </strong>
                </div>
                <div style={{
                  backgroundColor: getStatusColor(order.status) + '15',
                  color: getStatusColor(order.status),
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  border: `1px solid ${getStatusColor(order.status)}30`
                }}>
                  {order.status}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {order.items?.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img
                        src={item.cake?.image || '/default-cake.png'}
                        alt={item.cake?.name}
                        style={{ width: '55px', height: '55px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #eee' }}
                      />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{item.cake?.name}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>Số lượng: {item.quantity}</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: '500', color: '#555', fontSize: '14px' }}>
                      {new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ
                    </span>
                  </div>
                ))}
              </div>

              {/* PHẦN CHÂN ĐƠN HÀNG: HIỂN THỊ TỔNG TIỀN VÀ NÚT HỦY ĐƠN */}
              <div style={{ marginTop: '15px', paddingTop: '12px', borderTop: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div>
                    <span style={{ fontSize: '13px', color: '#555', marginRight: '8px' }}>Tổng cộng:</span>
                    <strong style={{ fontSize: '18px', color: '#d4883b' }}>{new Intl.NumberFormat('vi-VN').format(order.totalPrice)}đ</strong>
                  </div>

                  {/* Nút Hủy đơn chỉ hiển thị khi đơn ở trạng thái PENDING */}
                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      style={{
                        backgroundColor: '#fff',
                        color: '#e74c3c',
                        border: '1px solid #e74c3c',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        transition: '0.2s'
                      }}
                      onMouseOver={(e) => { e.target.style.backgroundColor = '#e74c3c'; e.target.style.color = '#fff'; }}
                      onMouseOut={(e) => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#e74c3c'; }}
                    >
                      Hủy đơn
                    </button>
                  )}

                  {/* Thông báo liên hệ Hotline khi đơn đã được duyệt hoặc đang giao */}
                  {(order.status === 'CONFIRMED' || order.status === 'SHIPPING') && (
                    <span style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>
                      📞 Cần hỗ trợ hủy/đổi đơn? Gọi <strong>09xx-xxx-xxx</strong>
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (isEmbedded) return content;

  return (
    <div style={{ backgroundColor: '#faf6f0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar user={user} onLogout={handleLogout} />
      {content}
      <Footer />
    </div>
  );
}

export default OrderHistory;