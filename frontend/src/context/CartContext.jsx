import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Tải giỏ hàng từ LocalStorage khi khởi chạy
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Lưu vào LocalStorage mỗi khi giỏ hàng thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Thêm bánh vào giỏ
  const addToCart = (cake) => {
    setCartItems((prevItems) => {
      const isExist = prevItems.find((item) => item.id === cake.id);
      if (isExist) {
        return prevItems.map((item) =>
          item.id === cake.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...cake, quantity: 1 }];
    });
    alert(`Đã thêm ${cake.name} vào giỏ hàng!`);
  };

  // Xóa bánh khỏi giỏ
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Cập nhật số lượng
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Xóa sạch giỏ hàng (khi đặt hàng xong)
  const clearCart = () => {
    setCartItems([]);
  };

  // Tính tổng tiền
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
