import React, { useState } from 'react';
import { useSiteData } from './context/SiteDataContext';
import {
  Save,
  RotateCcw,
  Image as ImageIcon,
  Package,
  ShoppingBag,
  Phone,
  Plus,
  Trash2,
  Upload,
  Check,
  ExternalLink,
  Search,
  Download,
  FileCode,
  Globe,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  ClipboardList,
  FileSpreadsheet,
  PhoneCall,
  MessageSquare,
  Clock,
  Filter,
  User,
  Hash,
  FileText
} from 'lucide-react';

const AUTH_SESSION_KEY = 'lisafood_admin_logged_in';
const PASSWORD_STORAGE_KEY = 'lisafood_admin_password';
const DEFAULT_PASSWORD = 'lisafood2027';

const STATUS_CONFIG = {
  new: { label: 'Mới nhận', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  contacted: { label: 'Đang tư vấn', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  quoted: { label: 'Đã gửi báo giá', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  completed: { label: 'Đã chốt đơn', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  cancelled: { label: 'Đã hủy', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' }
};

export default function AdminApp() {
  const {
    hero,
    contact,
    giftBoxes,
    retailProducts,
    updateHero,
    updateContact,
    updateGiftBoxes,
    updateRetailProducts,
    resetToDefault,
    // Orders / Leads state
    orders,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    clearAllOrders
  } = useSiteData();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
  });

  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Password management inside Admin
  const [currentPassword, setCurrentPassword] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_PASSWORD;
    return localStorage.getItem(PASSWORD_STORAGE_KEY) || DEFAULT_PASSWORD;
  });
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordChangeMsg, setPasswordChangeMsg] = useState({ type: '', text: '' });

  // Main CMS State
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'hero' | 'hampers' | 'retail' | 'contact' | 'security' | 'backup'
  const [heroForm, setHeroForm] = useState(hero);
  const [contactForm, setContactForm] = useState(contact);
  const [hampersList, setHampersList] = useState(giftBoxes);
  const [retailList, setRetailList] = useState(retailProducts);
  const [toastMessage, setToastMessage] = useState('');
  const [editingHamperIndex, setEditingHamperIndex] = useState(null);
  const [editingRetailIndex, setEditingRetailIndex] = useState(null);
  const [searchHamper, setSearchHamper] = useState('');
  const [searchRetail, setSearchRetail] = useState('');

  // Orders Tab filters & manual add modal
  const [searchOrder, setSearchOrder] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [manualOrderForm, setManualOrderForm] = useState({
    name: '',
    phone: '',
    hamper: giftBoxes[0]?.name || 'Sắc Xuân 01 (A)',
    quantity: 10,
    note: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    const correctPassword = localStorage.getItem(PASSWORD_STORAGE_KEY) || DEFAULT_PASSWORD;
    if (passwordInput === correctPassword) {
      sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
      setIsAuthenticated(true);
      setLoginError('');
      setPasswordInput('');
    } else {
      setLoginError('Mật khẩu không chính xác. Vui lòng kiểm tra lại!');
    }
  };

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // Change password handler
  const handleChangePassword = (e) => {
    e.preventDefault();
    const currentStored = localStorage.getItem(PASSWORD_STORAGE_KEY) || DEFAULT_PASSWORD;

    if (oldPasswordInput !== currentStored) {
      setPasswordChangeMsg({ type: 'error', text: 'Mật khẩu hiện tại không đúng.' });
      return;
    }
    if (newPasswordInput.length < 6) {
      setPasswordChangeMsg({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
      return;
    }

    localStorage.setItem(PASSWORD_STORAGE_KEY, newPasswordInput);
    setCurrentPassword(newPasswordInput);
    setOldPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setPasswordChangeMsg({ type: 'success', text: 'Đổi mật khẩu quản trị thành công!' });
    showToast('Đã đổi mật khẩu quản trị mới thành công!');
  };

  // Helper: Read image file as base64 DataURL
  const handleFileUpload = (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Vui lòng chọn ảnh có dung lượng dưới 5MB để đảm bảo hiệu năng lưu trữ.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result;
      if (typeof dataUrl === 'string') {
        callback(dataUrl);
        showToast('Tải ảnh thành công!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Save changes for Hero, Products, Contact
  const handleSaveAll = () => {
    updateHero(heroForm);
    updateContact(contactForm);
    updateGiftBoxes(hampersList);
    updateRetailProducts(retailList);
    showToast('Đã lưu tất cả thay đổi! Dữ liệu đã đồng bộ sang trang chủ.');
  };

  // Save only retail products (used by inline edit button)
  const handleSaveRetail = () => {
    updateRetailProducts(retailList);
    showToast('Đã lưu thông tin sản phẩm lẻ thành công!');
  };

  // Reset confirmation
  const handleReset = () => {
    if (window.confirm('CẢNH BÁO: Bạn có chắc chắn muốn khôi phục lại toàn bộ dữ liệu ban đầu của website?')) {
      resetToDefault();
      setHeroForm(hero);
      setContactForm(contact);
      setHampersList(giftBoxes);
      setRetailList(retailProducts);
      showToast('Đã khôi phục dữ liệu ban đầu thành công!');
    }
  };

  // Hamper management
  const handleHamperChange = (index, field, value) => {
    setHampersList((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddHamper = () => {
    const newBox = {
      id: `hamper-custom-${Date.now()}`,
      name: 'Hamper Tết Mới',
      price: '1.200.000đ',
      subtitle: 'Set quà Tết cao cấp đặc biệt theo yêu cầu',
      category: 'sac-xuan',
      tag: 'Set Quà Tết Mới',
      coverImage: '/images/hamper-sac-xuan-01-a.jpg',
      gallery: ['/images/hamper-sac-xuan-01-a.jpg'],
      items: [
        { name: 'Hạt dinh dưỡng cao cấp', weight: '250g', desc: 'Tuyển chọn thơm ngon' }
      ],
      specs: {
        packaging: 'Hộp quà cao cấp kèm túi xách',
        dimension: '36cm x 26cm x 11cm',
        certification: 'ISO 22000'
      }
    };
    setHampersList([newBox, ...hampersList]);
    setEditingHamperIndex(0);
    showToast('Đã thêm 1 Hamper mới! Hãy chỉnh sửa thông tin bên dưới.');
  };

  const handleDeleteHamper = (index) => {
    if (window.confirm(`Bạn có chắc chắn muốn xoá "${hampersList[index].name}"?`)) {
      setHampersList(hampersList.filter((_, i) => i !== index));
      if (editingHamperIndex === index) setEditingHamperIndex(null);
      showToast('Đã xoá Hamper thành công!');
    }
  };

  // Retail management
  const handleRetailChange = (index, field, value) => {
    setRetailList((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddRetail = () => {
    const newProd = {
      name: 'Sản Phẩm Lẻ Mới',
      price: '120.000đ',
      image: '/images/sp-hat-dieu-tieu-den-100g.jpg',
      tag: 'Hộp 250g'
    };
    setRetailList([newProd, ...retailList]);
    showToast('Đã thêm sản phẩm lẻ mới!');
  };

  const handleDeleteRetail = (index) => {
    if (window.confirm(`Xoá sản phẩm "${retailList[index].name}"?`)) {
      setRetailList(retailList.filter((_, i) => i !== index));
      showToast('Đã xoá sản phẩm lẻ!');
    }
  };

  // Export Orders as CSV (Excel compatible with UTF-8 BOM)
  const handleExportOrdersCSV = () => {
    if (orders.length === 0) {
      alert('Chưa có đơn đặt hàng nào để xuất file.');
      return;
    }
    const headers = ['Mã Đơn', 'Thời Gian Gửi', 'Họ Và Tên', 'Số Điện Thoại', 'Sản Phẩm', 'Số Lượng (Hộp)', 'Yêu Cầu / Ghi Chú', 'Trạng Thái'];
    const rows = orders.map((o) => [
      o.id,
      new Date(o.createdAt).toLocaleString('vi-VN'),
      `"${o.name?.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      `"${o.hamper?.replace(/"/g, '""')}"`,
      o.quantity,
      `"${(o.note || '').replace(/"/g, '""')}"`,
      `"${STATUS_CONFIG[o.status]?.label || o.status}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `danh-sach-don-lisafood-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Đã xuất file Excel / CSV thành công!');
  };

  // Manual Add Order
  const handleAddManualOrder = (e) => {
    e.preventDefault();
    if (!manualOrderForm.name.trim() || !manualOrderForm.phone.trim()) {
      alert('Vui lòng điền họ tên và số điện thoại khách hàng.');
      return;
    }
    addOrder({
      name: manualOrderForm.name.trim(),
      phone: manualOrderForm.phone.trim(),
      hamper: manualOrderForm.hamper,
      quantity: parseInt(manualOrderForm.quantity, 10) || 1,
      note: manualOrderForm.note.trim()
    });
    setManualOrderForm({
      name: '',
      phone: '',
      hamper: giftBoxes[0]?.name || 'Sắc Xuân 01 (A)',
      quantity: 10,
      note: ''
    });
    setShowAddOrderModal(false);
    showToast('Đã thêm đơn hàng mới thành công!');
  };

  // Export JSON backup
  const handleExportJSON = () => {
    const exportData = {
      hero: heroForm,
      contact: contactForm,
      giftBoxes: hampersList,
      retailProducts: retailList,
      orders: orders,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lisafood-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã tải xuống file sao lưu JSON!');
  };

  // Import JSON backup
  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.hero) setHeroForm(parsed.hero);
        if (parsed.contact) setContactForm(parsed.contact);
        if (parsed.giftBoxes) setHampersList(parsed.giftBoxes);
        if (parsed.retailProducts) setRetailList(parsed.retailProducts);
        showToast('Đã nạp file sao lưu thành công! Nhấn "Lưu Thay Đổi" để áp dụng.');
      } catch (err) {
        alert('File JSON không hợp lệ.');
      }
    };
    reader.readAsText(file);
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      (o.name || '').toLowerCase().includes(searchOrder.toLowerCase()) ||
      (o.phone || '').includes(searchOrder) ||
      (o.id || '').toLowerCase().includes(searchOrder.toLowerCase()) ||
      (o.hamper || '').toLowerCase().includes(searchOrder.toLowerCase());

    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const filteredHampers = hampersList.filter((h) =>
    h.name.toLowerCase().includes(searchHamper.toLowerCase())
  );

  const filteredRetail = retailList.filter((r) =>
    r.name.toLowerCase().includes(searchRetail.toLowerCase())
  );

  const newOrdersCount = orders.filter((o) => o.status === 'new').length;

  // ==================== SCREEN 1: LOGIN SCREEN IF NOT AUTHENTICATED ====================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-4 font-sans selection:bg-orange-500 selection:text-white">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100 flex flex-col items-center">
          
          {/* Brand Logo & Lock Badge */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center p-3 shadow-inner">
              <img
                src="/logo.png"
                alt="Lisa Food Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/logo_transference.png";
                }}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md">
              <Lock size={15} />
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif-luxury tracking-tight text-center">
            Quản Trị Hệ Thống LisaFood
          </h1>
          <p className="text-xs text-slate-500 text-center mt-1.5 mb-6">
            Vui lòng nhập mật khẩu quản trị viên để đăng nhập
          </p>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Mật Khẩu Quản Trị
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  autoFocus
                  required
                  className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-center gap-2">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-500/30 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <KeyRound size={16} />
              <span>Đăng Nhập Quản Trị</span>
            </button>
          </form>

          {/* Security Note & Back Link */}
          <div className="mt-8 pt-5 border-t border-slate-100 w-full flex flex-col items-center gap-3 text-center">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              Mật khẩu mặc định: <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">lisafood2027</code>
            </span>

            <a
              href="/"
              className="text-xs text-orange-600 hover:underline font-semibold flex items-center gap-1"
            >
              ← Quay về Trang Chủ Website
            </a>
          </div>

        </div>
      </div>
    );
  }

  // ==================== SCREEN 2: STANDALONE ADMIN CMS ====================
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[100] bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-sm animate-bounce">
          <Check size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Application Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Lisa Food Logo"
            className="h-9 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.src = "/logo_transference.png";
            }}
          />
          <div className="border-l border-slate-200 pl-3">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-extrabold text-orange-600 font-serif-luxury leading-tight">
                LISA FOOD
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
                Admin CMS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Hệ Thống Quản Trị Website Hamper Tết Độc Lập
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-600 hover:bg-orange-50 text-xs font-bold transition-all"
            title="Mở trang chủ website trong tab mới"
          >
            <Globe size={14} className="text-orange-500" />
            <span className="hidden sm:inline">Mở Trang Chủ</span>
            <ExternalLink size={12} className="opacity-60" />
          </a>

          <button
            type="button"
            onClick={handleReset}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-red-300 text-slate-600 hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
            title="Khôi phục lại dữ liệu gốc của website"
          >
            <RotateCcw size={14} />
            <span>Khôi Phục Gốc</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/25 active:scale-95 transition-all"
          >
            <Save size={15} />
            <span>Lưu Thay Đổi</span>
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
            title="Đăng xuất khỏi trang quản trị"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
        
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm space-y-1 sticky top-24">
            {[
              {
                id: 'orders',
                label: `Đơn Hàng / Báo Giá (${orders.length})`,
                icon: ClipboardList,
                badge: newOrdersCount > 0 ? `${newOrdersCount} mới` : null
              },
              { id: 'hero', label: 'Ảnh Banner & Hero', icon: ImageIcon },
              { id: 'hampers', label: `Hamper Tết (${hampersList.length})`, icon: Package },
              { id: 'retail', label: `Sản Phẩm Lẻ (${retailList.length})`, icon: ShoppingBag },
              { id: 'contact', label: 'Thông Tin Liên Hệ', icon: Phone },
              { id: 'security', label: 'Đổi Mật Khẩu', icon: Lock },
              { id: 'backup', label: 'Sao Lưu & Khôi Phục', icon: FileCode }
            ].map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveTab(id);
                  setEditingHamperIndex(null);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-left ${
                  activeTab === id
                    ? 'bg-orange-50 text-orange-600 border border-orange-200/80 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={17} className={activeTab === id ? 'text-orange-600' : 'text-slate-400'} />
                  <span>{label}</span>
                </div>
                {badge && (
                  <span className="min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-full bg-orange-500 text-white text-[9px] font-extrabold leading-none">
                    {badge}
                  </span>
                )}
              </button>
            ))}

            <div className="pt-3 mt-3 border-t border-slate-100 px-3 pb-2 text-[11px] text-slate-500 space-y-1">
              <p>💡 <strong>Hệ thống:</strong></p>
              <p className="text-slate-400">
                Dữ liệu đơn hàng đồng bộ tự động khi khách gửi form báo giá. Sẵn sàng kết nối Database.
              </p>
            </div>
          </div>
        </aside>

        {/* Right Content Workspace */}
        <main className="flex-1 min-w-0">
          
          {/* ==================== TAB 0: ORDERS / LEADS LIST ==================== */}
          {activeTab === 'orders' && (
            <div className="space-y-5">
              {/* Stats Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tổng Yêu Cầu</span>
                  <span className="text-2xl font-extrabold text-slate-900 block mt-1">{orders.length}</span>
                </div>
                <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 shadow-sm">
                  <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider block">Đơn Mới Nhận</span>
                  <span className="text-2xl font-extrabold text-orange-600 block mt-1">{newOrdersCount}</span>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 shadow-sm">
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">Đang Tư Vấn</span>
                  <span className="text-2xl font-extrabold text-blue-700 block mt-1">
                    {orders.filter((o) => o.status === 'contacted' || o.status === 'quoted').length}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 shadow-sm">
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Đã Chốt Đơn</span>
                  <span className="text-2xl font-extrabold text-emerald-700 block mt-1">
                    {orders.filter((o) => o.status === 'completed').length}
                  </span>
                </div>
              </div>

              {/* Toolbar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto flex-1">
                  {/* Search */}
                  <div className="relative flex-1 max-w-sm">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên, SĐT, mã đơn, hamper..."
                      value={searchOrder}
                      onChange={(e) => setSearchOrder(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    />
                  </div>

                  {/* Filter Status */}
                  <div className="flex items-center gap-1.5">
                    <Filter size={14} className="text-slate-400 ml-1 hidden sm:block" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
                    >
                      <option value="all">Tất cả trạng thái ({orders.length})</option>
                      <option value="new">Mới nhận ({orders.filter(o => o.status === 'new').length})</option>
                      <option value="contacted">Đang tư vấn ({orders.filter(o => o.status === 'contacted').length})</option>
                      <option value="quoted">Đã gửi báo giá ({orders.filter(o => o.status === 'quoted').length})</option>
                      <option value="completed">Đã chốt đơn ({orders.filter(o => o.status === 'completed').length})</option>
                      <option value="cancelled">Đã hủy ({orders.filter(o => o.status === 'cancelled').length})</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleExportOrdersCSV}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-colors"
                    title="Xuất file Excel/CSV danh sách đơn"
                  >
                    <FileSpreadsheet size={15} className="text-emerald-600" />
                    <span>Xuất Excel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAddOrderModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all"
                  >
                    <Plus size={15} />
                    <span>Tạo Đơn Mới</span>
                  </button>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {filteredOrders.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <ClipboardList size={36} className="text-slate-300 mx-auto" />
                    <p className="text-sm font-bold text-slate-600">Không tìm thấy đơn hàng / báo giá nào</p>
                    <p className="text-xs text-slate-400">
                      Khi khách hàng điền form liên hệ trên Landing Page, thông tin sẽ tự động hiển thị ở đây.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Mã Đơn / Ngày</th>
                          <th className="py-3 px-4">Khách Hàng</th>
                          <th className="py-3 px-4">Sản Phẩm & Số Lượng</th>
                          <th className="py-3 px-4">Yêu Cầu / Ghi Chú</th>
                          <th className="py-3 px-4">Trạng Thái</th>
                          <th className="py-3 px-4 text-right">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredOrders.map((ord) => {
                          const statusInfo = STATUS_CONFIG[ord.status] || STATUS_CONFIG.new;
                          const cleanPhone = (ord.phone || '').replace(/[\s.-]/g, '');

                          return (
                            <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                              {/* Order ID & Date */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <span className="font-mono font-bold text-slate-900 block">{ord.id}</span>
                                <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                  <Clock size={11} />
                                  {new Date(ord.createdAt).toLocaleDateString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </td>

                              {/* Customer */}
                              <td className="py-3.5 px-4">
                                <span className="font-bold text-slate-900 block">{ord.name}</span>
                                <div className="flex items-center gap-2 mt-1">
                                  <a
                                    href={`tel:${cleanPhone}`}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 hover:underline"
                                  >
                                    <PhoneCall size={11} />
                                    <span>{ord.phone}</span>
                                  </a>
                                  <a
                                    href={`https://zalo.me/${cleanPhone}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[9px] font-bold hover:bg-blue-100"
                                  >
                                    Zalo
                                  </a>
                                </div>
                              </td>

                              {/* Hamper & Quantity */}
                              <td className="py-3.5 px-4 min-w-[220px]">
                                {ord.selectedHampers?.length > 0 || ord.selectedRetail?.length > 0 ? (
                                  <div className="space-y-1">
                                    {ord.selectedHampers?.map((h, idx) => (
                                      <span key={idx} className="inline-block px-1.5 py-0.5 rounded bg-orange-50 border border-orange-200 text-orange-800 text-[10px] font-semibold mr-1 mb-1">
                                        🎁 {h}
                                      </span>
                                    ))}
                                    {ord.selectedRetail?.map((r, idx) => (
                                      <span key={idx} className="inline-block px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-semibold mr-1 mb-1">
                                        🥜 {r}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="font-semibold text-slate-800 block line-clamp-2">{ord.hamper}</span>
                                )}
                                <span className="text-[11px] text-slate-500 font-bold block mt-1">
                                  Số lượng: <strong className="text-orange-600">{ord.quantity} hộp</strong>
                                </span>
                              </td>

                              {/* Notes */}
                              <td className="py-3.5 px-4 max-w-xs">
                                <p className="text-slate-600 line-clamp-2 italic">
                                  {ord.note || <span className="text-slate-300 not-italic">Không có ghi chú</span>}
                                </p>
                              </td>

                              {/* Status Dropdown */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <select
                                  value={ord.status}
                                  onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                                >
                                  <option value="new">Mới nhận</option>
                                  <option value="contacted">Đang tư vấn</option>
                                  <option value="quoted">Đã gửi báo giá</option>
                                  <option value="completed">Đã chốt đơn</option>
                                  <option value="cancelled">Đã hủy</option>
                                </select>
                              </td>

                              {/* Actions */}
                              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Xóa yêu cầu của khách "${ord.name}"?`)) {
                                      deleteOrder(ord.id);
                                      showToast('Đã xóa đơn hàng!');
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Xóa đơn hàng này"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== TAB 1: HERO & BANNER ==================== */}
          {activeTab === 'hero' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Cấu Hình Ảnh Banner & Khu Vực Hero</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tùy chỉnh ảnh nền banner xuất hiện ở đầu website, tiêu đề chính, lời giới thiệu và các chỉ số thống kê
                </p>
              </div>

              {/* Banner Image Setting */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Ảnh Banner Đầu Trang (Hero Banner)
                </label>

                {/* Banner Preview */}
                <div className="relative aspect-[21/9] max-h-72 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner group">
                  <img
                    src={heroForm.bannerImage}
                    alt="Banner Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/home-banner/qua_tang.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                    Ảnh đang sử dụng trên trang chủ
                  </div>
                </div>

                {/* Upload or Link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Đường dẫn URL ảnh:
                    </label>
                    <input
                      type="text"
                      value={heroForm.bannerImage}
                      onChange={(e) => setHeroForm({ ...heroForm, bannerImage: e.target.value })}
                      placeholder="/images/catalogue-tet-2027-lisafood.jpg"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Hoặc tải ảnh từ máy tính của bạn:
                    </label>
                    <label className="cursor-pointer inline-flex items-center justify-center gap-2 w-full px-3.5 py-2.5 rounded-xl border border-dashed border-orange-300 bg-orange-50/50 hover:bg-orange-50 text-orange-600 text-xs font-bold transition-colors">
                      <Upload size={14} />
                      <span>Chọn tệp ảnh từ máy tính</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, (dataUrl) =>
                            setHeroForm({ ...heroForm, bannerImage: dataUrl })
                          )
                        }
                      />
                    </label>
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                    Ảnh mẫu sẵn có trong hệ thống (nhấn để chọn):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Catalogue Tết 2027', url: '/images/catalogue-tet-2027-lisafood.jpg' },
                      { label: 'Hamper Sắc Xuân', url: '/images/hamper-sac-xuan-01-a.jpg' },
                      { label: 'Tết Lạc Hồng', url: '/images/hamper-tet-lac-hong.jpg' },
                      { label: 'Xuân Hoan Ca', url: '/images/hamper-xuan-hoan-ca.jpg' }
                    ].map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setHeroForm({ ...heroForm, bannerImage: preset.url })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          heroForm.bannerImage === preset.url
                            ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title & Description Settings */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Tiêu Đề Lớn (Masked Heading)
                  </label>
                  <input
                    type="text"
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Tiêu Đề Phụ (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={heroForm.subtitle}
                    onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Đoạn Giới Thiệu Ngắn (Description)
                  </label>
                  <textarea
                    rows={3}
                    value={heroForm.description}
                    onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* 3 Stats Numbers */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  3 Ô Số Liệu Thống Kê (CountUp)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {heroForm.stats?.map((stat, idx) => (
                    <div key={stat.id || idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-[10px] font-semibold text-slate-500 block">Số:</label>
                          <input
                            type="number"
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...heroForm.stats];
                              newStats[idx].value = Number(e.target.value);
                              setHeroForm({ ...heroForm, stats: newStats });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                          />
                        </div>
                        <div className="w-20">
                          <label className="text-[10px] font-semibold text-slate-500 block">Đơn vị:</label>
                          <input
                            type="text"
                            value={stat.suffix}
                            onChange={(e) => {
                              const newStats = [...heroForm.stats];
                              newStats[idx].suffix = e.target.value;
                              setHeroForm({ ...heroForm, stats: newStats });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block">Nhãn mô tả:</label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...heroForm.stats];
                            newStats[idx].label = e.target.value;
                            setHeroForm({ ...heroForm, stats: newStats });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: HAMPER TẾT ==================== */}
          {activeTab === 'hampers' && (
            <div className="space-y-5">
              {/* Toolbar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm hamper theo tên..."
                    value={searchHamper}
                    onChange={(e) => setSearchHamper(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddHamper}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all"
                >
                  <Plus size={15} />
                  <span>Thêm Hamper Mới</span>
                </button>
              </div>

              {/* Hamper Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHampers.map((hamper, idx) => {
                  const originalIndex = hampersList.findIndex((h) => h.id === hamper.id);
                  const isEditing = editingHamperIndex === originalIndex;

                  return (
                    <div
                      key={hamper.id || idx}
                      className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col ${
                        isEditing
                          ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-xl col-span-1 sm:col-span-2 lg:col-span-3'
                          : 'border-slate-200 hover:border-orange-300 shadow-sm'
                      }`}
                    >
                      {/* Compact card header */}
                      <div className="p-3.5 flex items-start gap-3 border-b border-slate-100">
                        <img
                          src={hamper.coverImage}
                          alt={hamper.name}
                          className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = '/home-banner/qua_tang.jpg';
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wide block">
                            {hamper.tag || 'Set Quà'}
                          </span>
                          <h4 className="text-sm font-bold text-slate-800 truncate">{hamper.name}</h4>
                          <span className="text-sm font-extrabold text-orange-600 block">{hamper.price}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingHamperIndex(isEditing ? null : originalIndex)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                              isEditing
                                ? 'bg-orange-500 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-orange-600'
                            }`}
                          >
                            {isEditing ? 'Thu Gọn' : 'Chỉnh Sửa'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteHamper(originalIndex)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xoá Hamper này"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Edit Form */}
                      {isEditing && (
                        <div className="p-5 bg-orange-50/20 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">Tên Hamper:</label>
                              <input
                                type="text"
                                value={hamper.name}
                                onChange={(e) => handleHamperChange(originalIndex, 'name', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">Giá bán:</label>
                              <input
                                type="text"
                                value={hamper.price}
                                onChange={(e) => handleHamperChange(originalIndex, 'price', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-orange-600"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">Thẻ huy hiệu (Tag):</label>
                              <input
                                type="text"
                                value={hamper.tag}
                                onChange={(e) => handleHamperChange(originalIndex, 'tag', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">Phân loại danh mục:</label>
                              <select
                                value={hamper.category}
                                onChange={(e) => handleHamperChange(originalIndex, 'category', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                              >
                                <option value="sac-xuan">Hamper Sắc Xuân 2 Tầng</option>
                                <option value="khai-loc">Hamper Khai Lộc Đèn LED</option>
                                <option value="vang">Hamper Xuân Hoan Ca & Vang</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">Mô tả tóm tắt:</label>
                              <input
                                type="text"
                                value={hamper.subtitle}
                                onChange={(e) => handleHamperChange(originalIndex, 'subtitle', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                              />
                            </div>
                          </div>

                          {/* Image link + Upload */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Ảnh bìa Hamper:</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={hamper.coverImage}
                                onChange={(e) => handleHamperChange(originalIndex, 'coverImage', e.target.value)}
                                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                                placeholder="/images/hamper-sac-xuan-01-a.jpg"
                              />
                              <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors">
                                <Upload size={13} />
                                <span>Tải ảnh lên</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileUpload(e, (dataUrl) =>
                                      handleHamperChange(originalIndex, 'coverImage', dataUrl)
                                    )
                                  }
                                />
                              </label>
                            </div>
                          </div>

                          {/* Items in Hamper */}
                          <div className="pt-2 border-t border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-slate-700">Các Món Trong Set ({hamper.items?.length || 0}):</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = [
                                    ...(hamper.items || []),
                                    { name: 'Món mới', weight: '200g', desc: 'Thơm ngon bổ dưỡng' }
                                  ];
                                  handleHamperChange(originalIndex, 'items', newItems);
                                }}
                                className="text-[11px] font-bold text-orange-600 hover:underline inline-flex items-center gap-1"
                              >
                                <Plus size={12} /> Thêm món mới
                              </button>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              {hamper.items?.map((item, itemIdx) => (
                                <div key={itemIdx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                                  <input
                                    type="text"
                                    value={item.name}
                                    placeholder="Tên món"
                                    onChange={(e) => {
                                      const itemsCopy = [...hamper.items];
                                      itemsCopy[itemIdx].name = e.target.value;
                                      handleHamperChange(originalIndex, 'items', itemsCopy);
                                    }}
                                    className="flex-1 px-2.5 py-1 text-xs border border-slate-200 rounded-lg"
                                  />
                                  <input
                                    type="text"
                                    value={item.weight}
                                    placeholder="Trọng lượng (200g)"
                                    onChange={(e) => {
                                      const itemsCopy = [...hamper.items];
                                      itemsCopy[itemIdx].weight = e.target.value;
                                      handleHamperChange(originalIndex, 'items', itemsCopy);
                                    }}
                                    className="w-24 px-2 py-1 text-xs border border-slate-200 rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const itemsCopy = hamper.items.filter((_, i) => i !== itemIdx);
                                      handleHamperChange(originalIndex, 'items', itemsCopy);
                                    }}
                                    className="p-1 text-slate-400 hover:text-red-500 rounded"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================== TAB 3: RETAIL PRODUCTS ==================== */}
          {activeTab === 'retail' && (
            <div className="space-y-5">
              {/* Toolbar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm lẻ..."
                    value={searchRetail}
                    onChange={(e) => setSearchRetail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddRetail}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all"
                >
                  <Plus size={15} />
                  <span>Thêm Sản Phẩm Lẻ</span>
                </button>
              </div>

              {/* Retail Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredRetail.map((prod, idx) => {
                  const originalIndex = retailList.findIndex((r) => r.name === prod.name && r.price === prod.price);
                  const isEditing = editingRetailIndex === originalIndex;
                  return (
                    <div
                      key={idx}
                      className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col ${
                        isEditing
                          ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-xl col-span-1 sm:col-span-2 lg:col-span-3'
                          : 'border-slate-200 hover:border-orange-300 shadow-sm'
                      }`}
                    >
                      {/* Card Header — always visible */}
                      <div className="p-3 flex items-center gap-3">
                        {/* Product Image */}
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-contain p-1"
                            onError={(e) => {
                              e.currentTarget.src = '/home-banner/hat_dieu.jpg';
                            }}
                          />
                          {isEditing && (
                            <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white" title="Tải ảnh mới">
                              <Upload size={13} />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleFileUpload(e, (dataUrl) =>
                                    handleRetailChange(originalIndex, 'image', dataUrl)
                                  )
                                }
                              />
                            </label>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 truncate leading-tight">{prod.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="text-xs font-extrabold text-orange-600">{prod.price}</span>
                            {prod.tag && (
                              <span className="px-1.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[10px] text-orange-700 font-semibold truncate max-w-[100px]">
                                {prod.tag}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingRetailIndex(isEditing ? null : originalIndex);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                              isEditing
                                ? 'bg-orange-500 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-orange-600'
                            }`}
                          >
                            {isEditing ? 'Thu Gọn' : 'Sửa'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRetail(originalIndex)}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                            title="Xoá sản phẩm này"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Edit Form */}
                      {isEditing && (
                        <div className="px-4 pb-5 pt-1 bg-orange-50/20 border-t border-slate-100 space-y-4">
                          <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wider pt-2">Chỉnh Sửa Thông Tin</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Name */}
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Tên Sản Phẩm</label>
                              <input
                                type="text"
                                value={prod.name}
                                onChange={(e) => handleRetailChange(originalIndex, 'name', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400"
                              />
                            </div>

                            {/* Price */}
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Giá Niêm Yết</label>
                              <input
                                type="text"
                                value={prod.price}
                                onChange={(e) => handleRetailChange(originalIndex, 'price', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                placeholder="Ví dụ: 185.000đ"
                              />
                            </div>

                            {/* Tag */}
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Tag / Nhãn Phân Loại</label>
                              <input
                                type="text"
                                value={prod.tag}
                                onChange={(e) => handleRetailChange(originalIndex, 'tag', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
                                placeholder="Ví dụ: Hạt Điều, Macca..."
                              />
                            </div>

                            {/* Image URL */}
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">URL Hình Ảnh</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={prod.image || ''}
                                  onChange={(e) => handleRetailChange(originalIndex, 'image', e.target.value)}
                                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
                                  placeholder="/images/product.jpg"
                                />
                                <label
                                  className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50 text-slate-600 hover:text-orange-600 cursor-pointer transition-colors text-[11px] font-bold flex-shrink-0"
                                  title="Tải ảnh từ máy tính"
                                >
                                  <Upload size={13} />
                                  <span>Tải lên</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleFileUpload(e, (dataUrl) =>
                                        handleRetailChange(originalIndex, 'image', dataUrl)
                                      )
                                    }
                                  />
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Preview + Save */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                            <div className="flex items-center gap-2">
                              <img
                                src={prod.image}
                                alt="preview"
                                className="w-12 h-12 rounded-xl object-contain border border-slate-200 bg-slate-50 p-1"
                                onError={(e) => { e.currentTarget.src = '/home-banner/hat_dieu.jpg'; }}
                              />
                              <span className="text-[11px] text-slate-500">Xem trước ảnh mới</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                handleSaveRetail();
                                setEditingRetailIndex(null);
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
                            >
                              <Check size={13} />
                              <span>Lưu Thay Đổi</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================== TAB 4: CONTACT & HOTLINE ==================== */}
          {activeTab === 'contact' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Thông Tin Liên Hệ & Kênh Tư Vấn</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cập nhật hotline, email, link Zalo và địa chỉ showroom hiển thị trên toàn bộ website
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Hotline Chính (Gọi tư vấn)
                  </label>
                  <input
                    type="text"
                    value={contactForm.hotline1}
                    onChange={(e) => setContactForm({ ...contactForm, hotline1: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-orange-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Hotline Dự Phòng
                  </label>
                  <input
                    type="text"
                    value={contactForm.hotline2}
                    onChange={(e) => setContactForm({ ...contactForm, hotline2: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-orange-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Báo Giá Chính
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Bổ Sung
                  </label>
                  <input
                    type="email"
                    value={contactForm.emailSecondary}
                    onChange={(e) => setContactForm({ ...contactForm, emailSecondary: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Link Zalo Tư Vấn
                  </label>
                  <input
                    type="text"
                    value={contactForm.zaloUrl}
                    onChange={(e) => setContactForm({ ...contactForm, zaloUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Link Website Chính Thức (Về Chúng Tôi)
                  </label>
                  <input
                    type="text"
                    value={contactForm.websiteUrl}
                    onChange={(e) => setContactForm({ ...contactForm, websiteUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Địa Chỉ Showroom & Trụ Sở
                </label>
                <input
                  type="text"
                  value={contactForm.address}
                  onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Thời Gian Làm Việc
                </label>
                <input
                  type="text"
                  value={contactForm.workingHours}
                  onChange={(e) => setContactForm({ ...contactForm, workingHours: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* ==================== TAB 5: SECURITY (CHANGE PASSWORD) ==================== */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Bảo Mật & Đổi Mật Khẩu Quản Trị</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Thiết lập mật khẩu bảo vệ trang quản trị admin để ngăn chặn truy cập trái phép
                </p>
              </div>

              {passwordChangeMsg.text && (
                <div
                  className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                    passwordChangeMsg.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}
                >
                  {passwordChangeMsg.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                  <span>{passwordChangeMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Mật Khẩu Hiện Tại
                  </label>
                  <input
                    type="password"
                    placeholder="Mật khẩu hiện tại..."
                    value={oldPasswordInput}
                    onChange={(e) => setOldPasswordInput(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Mật Khẩu Mới (Tối thiểu 6 ký tự)
                  </label>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu mới..."
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Xác Nhận Mật Khẩu Mới
                  </label>
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu mới..."
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 active:scale-95 transition-all"
                >
                  <KeyRound size={15} />
                  <span>Cập Nhật Mật Khẩu Mới</span>
                </button>
              </form>
            </div>
          )}

          {/* ==================== TAB 6: BACKUP & RESTORE ==================== */}
          {activeTab === 'backup' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Sao Lưu & Khôi Phục Dữ Liệu</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tải toàn bộ cấu hình website và danh sách đơn đặt hàng về máy tính dưới dạng file JSON hoặc nạp file sao lưu
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Export Card */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                      <Download size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Xuất Dữ Liệu Website (Backup)</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Lưu tất cả ảnh banner, thông tin 11 set hamper, 28 sản phẩm lẻ, thông tin liên hệ và danh sách đơn đặt hàng thành 1 file .json trên máy tính của bạn.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    <Download size={15} />
                    <span>Tải File Sao Lưu (.json)</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                      <Upload size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Nạp Dữ Liệu Từ File (Restore)</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Khôi phục lại dữ liệu cấu hình đã xuất trước đó từ file .json vào hệ thống website.
                    </p>
                  </div>
                  <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors">
                    <Upload size={15} />
                    <span>Chọn File .json Từ Máy Tính</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      className="hidden"
                      onChange={handleImportJSON}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Manual Add Order Modal */}
      {showAddOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-orange-500" />
                <h3 className="text-base font-bold text-slate-900">Tạo Đơn Hàng / Báo Giá Mới</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddOrderModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddManualOrder} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên khách hàng *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Hoàng Anh Quân"
                  value={manualOrderForm.name}
                  onChange={(e) => setManualOrderForm({ ...manualOrderForm, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  placeholder="Ví dụ: 0918 888 999"
                  value={manualOrderForm.phone}
                  onChange={(e) => setManualOrderForm({ ...manualOrderForm, phone: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sản phẩm</label>
                  <select
                    value={manualOrderForm.hamper}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, hamper: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  >
                    {giftBoxes.map((g) => (
                      <option key={g.name} value={`${g.name} (${g.price})`}>{g.name}</option>
                    ))}
                    <option value="Sản phẩm lẻ">Sản phẩm lẻ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số lượng hộp</label>
                  <input
                    type="number"
                    min="1"
                    value={manualOrderForm.quantity}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, quantity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú yêu cầu của khách</label>
                <textarea
                  rows={2}
                  placeholder="Khách gọi qua hotline cần tư vấn mẫu, in logo..."
                  value={manualOrderForm.note}
                  onChange={(e) => setManualOrderForm({ ...manualOrderForm, note: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddOrderModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/25 active:scale-95"
                >
                  Tạo Đơn Hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
