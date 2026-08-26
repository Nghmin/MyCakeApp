import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);

      // Lưu thông tin user và token vào localStorage
      const userData = {
        token: response.data.token,
        ...response.data.user
      };
      localStorage.setItem('user', JSON.stringify(userData));
      console.log("Thông tin user đã lưu vào localStorage:", userData.token);
      alert(`Đăng nhập thành công! Chào ${userData.fullName}`);

      // Chuyển hướng dựa trên role
      if (userData.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }

      // Reload lại trang để update Navbar (cách đơn giản nhất khi chưa dùng Context)
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#faf6f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '450px', width: '100%', backgroundColor: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#d4883b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '30px' }}>
            🍰
          </div>
          <h2 style={{ margin: 0, fontSize: '28px', color: '#2b1e17' }}>Chào mừng trở lại!</h2>
          <p style={{ color: '#888', marginTop: '10px' }}>Vui lòng đăng nhập để tiếp tục mua sắm</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fff5f5', color: '#e74c3c', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', border: '1px solid #ffecec' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '8px' }}>Địa chỉ Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ten@example.com"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }}
              required
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#555' }}>Mật khẩu</label>
              <span style={{ fontSize: '13px', color: '#d4883b', cursor: 'pointer' }}>Quên mật khẩu?</span>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#2b1e17',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '10px',
              transition: 'background 0.3s'
            }}
          >
            {loading ? '⏳ ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '25px' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Chưa có tài khoản?{' '}
            <span
              style={{ color: '#d4883b', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => navigate('/register')}
            >
              Tạo tài khoản mới
            </span>
          </p>

          <div
            onClick={() => navigate('/')}
            style={{ marginTop: '20px', color: '#aaa', cursor: 'pointer', fontSize: '13px' }}
          >
            ← Quay lại trang chủ
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
