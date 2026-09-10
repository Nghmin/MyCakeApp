import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,

      // Hàm đăng nhập: Lưu user vào store và tự động vào localStorage (nhờ persist)
      login: (userData) => {
        // Xử lý trường hợp backend trả về { user, token } hoặc chỉ user
        const user = userData.user || userData;
        set({ user });
      },

      // Hàm đăng xuất: Xóa user khỏi store và localStorage
      logout: () => {
        set({ user: null });
        localStorage.removeItem('user'); // Đảm bảo xóa sạch cả key cũ
        window.location.href = '/login';
      },
    }),
    {
      name: 'user', // Tên key trong localStorage
    }
  )
);

export default useAuthStore;
