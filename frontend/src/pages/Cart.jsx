import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleCheckout = async () => {
    // ... logic checkout ...
    if (!user) {
      alert('Vui lòng đăng nhập để đặt hàng');
      return navigate('/login');
    }

    if (cartItems.length === 0) return alert('Giỏ hàng trống');

    try {
      const orderData = {
        address: user.address || 'Địa chỉ mặc định',
        phone: user.phone || '0000000000',
        items: cartItems.map(item => ({
          cakeId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      await api.post('/orders', orderData);
      alert('Đặt hàng thành công!');
      clearCart();
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi đặt hàng');
    }
  };

  return (
    <div style={{ backgroundColor: '#faf6f0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar user={user} onLogout={handleLogout} />

      <div style={{ flex: 1, padding: '40px 8%' }}>
        <h1 style={{ color: '#2b1e17', marginBottom: '30px' }}>Giỏ hàng của bạn</h1>
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '18px', color: '#777' }}>Giỏ hàng đang trống.</p>
            <button
              onClick={() => navigate('/')}
              style={{ marginTop: '20px', padding: '10px 25px', backgroundColor: '#d4883b', color: '#fff', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f5f5f5', color: '#888', fontSize: '14px' }}>
                    <th style={{ textAlign: 'left', padding: '15px 10px' }}>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Tổng</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                      <td style={{ padding: '20px 10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <img src={item.image || 'https://via.placeholder.com/60'} alt="" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#2b1e17', fontSize: '16px' }}>{item.name}</div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', color: '#555' }}>{new Intl.NumberFormat('vi-VN').format(item.price)}đ</td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '20px', overflow: 'hidden' }}>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{ padding: '5px 12px', border: 'none', background: 'none', cursor: 'pointer' }}
                          >-</button>
                          <span style={{ width: '30px', textAlign: 'center', fontSize: '14px' }}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{ padding: '5px 12px', border: 'none', background: 'none', cursor: 'pointer' }}
                          >+</button>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#d4883b' }}>{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{ color: '#e74c3c', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}
                          title="Xóa khỏi giỏ hàng"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ height: 'fit-content' }}>
              <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>Tóm tắt đơn hàng</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#555' }}>
                  <span>Tạm tính:</span>
                  <span>{new Intl.NumberFormat('vi-VN').format(totalPrice)}đ</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#555' }}>
                  <span>Phí vận chuyển:</span>
                  <span style={{ color: '#27ae60' }}>Miễn phí</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #eee', fontWeight: 'bold', fontSize: '20px', color: '#2b1e17' }}>
                  <span>Tổng cộng:</span>
                  <span style={{ color: '#d4883b' }}>{new Intl.NumberFormat('vi-VN').format(totalPrice)}đ</span>
                </div>
                <button
                  onClick={handleCheckout}
                  style={{ width: '100%', marginTop: '30px', padding: '15px', backgroundColor: '#2b1e17', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                >
                  THANH TOÁN NGAY
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Cart;
