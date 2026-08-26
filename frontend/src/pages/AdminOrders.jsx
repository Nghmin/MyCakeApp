import { useEffect, useState } from 'react';
import api from '../api/axios';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusOptions = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Lỗi lấy danh sách đơn hàng', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      alert('Cập nhật trạng thái thành công');
      fetchOrders();
    } catch (err) {
      alert('Lỗi khi cập nhật trạng thái');
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

  if (loading) return <div style={{ padding: '20px' }}>Đang tải danh sách đơn hàng...</div>;

  return (
    <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#2b1e17' }}>📋 Quản Lý Đơn Hàng ({orders.length})</h3>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Chưa có đơn hàng nào được đặt.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f5f5f5', color: '#888', fontSize: '14px' }}>
                <th style={{ padding: '15px 12px' }}>Mã Đơn</th>
                <th style={{ padding: '15px 12px' }}>Khách Hàng</th>
                <th style={{ padding: '15px 12px' }}>Sản Phẩm</th>
                <th style={{ padding: '15px 12px' }}>Tổng Tiền</th>
                <th style={{ padding: '15px 12px' }}>Trạng Thái</th>
                <th style={{ padding: '15px 12px' }}>Cập Nhật</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid #f9f9f9', fontSize: '14px' }}>
                  <td style={{ padding: '15px 12px' }}>
                    {/* SỬA LỖI Ở ĐÂY: Ép kiểu ID sang String trước khi định dạng */}
                    <span style={{ fontWeight: 'bold', color: '#2b1e17' }}>
                      #{String(order.id).padStart(6, '0')}
                    </span>
                    <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td style={{ padding: '15px 12px' }}>
                    <div style={{ fontWeight: '600' }}>{order.user?.fullName || 'Khách ẩn danh'}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>📞 {order.phone}</div>
                    <div style={{ fontSize: '12px', color: '#888', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={order.address}>
                      📍 {order.address}
                    </div>
                  </td>
                  <td style={{ padding: '15px 12px' }}>
                    {order.items?.map(item => (
                      <div key={item.id} style={{ fontSize: '12px', color: '#555', marginBottom: '2px' }}>
                        • {item.cake?.name} <span style={{ color: '#aaa' }}>x{item.quantity}</span>
                      </div>
                    ))}
                  </td>
                  <td style={{ padding: '15px 12px', fontWeight: 'bold', color: '#d4883b' }}>
                    {new Intl.NumberFormat('vi-VN').format(order.totalPrice)}đ
                  </td>
                  <td style={{ padding: '15px 12px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      backgroundColor: getStatusColor(order.status)
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px 12px' }}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        backgroundColor: '#fff',
                        fontSize: '12px',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;