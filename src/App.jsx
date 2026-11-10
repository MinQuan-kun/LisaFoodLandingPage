import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GiftCard from './components/GiftCard';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import StickyMobileBar from './components/StickyMobileBar';
import LightboxModal from './components/LightboxModal';
import AnimatedContent from './components/AnimatedContent';
import { SiteDataProvider, useSiteData } from './context/SiteDataContext';
import { Eye, Image as ImageIcon, ShoppingBag, MessageCircle } from 'lucide-react';

function LandingPageContent() {
  const { giftBoxes, retailProducts, contact } = useSiteData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [retailFilter, setRetailFilter] = useState('all');
  
  // Lightbox State
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    images: [],
    initialIndex: 0,
    title: ''
  });

  const handleOpenLightbox = (images, initialIndex = 0, title = '') => {
    setLightbox({
      isOpen: true,
      images,
      initialIndex,
      title
    });
  };

  const handleCloseLightbox = () => {
    setLightbox((prev) => ({ ...prev, isOpen: false }));
  };

  const filteredBoxes = selectedCategory === 'all'
    ? giftBoxes
    : giftBoxes.filter((box) => box.category === selectedCategory);

  const filteredRetail = retailProducts.filter((item) => {
    if (retailFilter === 'all') return true;
    if (retailFilter === 'dieu') return item.name.toLowerCase().includes('hạt điều');
    if (retailFilter === 'macca') return item.name.toLowerCase().includes('macca') || item.name.toLowerCase().includes('hạnh nhân');
    if (retailFilter === 'kho') return item.name.toLowerCase().includes('khô gà') || item.name.toLowerCase().includes('sachi') || item.name.toLowerCase().includes('nho');
    return true;
  });

  const unboxingGallery = [
    { img: '/images/hamper-sac-xuan-01-a.jpg', title: 'Sắc Xuân 01 (A) - Hộp 2 Tầng Kèm Túi Xách' },
    { img: '/images/hamper-ngoc-vu-khai-loc-a.jpg', title: 'Ngọc Vũ Khai Lộc (A) - Đèn LED Phát Sáng' },
    { img: '/images/hamper-xuan-hoan-ca.jpg', title: 'Xuân Hoan Ca - Kèm Vang Trắng Ý Paolini Lucido' },
    { img: '/images/hamper-huong-xuan.jpg', title: 'Hương Xuân - Biểu Tượng Linh Dương Thịnh Vượng' },
    { img: '/images/hamper-tet-lac-hong.jpg', title: 'Tết Lạc Hồng - Kiệt Tác Quà Tết Thượng Hạng' },
    { img: '/images/catalogue-tet-2027-lisafood.jpg', title: 'Catalogue Hamper Tết 2027 LisaFood' }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 flex flex-col font-sans selection:bg-orange-500/20 selection:text-orange-600 overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero onOpenLightbox={handleOpenLightbox} />

        {/* Hamper Tết Showcase Section (Lookbook Grid) */}
        <section id="hamper" className="py-12 sm:py-20 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 scroll-mt-20 sm:scroll-mt-24">
          
          {/* Section Header with AnimatedContent */}
          <AnimatedContent
            distance={70}
            direction="vertical"
            duration={0.8}
            ease="power3.out"
            blur={0}
            stagger={0.08}
            threshold={0.1}
            className="text-center max-w-3xl mx-auto mb-8 sm:mb-14 space-y-3 sm:space-y-4"
          >
            <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              Bộ Sưu Tập Hamper Tết 2027
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-serif-luxury tracking-tight leading-tight">
              Tuyển Tập Hamper Tết Cao Cấp
            </h2>
            <p className="text-slate-600 text-xs sm:text-base font-normal leading-relaxed px-2">
              Khám phá {giftBoxes.length} set Hamper Tết được thiết kế trang nhã, kết hợp hoàn hảo giữa nông sản Việt xuất khẩu, hạt dinh dưỡng chuẩn quốc tế và rượu vang danh tiếng.
            </p>

            {/* Filter Tabs: Tối ưu 2 cột trên Mobile (2x2 grid), Căn giữa mượt mà trên Desktop */}
            <div className="pt-3 sm:pt-4 max-w-2xl mx-auto px-1">
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2 sm:gap-2.5">
                {[
                  { id: 'all', label: `Tất Cả (${giftBoxes.length} Set)` },
                  { id: 'sac-xuan', label: 'Sắc Xuân 2 Tầng' },
                  { id: 'khai-loc', label: 'Khai Lộc Đèn LED' },
                  { id: 'vang', label: 'Xuân Hoan Ca & Vang' }
                ].map((tab) => {
                  const isActive = selectedCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedCategory(tab.id)}
                      className={`px-3 sm:px-5 py-2.5 sm:py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/25 border border-orange-500'
                          : 'bg-white border border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-300 shadow-sm'
                      }`}
                    >
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0 animate-pulse" />}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </AnimatedContent>

          {/* Hamper Boxes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBoxes.map((box, index) => (
              <AnimatedContent
                key={box.id || index}
                distance={60}
                direction="vertical"
                duration={0.7}
                ease="power3.out"
                blur={0}
                delay={index * 0.08}
                threshold={0.1}
              >
                <GiftCard box={box} onOpenLightbox={handleOpenLightbox} />
              </AnimatedContent>
            ))}
          </div>
        </section>

        {/* Gallery / Unboxing Chi Tiết Thiết Kế */}
        <section id="unboxing" className="py-12 sm:py-20 bg-white border-y border-orange-100/70 scroll-mt-20 sm:scroll-mt-24">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
            <AnimatedContent
              distance={60}
              direction="vertical"
              duration={0.7}
              ease="power3.out"
              blur={0}
              threshold={0.1}
              className="text-center max-w-3xl mx-auto mb-8 sm:mb-14 space-y-3"
            >
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-sm">
                <ImageIcon size={13} className="text-orange-500" />
                Nghệ Thuật Đóng Gói
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-serif-luxury tracking-tight leading-tight">
                Chi Tiết Thiết Kế & Hộp Quà Thực Tế
              </h2>
              <p className="text-slate-600 text-xs sm:text-base leading-relaxed px-2">
                Mỗi hộp quà LisaFood là sự tỉ mỉ từ khâu chọn lọc nguyên liệu xuất khẩu đến thiết kế bao bì ép kim sang trọng, tạo nên ấn tượng đẳng cấp khi trao tặng.
              </p>
            </AnimatedContent>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6">
              {unboxingGallery.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleOpenLightbox(unboxingGallery.map(g => g.img), idx, item.title)}
                  className="group relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden cursor-zoom-in bg-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    style={{ imageRendering: '-webkit-optimize-contrast' }}
                    onError={(e) => {
                      e.currentTarget.src = "/home-banner/qua_tang.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 sm:p-4">
                    <p className="text-white text-[11px] sm:text-sm font-bold line-clamp-2 leading-snug">{item.title}</p>
                    <span className="text-orange-300 text-[9px] sm:text-xs font-medium flex items-center gap-1 mt-1">
                      <Eye size={12} /> Nhấn để phóng to HD
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Retail Products Section (28 Sản phẩm lẻ) */}
        <section id="retail" className="py-12 sm:py-20 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 scroll-mt-20 sm:scroll-mt-24">
          <AnimatedContent
            distance={60}
            direction="vertical"
            duration={0.7}
            ease="power3.out"
            blur={0}
            threshold={0.1}
            className="text-center max-w-3xl mx-auto mb-8 sm:mb-14 space-y-3"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-sm">
              <ShoppingBag size={13} className="text-orange-500" />
              Sản Phẩm Lẻ Chọn Lọc
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-serif-luxury tracking-tight leading-tight">
              Hạt Dinh Dưỡng & Đặc Sản Cao Cấp
            </h2>
            <p className="text-slate-600 text-xs sm:text-base leading-relaxed px-2">
              Bên cạnh các set Hamper Tết hoàn chỉnh, LisaFood cung cấp {retailProducts.length} dòng sản phẩm hạt dinh dưỡng xuất khẩu và đặc sản sấy giòn đóng hũ chuẩn sang trọng.
            </p>

            {/* Filter Tabs for Retail Products: Tối ưu 2 cột trên Mobile (2x2 grid), Căn giữa trên Desktop */}
            <div className="pt-3 sm:pt-4 max-w-2xl mx-auto px-1">
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2 sm:gap-2.5">
                {[
                  { id: 'all', label: `Tất Cả (${retailProducts.length})` },
                  { id: 'dieu', label: 'Hạt Điều Cao Cấp' },
                  { id: 'macca', label: 'Macca & Hạnh Nhân' },
                  { id: 'kho', label: 'Khô Gà & Trái Cây' }
                ].map((tab) => {
                  const isActive = retailFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setRetailFilter(tab.id)}
                      className={`px-3 sm:px-4 py-2 sm:py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/25 border border-orange-500'
                          : 'bg-white border border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-300 shadow-sm'
                      }`}
                    >
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0 animate-pulse" />}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </AnimatedContent>

          {/* Retail Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {filteredRetail.map((prod, idx) => (
              <AnimatedContent
                key={idx}
                distance={40}
                direction="vertical"
                duration={0.6}
                ease="power3.out"
                blur={0}
                delay={(idx % 4) * 0.05}
                threshold={0.1}
              >
                <div className="h-full bg-white rounded-xl sm:rounded-2xl border border-orange-100/80 hover:border-orange-300 p-2.5 sm:p-4 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 group">
                  <div>
                    {/* Product Photo */}
                    <div
                      onClick={() => handleOpenLightbox([prod.image], 0, prod.name)}
                      className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-b from-slate-50 to-orange-50/20 mb-2 sm:mb-3 cursor-zoom-in border border-slate-100 flex items-center justify-center p-2 sm:p-2.5"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        style={{ imageRendering: '-webkit-optimize-contrast' }}
                        onError={(e) => {
                          e.currentTarget.src = "/home-banner/hat_dieu.jpg";
                        }}
                      />
                      <div className="absolute top-1.5 left-1.5">
                        <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-[9px] sm:text-[10px] font-bold text-orange-700 border border-orange-100 shadow-sm leading-none">
                          {prod.tag}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="p-1.5 sm:p-2 rounded-full bg-white/95 text-orange-600 shadow-md">
                          <Eye size={14} className="sm:w-4 sm:h-4" />
                        </span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h4 className="text-[11px] sm:text-sm font-bold text-slate-800 line-clamp-2 min-h-[2.4em] group-hover:text-orange-600 transition-colors leading-snug">
                      {prod.name}
                    </h4>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-2 sm:pt-3 mt-1.5 sm:mt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 sm:gap-2">
                    <div>
                      <span className="text-xs sm:text-base font-extrabold text-orange-600 font-serif-luxury block">
                        {prod.price}
                      </span>
                      <span className="text-[8px] sm:text-[9px] text-slate-400 block font-medium">Niêm yết</span>
                    </div>

                    <a
                      href={contact.zaloUrl || "https://zalo.me/0393955516"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white border border-orange-200 hover:border-orange-500 text-[10px] sm:text-[11px] font-bold transition-all shadow-sm active:scale-95 flex-shrink-0"
                    >
                      <MessageCircle size={11} className="sm:w-3 sm:h-3" />
                      <span>Đặt Zalo</span>
                    </a>
                  </div>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </section>

        {/* Section Liên Hệ Báo Giá với Stepper Component */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Sticky Mobile Bar for 1-Tap Call / Zalo */}
      <StickyMobileBar />

      {/* Full-Screen HD Lightbox Modal */}
      <LightboxModal
        isOpen={lightbox.isOpen}
        images={lightbox.images}
        initialIndex={lightbox.initialIndex}
        onClose={handleCloseLightbox}
        title={lightbox.title}
      />
    </div>
  );
}

export default function App() {
  return (
    <SiteDataProvider>
      <LandingPageContent />
    </SiteDataProvider>
  );
}
