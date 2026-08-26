import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const token = userData.token;

      const res = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      console.log("Thông tin cá nhân đã được tải:", res.data);
      setLoading(false);
    } catch (error) {
      toast.error('Không thể tải thông tin cá nhân');
      console.error('Lỗi khi lấy thông tin cá nhân:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/auth/profile', user, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
      console.error('Lỗi khi cập nhật thông tin cá nhân:', error);
    }
  };

  if (loading) return <div className="text-center mt-10">Đang tải...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-pink-600">Thông tin cá nhân</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Họ và tên</label>
          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Email (Không thể thay đổi)</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-gray-700">Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={user.phone || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>
        <div>
          <label className="block text-gray-700">Địa chỉ giao hàng</label>
          <textarea
            name="address"
            value={user.address || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            rows="3"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
        >
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
