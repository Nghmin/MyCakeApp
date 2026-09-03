import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { DEFAULT_AVATAR } from '../utils/constants';

const ProfilePage = ({ type = 'full' }) => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    role: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      setUser(res.data);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin cá nhân:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', user);
      alert('Cập nhật thông tin thành công!');
      // Cập nhật lại localStorage để Navbar đồng bộ
      const authData = JSON.parse(localStorage.getItem('user'));
      if (authData.user) {
        authData.user = { ...authData.user, ...user };
      } else {
        Object.assign(authData, user);
      }
      localStorage.setItem('user', JSON.stringify(authData));
    } catch (error) {
      alert(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>⏳ Đang tải thông tin...</div>;

  // Render phần tóm tắt (Cột trái)
  if (type === 'summary') {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
          <img
            src={user.role === 'ADMIN' ? DEFAULT_AVATAR.ADMIN : DEFAULT_AVATAR.USER}
            alt="Avatar"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '5px solid #fdf6ed',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '5px',
            right: '5px',
            backgroundColor: '#d4883b',
            color: '#fff',
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid #fff',
            fontSize: '14px'
          }}>
            📸
          </div>
        </div>
        <h2 style={{ margin: '0 0 5px 0', color: '#2b1e17', fontSize: '22px' }}>{user.fullName || 'Thành viên'}</h2>
        <p style={{ color: '#888', fontSize: '14px', margin: '0 0 20px 0' }}>{user.email}</p>

        <div style={{ textAlign: 'left', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '12px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Vai trò</label>
            <div style={{ fontWeight: 'bold', color: '#d4883b' }}>{user.role === 'ADMIN' ? '🛡️ Quản trị viên' : '👤 Khách hàng'}</div>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '12px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Ngày tham gia</label>
            <div style={{ fontWeight: '500', color: '#555' }}>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</div>
          </div>
        </div>
      </div>
    );
  }

  // Render phần Form (Cột phải)
  return (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: '25px', color: '#2b1e17', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ backgroundColor: '#fdf6ed', padding: '8px', borderRadius: '8px' }}>📝</span>
        Chỉnh sửa thông tin cá nhân
      </h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '8px', fontWeight: '500' }}>Họ và tên</label>
            <input
              type="text" name="fullName" value={user.fullName} onChange={handleChange} required
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #eee', backgroundColor: '#f9f9f9', boxSizing: 'border-box', outline: 'none', transition: '0.3s' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '8px', fontWeight: '500' }}>Số điện thoại</label>
            <input
              type="text" name="phone" value={user.phone || ''} onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #eee', backgroundColor: '#f9f9f9', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email (Cố định)</label>
          <input
            type="email" value={user.email} disabled
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #eee', backgroundColor: '#eee', color: '#888', boxSizing: 'border-box', cursor: 'not-allowed' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '8px', fontWeight: '500' }}>Địa chỉ giao hàng</label>
          <textarea
            name="address" value={user.address || ''} onChange={handleChange}
            placeholder="Nhập địa chỉ nhận bánh của bạn..."
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #eee', backgroundColor: '#f9f9f9', height: '100px', boxSizing: 'border-box', resize: 'none', outline: 'none' }}
          ></textarea>
        </div>

        <button
          type="submit" disabled={saving}
          style={{
            marginTop: '10px',
            padding: '16px',
            backgroundColor: '#2b1e17',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            boxShadow: '0 4px 12px rgba(43, 30, 23, 0.2)',
            transition: '0.3s'
          }}
        >
          {saving ? '⏳ Đang lưu...' : '✅ Cập nhật thay đổi'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
