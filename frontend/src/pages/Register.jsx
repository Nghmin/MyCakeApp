import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    if (formData.password !== formData.confirmPassword) {
      return setErrors((prev) => ({
        ...prev,
        confirmPassword: 'Mật khẩu xác nhận không khớp'
      }));
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address
      });

      alert(response.data.message || 'Đăng ký thành công!');
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setGeneralError(err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký');
      }
      console.error('Lỗi khi đăng ký:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#faf6f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: '500px', width: '100%', backgroundColor: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#d4883b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '30px' }}>
            🍰
          </div>
          <h2 style={{ margin: 0, fontSize: '28px', color: '#2b1e17' }}>Tham gia cùng chúng tôi</h2>
          <p style={{ color: '#888', marginTop: '10px' }}>Tạo tài khoản để nhận nhiều ưu đãi từ Phenikaa Cake</p>
        </div>

        {/* Lỗi chung từ hệ thống nếu có */}
        {generalError && (
          <div style={{ backgroundColor: '#fff5f5', color: '#e74c3c', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', border: '1px solid #ffecec' }}>
            ⚠️ {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {/* Họ và tên */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#555', marginBottom: '6px' }}>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: errors.fullName ? '1px solid #e74c3c' : '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
              />
              {errors.fullName && <span style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.fullName}</span>}
            </div>

            {/* Số điện thoại */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#555', marginBottom: '6px' }}>Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0912xxxxxx"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: errors.phone ? '1px solid #e74c3c' : '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
              />
              {errors.phone && <span style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.phone}</span>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#555', marginBottom: '6px' }}>Địa chỉ Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ten@example.com"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: errors.email ? '1px solid #e74c3c' : '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
            />
            {errors.email && <span style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
          </div>

          {/* Địa chỉ */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#555', marginBottom: '6px' }}>Địa chỉ giao hàng</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Số nhà, Tên đường, Quận/Huyện..."
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: errors.address ? '1px solid #e74c3c' : '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
            />
            {errors.address && <span style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.address}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {/* Mật khẩu */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#555', marginBottom: '6px' }}>Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: errors.password ? '1px solid #e74c3c' : '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
              />
              {errors.password && <span style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.password}</span>}
            </div>

            {/* Xác nhận mật khẩu */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#555', marginBottom: '6px' }}>Xác nhận</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: errors.confirmPassword ? '1px solid #e74c3c' : '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
              />
              {errors.confirmPassword && <span style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.confirmPassword}</span>}
            </div>
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
            {loading ? '⏳ ĐANG TẠO TÀI KHOẢN...' : 'ĐĂNG KÝ NGAY'}
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '25px' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Đã có tài khoản?{' '}
            <span
              style={{ color: '#d4883b', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => navigate('/login')}
            >
              Đăng nhập tại đây
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
