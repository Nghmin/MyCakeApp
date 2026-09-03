import { useEffect, useState } from 'react';
import api from '../api/axios';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  const [filterDate, setFilterDate] = useState('ALL'); // ALL, TODAY, 7_DAYS, 30_DAYS

  const statusOptions = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED'];

  const statusTabs = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PENDING', label: 'Chờ xác nhận' },
    { key: 'CONFIRMED', label: 'Đã xác nhận' },
    { key: 'SHIPPING', label: 'Đang giao' },
    { key: 'DELIVERED', label: 'Hoàn thành' },
    { key: 'CANCELLED', label: 'Đã hủy' }
  ];

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, filterDate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'ALL') params.append('status', filterStatus);
      if (filterDate !== 'ALL') params.append('dateRange', filterDate);

      const res = await api.get(`/orders?${params.toString()}`);
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

  return (
    <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      {/* Tiêu đề & Các Bộ Lọc */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h3 style={{ margin: 0, color: '#2b1e17' }}>📋 Quản Lý Đơn Hàng ({orders.length})</h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Lọc theo thời gian */}
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '12px',
              fontWeight: '600',
              outline: 'none',
              cursor: 'pointer',
              backgroundColor: '#f8f9fa',
              color: '#333'
            }}
          >
            <option value="ALL">🗓️ Tất cả thời gian</option>
            <option value="TODAY">📅 Đơn Hôm nay</option>
            <option value="7_DAYS">📆 7 ngày qua</option>
            <option value="30_DAYS">🗓️ 30 ngày qua</option>
          </select>

          {/* Thanh Tab Lọc Trạng Thái */}
          <div style={{ display: 'flex', gap: '4px', background: '#f8f9fa', padding: '4px', borderRadius: '10px', overflowX: 'auto' }}>
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: '0.2s',
                  backgroundColor: filterStatus === tab.key ? '#2b1e17' : 'transparent',
                  color: filterStatus === tab.key ? '#fff' : '#666'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>⏳ Đang tải danh sách đơn hàng...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Không có đơn hàng nào khớp với điều kiện lọc.</div>
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
                <th style={{ padding: '15px 12px' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid #f9f9f9', fontSize: '14px' }}>
                  <td style={{ padding: '15px 12px' }}>
                    <span style={{ fontWeight: 'bold', color: '#2b1e17' }}>
                      DH{String(order.id).padStart(6, '0')}
                    </span>
                    <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>
                      {new Date(order.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {/* Nút duyệt nhanh cho đơn PENDING */}
                      {order.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => handleStatusChange(order.id, 'CONFIRMED')}
                            style={{ padding: '4px 8px', backgroundColor: '#27ae60', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                          >
                            ✓ Duyệt
                          </button>
                          <button
                            onClick={() => handleStatusChange(order.id, 'CANCELLED')}
                            style={{ padding: '4px 8px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                          >
                            ✕ Hủy
                          </button>
                        </div>
                      )}

                      {/* Dropdown thay đổi linh hoạt */}
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        style={{
                          padding: '5px 8px',
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
                    </div>
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