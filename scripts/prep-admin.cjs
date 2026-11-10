// scripts/prep-admin.cjs
// Chạy sau khi `vite build` → copy dist/admin.html thành dist/index.html
// Dùng cho Netlify Site 2 (Admin CMS) để serve admin.html ở root
const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const adminSrc = path.join(distDir, 'admin.html');
const indexDest = path.join(distDir, 'index.html');

if (!fs.existsSync(adminSrc)) {
  console.error('❌ dist/admin.html không tồn tại. Hãy chạy npm run build trước.');
  process.exit(1);
}

fs.copyFileSync(adminSrc, indexDest);
console.log('✅ Admin site ready: dist/admin.html → dist/index.html');
