import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import ProfilePage from './pages/ProfilePage';

// Component bảo vệ Route Admin
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // Kiểm tra chính xác quyền ADMIN
  if (!user || user.role !== 'ADMIN') {
    alert("Bạn không có quyền truy cập trang này!");
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <Router>
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        {/* Các trang chức năng */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Route bảo vệ dành riêng cho Admin */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;