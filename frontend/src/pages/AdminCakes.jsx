import { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';

function AdminCakes() {
  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStock, setFilterStock] = useState('ALL'); 
  const [filterBestseller, setFilterBestseller] = useState('ALL');
  // Form thêm bánh
  const [newCake, setNewCake] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    bestseller: false
  });
  const [imageFile, setImageFile] = useState(null);

  // State quản lý Edit Modal
  const [editingCake, setEditingCake] = useState(null); // Bánh đang được sửa
  const [editImageFile, setEditImageFile] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCakes();
    fetchCategories();
  }, []);

  const fetchCakes = async () => {
    try {
      const res = await api.get('/cakes');
      setCakes(res.data);
    } catch (err) {
      console.error('Lỗi lấy danh sách bánh:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Lỗi lấy danh mục:', err);
    }
  };

  const filteredCakes = useMemo(() => {
    return cakes.filter(cake => {
      // Tìm theo tên
      const matchesSearch = cake.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Lọc theo danh mục
      const cakeCatId = cake.categoryId || cake.category?.id || cake.category?._id;
      const matchesCategory = filterCategory === '' || String(cakeCatId) === String(filterCategory);

      // Lọc theo tồn kho
      let matchesStock = true;
      if (filterStock === 'LOW_STOCK') matchesStock = cake.stock > 0 && cake.stock <= 5;
      if (filterStock === 'OUT_OF_STOCK') matchesStock = cake.stock === 0;

      // Lọc Bestseller
      let matchesBestseller = true;
      if (filterBestseller === 'YES') matchesBestseller = cake.bestseller === true;

      return matchesSearch && matchesCategory && matchesStock && matchesBestseller;
    });
  }, [cakes, searchTerm, filterCategory, filterStock, filterBestseller]);

  // --- XỬ LÝ THÊM BÁNH ---
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'image') {
      setImageFile(files[0]);
    } else {
      setNewCake({
        ...newCake,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', newCake.name);
      formData.append('price', newCake.price);
      formData.append('stock', newCake.stock);
      formData.append('categoryId', newCake.categoryId);
      formData.append('description', newCake.description);
      formData.append('bestseller', newCake.bestseller);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await api.post('/cakes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Thêm bánh thành công!');
      setNewCake({ name: '', description: '', price: '', stock: '', categoryId: '', image: '', bestseller: false });
      setImageFile(null);
      fetchCakes();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi thêm bánh');
      console.log("Lỗi khi thêm bánh:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- XỬ LÝ CHỈNH SỬA BÁNH ---
  const handleEditClick = (cake) => {
    setEditingCake({
      id: cake.id || cake._id,
      name: cake.name || '',
      description: cake.description || '',
      price: cake.price || '',
      stock: cake.stock || '',
      categoryId: cake.categoryId || cake.category?.id || '',
      bestseller: cake.bestseller || false,
      image: cake.image
    });
    setEditImageFile(null);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'image') {
      setEditImageFile(files[0]);
    } else {
      setEditingCake({
        ...editingCake,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', editingCake.name);
      formData.append('price', editingCake.price);
      formData.append('stock', editingCake.stock);
      formData.append('categoryId', editingCake.categoryId);
      formData.append('description', editingCake.description);
      formData.append('bestseller', editingCake.bestseller);
      if (editImageFile) {
        formData.append('image', editImageFile);
      }

      await api.put(`/cakes/${editingCake.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Cập nhật bánh thành công!');
      setEditingCake(null);
      fetchCakes();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi cập nhật bánh');
    } finally {
      setLoading(false);
    }
  };

  // --- XỬ LÝ XÓA BÁNH ---
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bánh này?')) {
      try {
        await api.delete(`/cakes/${id}`);
        fetchCakes();
      } catch (err) {
        alert('Lỗi khi xóa bánh');
      }
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '30px', alignItems: 'start' }}>
      {/* Form thêm bánh */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#2b1e17' }}>✨ Thêm Bánh Mới</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '5px' }}>Tên sản phẩm</label>
            <input type="text" name="name" placeholder="Ví dụ: Bánh Mousse Dâu" value={newCake.name} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '5px' }}>Giá tiền (VND)</label>
              <input type="number" name="price" placeholder="50000" value={newCake.price} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '5px' }}>Số lượng kho</label>
              <input type="number" name="stock" placeholder="10" value={newCake.stock} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '5px' }}>Danh mục</label>
            <select name="categoryId" value={newCake.categoryId} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', appearance: 'none', background: '#fff' }}>
              <option value="">-- Chọn danh mục --</option>
              {categories.map(cat => (
                <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '5px' }}>Hình ảnh sản phẩm</label>
            <input type="file" name="image" accept="image/*" onChange={handleInputChange} style={{ width: '100%', padding: '8px', border: '1px dashed #ccc', borderRadius: '8px' }} />
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '5px' }}>Mô tả sản phẩm</label>
            <textarea name="description" placeholder="Nhập mô tả ngắn về bánh..." value={newCake.description} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', height: '80px', boxSizing: 'border-box', resize: 'none' }}></textarea>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
            <input type="checkbox" name="bestseller" checked={newCake.bestseller} onChange={handleInputChange} style={{ width: '18px', height: '18px' }} />
            <span>Đánh dấu là sản phẩm bán chạy</span>
          </label>

          <button type="submit" disabled={loading} style={{ marginTop: '10px', padding: '15px', backgroundColor: '#d4883b', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
            {loading ? '⏳ Đang xử lý...' : '➕ Thêm Vào Cửa Hàng'}
          </button>
        </form>
      </div>

      {/* Danh sách bánh */}
      <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: 'fit-content' }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#2b1e17' }}>🍱 Danh Sách Bánh ({filteredCakes.length}/{cakes.length})</h3>

        {/* thanh bộ lọc */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10px', marginBottom: '20px', background: '#fcf8f5', padding: '12px', borderRadius: '10px', border: '1px solid #f0e6dd' }}>
          <input
            type="text"
            placeholder="🔍 Tìm theo tên bánh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
          />
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}>
            <option value="">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</option>
            ))}
          </select>
          <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}>
            <option value="ALL">Tất cả kho</option>
            <option value="LOW_STOCK">Sắp hết (≤ 5)</option>
            <option value="OUT_OF_STOCK">Hết hàng (0)</option>
          </select>
          <select value={filterBestseller} onChange={(e) => setFilterBestseller(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}>
            <option value="ALL">Tất cả loại</option>
            <option value="YES">🔥 Bán chạy</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto', maxHeight: '580px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, boxShadow: '0 2px 2px -1px rgba(0,0,0,0.05)' }}>
              <tr style={{ borderBottom: '2px solid #f5f5f5', color: '#888', fontSize: '13px' }}>
                <th style={{ padding: '10px' }}>Sản phẩm</th>
                <th style={{ padding: '10px' }}>Giá</th>
                <th style={{ padding: '10px' }}>Kho</th>
                <th style={{ padding: '10px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredCakes.length > 0 ? (
                filteredCakes.map(cake => (
                  <tr key={cake.id || cake._id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                    <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={cake.image || 'https://via.placeholder.com/40'} alt="" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: '500', color: '#333', fontSize: '14px' }}>
                          {cake.name} {cake.bestseller && <span title="Bán chạy">🔥</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '10px', color: '#d4883b', fontWeight: 'bold', fontSize: '14px' }}>
                      {new Intl.NumberFormat('vi-VN').format(cake.price)}đ
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '10px', backgroundColor: cake.stock < 5 ? '#fff3f3' : '#f0f9f4', color: cake.stock < 5 ? '#e74c3c' : '#27ae60', fontSize: '12px', fontWeight: 'bold' }}>
                        {cake.stock} chiếc
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleEditClick(cake)} style={{ padding: '5px 10px', color: '#2980b9', border: '1px solid #e1f0fa', backgroundColor: '#f0f8ff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                          ✏️ Sửa
                        </button>
                        <button onClick={() => handleDelete(cake.id || cake._id)} style={{ padding: '5px 10px', color: '#e74c3c', border: '1px solid #ffecec', backgroundColor: '#fff5f5', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                    Không tìm thấy sản phẩm nào khớp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL EDIT BÁNH */}
      {editingCake && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', width: '500px', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#2b1e17' }}>✏️ Chỉnh Sửa Bánh</h3>
              <button onClick={() => setEditingCake(null)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✖</button>
            </div>

            <form onSubmit={handleUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '5px' }}>Tên sản phẩm</label>
                <input type="text" name="name" value={editingCake.name} onChange={handleEditChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '5px' }}>Giá tiền (VND)</label>
                  <input type="number" name="price" value={editingCake.price} onChange={handleEditChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '5px' }}>Số lượng kho</label>
                  <input type="number" name="stock" value={editingCake.stock} onChange={handleEditChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '5px' }}>Danh mục</label>
                <select name="categoryId" value={editingCake.categoryId} onChange={handleEditChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', appearance: 'none', background: '#fff' }}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(cat => (
                    <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '5px' }}>Hình ảnh hiện tại / Thay ảnh mới</label>
                {editingCake.image && !editImageFile && (
                  <img src={editingCake.image} alt="Current" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', marginBottom: '8px', display: 'block' }} />
                )}
                <input type="file" name="image" accept="image/*" onChange={handleEditChange} style={{ width: '100%', padding: '8px', border: '1px dashed #ccc', borderRadius: '8px' }} />
              </div>

              <div>
                <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '5px' }}>Mô tả sản phẩm</label>
                <textarea name="description" value={editingCake.description} onChange={handleEditChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', height: '80px', boxSizing: 'border-box', resize: 'none' }}></textarea>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
                <input type="checkbox" name="bestseller" checked={editingCake.bestseller} onChange={handleEditChange} style={{ width: '18px', height: '18px' }} />
                <span>Đánh dấu là sản phẩm bán chạy</span>
              </label>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setEditingCake(null)} style={{ flex: 1, padding: '12px', backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Hủy
                </button>
                <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>
                  {loading ? '⏳ Đang lưu...' : '💾 Cập Nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCakes;