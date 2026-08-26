function Footer() {
  return (
    <footer style={{ backgroundColor: '#2b1e17', color: '#dedede', padding: '40px 8% 20px', marginTop: '40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', marginBottom: '30px' }}>
        <div>
          <h4 style={{ color: '#fff', fontSize: '18px', margin: '0 0 15px 0' }}>🍪 Phenikaa Cake</h4>
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#aaa' }}>
            Phenikaa Cake tự hào là tiệm bánh online mang đến những sản phẩm ngọt ngào, chất lượng cao và an toàn sức khỏe cho mọi người Việt.
          </p>
        </div>
        <div>
          <h4 style={{ color: '#fff', fontSize: '15px', margin: '0 0 15px 0' }}>Liên Kết Nhanh</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', lineHeight: '2' }}>
            <li>Trang chủ</li>
            <li>Sản phẩm bánh ngọt</li>
            <li>Chính sách giao hàng</li>
            <li>Tuyển dụng làm bánh</li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: '#fff', fontSize: '15px', margin: '0 0 15px 0' }}>Thông Tin Liên Hệ</h4>
          <p style={{ fontSize: '13px', lineHeight: '1.8', margin: 0 }}>
            Điện thoại: 1900 6789 - 0988 123 456<br />
            Email: cskh@sweetdelight.vn<br />
            Địa chỉ xưởng bánh: Trường đại học Phenikaa
          </p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #44352d', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
        <span>© 2026 Phenikaa Cake. Tất cả quyền được bảo lưu.</span>
        <div>
          <span style={{ marginRight: '15px' }}>Chính sách bảo mật</span>
          <span>Điều khoản dịch vụ</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
