import React from 'react';

const DEFAULT_CAKE_IMAGE = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80';

function CakeCard({ cake, onAddToCart }) {
  if (!cake) return null;

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative' }}>
        <img
          src={cake.image || DEFAULT_CAKE_IMAGE}
          alt={cake.name}
          style={{ width: '100%', height: '180px', objectFit: 'cover' }}
        />
        {cake.tag && (
          <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#d4883b', color: '#fff', fontSize: '10px', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
            {cake.tag}
          </span>
        )}
      </div>

      <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#2b1e17' }}>{cake.name}</h3>
          <p style={{ color: '#777', fontSize: '12px', height: '36px', overflow: 'hidden', margin: '0 0 15px 0', lineHeight: '1.4' }}>
            {cake.description || 'Hương vị thơm ngon đặc trưng được chế biến tươi mới hàng ngày.'}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#d4883b', fontWeight: 'bold', fontSize: '16px' }}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cake.price)}
          </span>
          <button
            onClick={() => onAddToCart && onAddToCart(cake)}
            style={{ backgroundColor: '#2b1e17', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
          >
            🛒 Chọn mua
          </button>
        </div>
      </div>
    </div>
  );
}

export default CakeCard;