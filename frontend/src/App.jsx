import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Cart from './pages/Cart';

// Helper để lấy user từ localStorage
const getAuthUser = () => {
  const authData = JSON.parse(localStorage.getItem('user'));
  return authData?.user || authData;
};

// Component bảo vệ Route Admin
const AdminRoute = ({ children }) => {
  const user = getAuthUser();
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" />;
  }
  return children;
};

// Component bảo vệ Route User
const UserRoute = ({ children }) => {
  const user = getAuthUser();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const user = getAuthUser();

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <Router>
      <Routes>
        {/* Trang công khai */}
        <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />

        {/* Chuyển hướng các đường dẫn cũ về Dashboard tương ứng */}
        <Route
          path="/profile"
          element={
            user?.role === 'ADMIN'
              ? <Navigate to="/admin?tab=UserInfo" />
              : <Navigate to="/user?tab=UserInfo" />
          }
        />
        <Route
          path="/orders"
          element={
            user?.role === 'ADMIN'
              ? <Navigate to="/admin?tab=orders" />
              : <Navigate to="/user?tab=OrderHistory" />
          }
        />

        {/* Dashboard cho User */}
        <Route
          path="/user"
          element={
            <UserRoute>
              <UserDashboard />
            </UserRoute>
          }
        />

        {/* Dashboard cho Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Fallback - Nếu vào link không tồn tại */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
