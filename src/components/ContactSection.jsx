import React, { useState } from 'react';
import Stepper, { Step } from './Stepper';
import AnimatedContent from './AnimatedContent';
import {
  Phone,
  Mail,
  MessageCircle,
  CheckCircle,
  User,
  Package,
  Hash,
  FileText,
  AlertCircle,
  Copy,
  Clock,
  Check,
  ShoppingBag,
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

const inputClass = (hasError) =>
  `w-full px-3.5 py-2.5 rounded-xl border text-slate-800 text-sm placeholder-slate-400 focus:outline-none transition ${
    hasError
      ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-300'
      : 'border-slate-200 bg-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400'
  }`;

const labelClass = 'block text-xs font-semibold text-slate-600 mb-1.5';

export default function ContactSection() {
  const { giftBoxes, retailProducts, contact, addOrder } = useSiteData();
  const [currentStep, setCurrentStep] = useState(1);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    quantity: '',
    note: ''
  });

  // Multi-select states for Hampers and Retail products
  const [selectedHampers, setSelectedHampers] = useState([]);
  const [selectedRetail, setSelectedRetail] = useState([]);
  const [wantRetail, setWantRetail] = useState(false);
  const [retailSearch, setRetailSearch] = useState('');

  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Toggle Hamper selection
  const toggleHamper = (hamperLabel) => {
    setSelectedHampers((prev) => {
      const exists = prev.includes(hamperLabel);
      const updated = exists ? prev.filter((item) => item !== hamperLabel) : [...prev, hamperLabel];
      if (updated.length > 0 || selectedRetail.length > 0) {
        setErrors((err) => {
          const c = { ...err };
          delete c.products;
          return c;
        });
      }
      return updated;
    });
  };

  // Toggle Retail Product selection
  const toggleRetail = (retailName) => {
    setSelectedRetail((prev) => {
      const exists = prev.includes(retailName);
      const updated = exists ? prev.filter((item) => item !== retailName) : [...prev, retailName];
      if (updated.length > 0 || selectedHampers.length > 0) {
        setErrors((err) => {
          const c = { ...err };
          delete c.products;
          return c;
        });
      }
      return updated;
    });
  };

  const totalSelectedCount = selectedHampers.length + selectedRetail.length;

  // Filtered retail list for search
  const filteredRetailProducts = retailProducts.filter((p) =>
    p.name.toLowerCase().includes(retailSearch.toLowerCase()) ||
    (p.tag || '').toLowerCase().includes(retailSearch.toLowerCase())
  );

  // Step Validation Check
  const validateStep = (step) => {
    const errs = {};
    if (step === 1) {
      if (!form.name.trim()) {
        errs.name = 'Vui lòng nhập họ và tên của bạn';
      }
      const cleanPhone = form.phone.replace(/[\s.-]/g, '');
      if (!cleanPhone) {
        errs.phone = 'Vui lòng nhập số điện thoại để nhận báo giá';
      } else if (!/^\d+$/.test(cleanPhone)) {
        errs.phone = 'Số điện thoại chỉ được chứa các chữ số';
      } else if (cleanPhone.length < 9 || cleanPhone.length > 11) {
        errs.phone = 'Số điện thoại phải từ 9 đến 11 chữ số hợp lệ';
      }
    } else if (step === 2) {
      if (selectedHampers.length === 0 && selectedRetail.length === 0) {
        errs.products = 'Vui lòng chọn ít nhất 1 set Hamper Tết hoặc 1 sản phẩm lẻ bạn quan tâm';
      }
    } else if (step === 3) {
      const qty = parseInt(form.quantity, 10);
      if (!form.quantity || isNaN(qty) || qty <= 0) {
        errs.quantity = 'Vui lòng nhập số lượng hộp muốn đặt (ít nhất 1 hộp)';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Build summary string of all selected products
  const getProductsSummary = () => {
    const parts = [];
    if (selectedHampers.length > 0) {
      parts.push(`Hamper (${selectedHampers.length} set): ${selectedHampers.join(', ')}`);
    }
    if (selectedRetail.length > 0) {
      parts.push(`Sản phẩm lẻ (${selectedRetail.length} món): ${selectedRetail.join(', ')}`);
    }
    return parts.join(' | ');
  };

  const handleNextClick = (e) => {
    // Validate current step
    if (!validateStep(currentStep)) {
      e.preventDefault();
      return;
    }

    // If on the final step (Step 4), save the order lead
    if (currentStep === 4) {
      const summary = getProductsSummary();
      const order = addOrder({
        name: form.name.trim(),
        phone: form.phone.trim(),
        hamper: summary,
        selectedHampers: selectedHampers,
        selectedRetail: selectedRetail,
        quantity: parseInt(form.quantity, 10) || 1,
        note: form.note.trim()
      });
      setCreatedOrder(order);
    }
  };

  const handleCopyCode = () => {
    if (createdOrder?.id) {
      navigator.clipboard.writeText(createdOrder.id);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Build mailto body
  const buildMailto = () => {
    const orderId = createdOrder ? createdOrder.id : 'MỚI';
    const summary = getProductsSummary();
    const subject = encodeURIComponent(`[${orderId}] Yêu cầu báo giá Hamper Tết - ${form.name}`);
    const body = encodeURIComponent(
      `Mã đơn: ${orderId}\nHọ tên: ${form.name}\nSố điện thoại: ${form.phone}\nSản phẩm chọn:\n${summary}\n\nSố lượng: ${form.quantity} hộp\nGhi chú: ${form.note || 'Không có'}`
    );
    return `mailto:${contact.email || 'sale@lisafood.vn'}?subject=${subject}&body=${body}`;
  };

  const buildZalo = () => {
    return contact.zaloUrl || `https://zalo.me/0393955516`;
  };

  const completedContent = (
    <div className="flex flex-col items-center gap-5 py-6 px-2 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center shadow-md shadow-emerald-500/10">
        <CheckCircle size={36} className="text-emerald-500" strokeWidth={2} />
      </div>

      <div className="space-y-1.5">
        <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold tracking-wider uppercase">
          Yêu Cầu Đã Gửi Thành Công
        </span>
        <h3 className="text-xl font-extrabold text-slate-800">
          Cảm ơn bạn, {form.name || 'Quý khách'}!
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
          Danh sách <strong>{totalSelectedCount} sản phẩm</strong> yêu cầu báo giá của bạn đã được chuyển tới bộ phận kinh doanh LisaFood. Chúng tôi sẽ liên hệ trong vòng <strong>2 giờ làm việc</strong>.
        </p>
      </div>

      {/* Order Badge Card */}
      {createdOrder && (
        <div className="w-full max-w-sm p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex items-center justify-between gap-3 text-left">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Mã Yêu Cầu Của Bạn</span>
            <span className="text-sm font-extrabold text-orange-600 font-mono">{createdOrder.id}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-orange-200 text-slate-700 text-xs font-semibold hover:bg-orange-50 transition-colors"
          >
            {copiedCode ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            <span>{copiedCode ? 'Đã chép' : 'Sao chép'}</span>
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm pt-1">
        <a
          href={buildZalo()}
          target="_blank"
          rel="noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 active:scale-95"
        >
          <MessageCircle size={16} />
          <span>Nhắn Zalo Ngay</span>
        </a>
        <a
          href={buildMailto()}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
        >
          <Mail size={16} />
          <span>Gửi Email Báo Giá</span>
        </a>
      </div>

      <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
        <Clock size={13} className="text-orange-500" />
        <span>Hotline hỗ trợ 24/7:{' '}
          <a href={`tel:${(contact.hotline1 || '0393.955.516').replace(/\./g, '')}`} className="text-orange-600 font-bold hover:underline">
            {contact.hotline1 || '0393.955.516'}
          </a>
        </span>
      </div>
    </div>
  );

  return (
    <section
      id="baogia"
      className="py-14 sm:py-20 bg-gradient-to-b from-orange-50/50 via-white to-white border-t border-orange-100 scroll-mt-20 sm:scroll-mt-24"
    >
      <div className="max-w-2xl mx-auto px-3.5 sm:px-6">
        {/* Section Header */}
        <AnimatedContent
          distance={60}
          direction="vertical"
          duration={0.7}
          ease="power3.out"
          blur={0}
          threshold={0.1}
          className="text-center max-w-xl mx-auto mb-8 sm:mb-12 space-y-3"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            Liên Hệ Báo Giá
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-serif-luxury tracking-tight leading-tight">
            Nhận Báo Giá Hamper Tết
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed px-2">
            Chọn một hoặc nhiều sản phẩm cần báo giá — đội ngũ LisaFood sẽ gửi bảng chiết khấu chi tiết trong vòng 2 giờ.
          </p>
        </AnimatedContent>

        {/* Stepper Form with strict Step Validation */}
        <AnimatedContent
          distance={40}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          blur={0}
          delay={0.1}
          threshold={0.1}
        >
          <Stepper
            theme="light"
            accentColor="#f97316"
            width="100%"
            radius={20}
            frame={true}
            orientation="horizontal"
            indicator="numbers"
            transition="slide"
            linear={true}
            disableStepIndicators={true}
            backButtonText="Quay lại"
            nextButtonText="Tiếp theo"
            completeButtonText="Gửi yêu cầu báo giá"
            completedContent={completedContent}
            onStepChange={(newStep) => {
              setCurrentStep(newStep);
              setErrors({});
            }}
            nextButtonProps={{
              onClick: handleNextClick
            }}
            className="mx-auto shadow-xl shadow-orange-500/5 bg-white"
          >
            {/* Step 1: Thông tin liên hệ */}
            <Step title="Liên hệ">
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0">
                    <User size={15} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Thông tin liên hệ</p>
                    <p className="text-xs text-slate-400">Bước 1/4: Để chúng tôi gửi báo giá cho bạn</p>
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor="cf-name">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cf-name"
                    type="text"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={form.name}
                    onChange={set('name')}
                    className={inputClass(!!errors.name)}
                    autoComplete="name"
                  />
                  {errors.name && (
                    <span className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1.5 animate-fadeIn">
                      <AlertCircle size={12} className="flex-shrink-0" />
                      <span>{errors.name}</span>
                    </span>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="cf-phone">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cf-phone"
                    type="tel"
                    placeholder="Ví dụ: 0912 345 678"
                    value={form.phone}
                    onChange={set('phone')}
                    className={inputClass(!!errors.phone)}
                    autoComplete="tel"
                    inputMode="tel"
                  />
                  {errors.phone && (
                    <span className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1.5 animate-fadeIn">
                      <AlertCircle size={12} className="flex-shrink-0" />
                      <span>{errors.phone}</span>
                    </span>
                  )}
                </div>
              </div>
            </Step>

            {/* Step 2: Chọn Sản Phẩm (Cho phép chọn nhiều Hamper & nhiều Sản phẩm lẻ) */}
            <Step title="Sản phẩm">
              <div className="space-y-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0">
                      <Package size={15} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Chọn sản phẩm cần báo giá</p>
                      <p className="text-xs text-slate-400">Bước 2/4: Bạn có thể chọn nhiều Hamper và sản phẩm lẻ</p>
                    </div>
                  </div>

                  {totalSelectedCount > 0 && (
                    <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 font-extrabold text-xs">
                      Đã chọn: {totalSelectedCount}
                    </span>
                  )}
                </div>

                {/* Error Banner if no products selected */}
                {errors.products && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                    <AlertCircle size={15} className="flex-shrink-0" />
                    <span>{errors.products}</span>
                  </div>
                )}

                {/* Section A: Multi-Select Hamper Tết */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-orange-500" />
                      Bộ Sưu Tập Hamper Tết ({selectedHampers.length} đã chọn)
                    </span>
                    {selectedHampers.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedHampers([])}
                        className="text-[10px] text-slate-400 hover:text-red-500 underline"
                      >
                        Bỏ chọn tất cả
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {giftBoxes.map((box) => {
                      const label = `${box.name} (${box.price})`;
                      const isSelected = selectedHampers.includes(label);

                      return (
                        <div
                          key={box.id}
                          onClick={() => toggleHamper(label)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 select-none ${
                            isSelected
                              ? 'bg-orange-50 border-orange-500 ring-1 ring-orange-500/30'
                              : 'bg-white border-slate-200 hover:border-orange-300'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-orange-500 text-white'
                                : 'border border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check size={11} strokeWidth={3} />}
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-800 block truncate">{box.name}</span>
                            <span className="text-[11px] font-extrabold text-orange-600 font-serif-luxury">{box.price}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section B: Retail Products Multi-Select Toggle */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div
                    onClick={() => setWantRetail(!wantRetail)}
                    className="p-3 rounded-xl bg-orange-50/50 hover:bg-orange-50 border border-orange-200/80 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                          wantRetail || selectedRetail.length > 0
                            ? 'bg-orange-500 text-white'
                            : 'border border-slate-300 bg-white'
                        }`}
                      >
                        {(wantRetail || selectedRetail.length > 0) && <Check size={11} strokeWidth={3} />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          Chọn thêm Sản Phẩm Lẻ / Hạt Dinh Dưỡng
                        </span>
                        <span className="text-[10px] text-slate-500">
                          28 dòng đặc sản hạt điều, macca, nho khô, khô gà... ({selectedRetail.length} món đã chọn)
                        </span>
                      </div>
                    </div>

                    <div className="text-orange-600">
                      {wantRetail ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {/* Expanded Retail Multi-Select Panel */}
                  {wantRetail && (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 animate-fadeIn">
                      {/* Search box for retail */}
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Tìm hạt điều, macca, khô gà..."
                          value={retailSearch}
                          onChange={(e) => setRetailSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-orange-400"
                        />
                      </div>

                      {/* Retail items checklist */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                        {filteredRetailProducts.map((prod) => {
                          const retailLabel = `${prod.name} (${prod.price})`;
                          const isSelected = selectedRetail.includes(retailLabel);

                          return (
                            <div
                              key={prod.name}
                              onClick={() => toggleRetail(retailLabel)}
                              className={`p-2 rounded-lg border cursor-pointer flex items-center gap-2 text-left transition-colors select-none ${
                                isSelected
                                  ? 'bg-orange-100/70 border-orange-400 text-slate-900 font-semibold'
                                  : 'bg-white border-slate-200 hover:border-orange-200 text-slate-700'
                              }`}
                            >
                              <div
                                className={`w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                  isSelected
                                    ? 'bg-orange-500 text-white'
                                    : 'border border-slate-300 bg-white'
                                }`}
                              >
                                {isSelected && <Check size={10} strokeWidth={3} />}
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="text-[11px] font-medium block truncate">{prod.name}</span>
                                <span className="text-[10px] text-orange-600 font-bold block">{prod.price}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {selectedRetail.length > 0 && (
                        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-200">
                          <span>Đã chọn: <strong className="text-orange-600">{selectedRetail.length} món lẻ</strong></span>
                          <button
                            type="button"
                            onClick={() => setSelectedRetail([])}
                            className="text-slate-400 hover:text-red-500 underline"
                          >
                            Xóa chọn lẻ
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Live Selected Summary Tag */}
                {totalSelectedCount > 0 && (
                  <div className="p-3 rounded-xl bg-orange-50/80 border border-orange-200 flex items-center gap-2">
                    <CheckCircle size={15} className="text-orange-600 flex-shrink-0" />
                    <p className="text-xs text-orange-800 font-medium">
                      Tổng cộng đã chọn: <strong>{totalSelectedCount} sản phẩm</strong> ({selectedHampers.length} Hamper + {selectedRetail.length} món lẻ)
                    </p>
                  </div>
                )}
              </div>
            </Step>

            {/* Step 3: Số lượng & Ghi chú */}
            <Step title="Số lượng">
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0">
                    <Hash size={15} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Số lượng & Yêu cầu</p>
                    <p className="text-xs text-slate-400">Bước 3/4: Số lượng dự kiến và yêu cầu riêng</p>
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor="cf-qty">
                    Số lượng hộp dự kiến <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cf-qty"
                    type="number"
                    min="1"
                    placeholder="Ví dụ: 50"
                    value={form.quantity}
                    onChange={set('quantity')}
                    className={inputClass(!!errors.quantity)}
                    inputMode="numeric"
                  />
                  {errors.quantity && (
                    <span className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1.5 animate-fadeIn">
                      <AlertCircle size={12} className="flex-shrink-0" />
                      <span>{errors.quantity}</span>
                    </span>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="cf-note">
                    <span className="flex items-center gap-1.5">
                      <FileText size={11} />
                      Yêu cầu thêm
                      <span className="font-normal text-slate-400">(không bắt buộc)</span>
                    </span>
                  </label>
                  <textarea
                    id="cf-note"
                    rows={3}
                    placeholder="In logo công ty ép kim, địa chỉ giao hàng, xuất hóa đơn VAT, ngày giao dự kiến..."
                    value={form.note}
                    onChange={set('note')}
                    className={`${inputClass(false)} resize-none`}
                  />
                </div>
              </div>
            </Step>

            {/* Step 4: Xác nhận */}
            <Step title="Xác nhận">
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={15} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Kiểm tra thông tin</p>
                    <p className="text-xs text-slate-400">Bước 4/4: Xác nhận trước khi gửi yêu cầu báo giá</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 divide-y divide-slate-100 overflow-hidden text-xs">
                  <div className="flex items-start gap-3 px-3.5 py-2.5">
                    <User size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Họ và tên</span>
                      <span className="font-semibold text-slate-800">{form.name || '—'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 px-3.5 py-2.5">
                    <Phone size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Số điện thoại</span>
                      <span className="font-semibold text-slate-800">{form.phone || '—'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 px-3.5 py-2.5">
                    <Package size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                        Sản phẩm đã chọn ({totalSelectedCount})
                      </span>
                      <div className="mt-1 space-y-1">
                        {selectedHampers.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-orange-600 block">Set Hamper Tết ({selectedHampers.length}):</span>
                            <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5">
                              {selectedHampers.map((h, i) => (
                                <li key={i}>{h}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {selectedRetail.length > 0 && (
                          <div className="pt-1">
                            <span className="text-[10px] font-bold text-blue-600 block">Sản phẩm lẻ ({selectedRetail.length}):</span>
                            <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5">
                              {selectedRetail.map((r, i) => (
                                <li key={i}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 px-3.5 py-2.5">
                    <Hash size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Số lượng đặt</span>
                      <span className="font-semibold text-slate-800">{form.quantity ? `${form.quantity} hộp` : '—'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 px-3.5 py-2.5">
                    <FileText size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Ghi chú</span>
                      <span className="font-semibold text-slate-800 break-words">{form.note || 'Không có ghi chú'}</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                  Nhấn <strong className="text-orange-600">"Gửi yêu cầu báo giá"</strong> để hoàn tất. Yêu cầu sẽ được chuyển đến ban quản trị LisaFood xử lý.
                </p>
              </div>
            </Step>
          </Stepper>
        </AnimatedContent>

        {/* Contact info strip */}
        <AnimatedContent
          distance={30}
          direction="vertical"
          duration={0.7}
          ease="power3.out"
          blur={0}
          delay={0.2}
          threshold={0.1}
          className="mt-7 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-slate-500"
        >
          <a
            href={`tel:${(contact.hotline1 || '0393.955.516').replace(/\./g, '')}`}
            className="inline-flex items-center gap-2 font-semibold text-slate-700 hover:text-orange-600 transition-colors"
          >
            <Phone size={15} className="text-orange-500" />
            {contact.hotline1 || '0393.955.516'}
          </a>
          {contact.hotline2 && (
            <>
              <span className="hidden sm:block w-px h-4 bg-slate-200" />
              <a
                href={`tel:${contact.hotline2.replace(/\./g, '')}`}
                className="inline-flex items-center gap-2 font-semibold text-slate-700 hover:text-orange-600 transition-colors"
              >
                <Phone size={15} className="text-orange-500" />
                {contact.hotline2}
              </a>
            </>
          )}
          <span className="hidden sm:block w-px h-4 bg-slate-200" />
          <a
            href={`mailto:${contact.email || 'sale@lisafood.vn'}`}
            className="inline-flex items-center gap-2 font-semibold text-slate-700 hover:text-orange-600 transition-colors"
          >
            <Mail size={15} className="text-orange-500" />
            {contact.email || 'sale@lisafood.vn'}
          </a>
        </AnimatedContent>
      </div>
    </section>
  );
}
