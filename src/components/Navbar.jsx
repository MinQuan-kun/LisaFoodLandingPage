import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, MessageCircle, Menu, X, ChevronRight, Settings } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Hamper Tết 2027', href: '#hamper' },
  { label: 'Sản Phẩm Lẻ', href: '#retail' },
  { label: 'Chi Tiết Thiết Kế', href: '#unboxing' },
  { label: 'Liên Hệ Báo Giá', href: '#baogia' }
];

export default function Navbar({ onOpenAdmin }) {
  const { contact } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const linksRef = useRef(null);
  const highlightRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      if (window.scrollY > 100) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const positionHighlight = useCallback((el) => {
    const highlight = highlightRef.current;
    const container = linksRef.current;
    if (!highlight || !container || !el) return;
    const linkRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    highlight.style.width = `${linkRect.width}px`;
    highlight.style.height = `${linkRect.height}px`;
    highlight.style.transform = `translateX(${linkRect.left - containerRect.left}px)`;
    highlight.style.opacity = '1';
  }, []);

  const handleMouseLeaveLinks = useCallback(() => {
    if (highlightRef.current) {
      highlightRef.current.style.opacity = '0';
    }
  }, []);

  const rawPhone = (contact.hotline1 || '0393.955.516').replace(/\./g, '');

  return (
    <nav className={`ln-navbar ${scrolled ? 'ln-navbar-scrolled' : ''}`}>
      <div className="ln-navbar-inner">
        {/* Brand Logo & Title */}
        <a href="#" className="flex items-center gap-2 group flex-shrink-0">
          <img
            src="/logo.png"
            alt="Lisa Food Logo"
            className="h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "/logo_transference.png";
            }}
          />
          <div>
            <span className="block text-sm sm:text-lg font-bold tracking-wider text-orange-600 font-serif-luxury leading-tight">
              LISA FOOD
            </span>
            <span className="hidden sm:block text-[9px] tracking-widest text-slate-500 uppercase font-semibold">
              Hamper Tết 2027
            </span>
          </div>
        </a>

        {/* Center Nav Links with Floating Pill Highlight (Desktop only >= 1024px) */}
        <div
          ref={linksRef}
          onMouseLeave={handleMouseLeaveLinks}
          className="ln-navbar-links"
        >
          <div ref={highlightRef} className="ln-navbar-link-highlight" />
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onMouseEnter={(e) => positionHighlight(e.currentTarget)}
              className="ln-navbar-link"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Action CTA Buttons & Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Zalo Button (Chỉ hiển thị Desktop/Tablet >= 640px) */}
          <a
            href={contact.zaloUrl || "https://zalo.me/0393955516"}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 text-xs font-bold tracking-wide transition-all"
          >
            <MessageCircle size={13} />
            <span>Zalo Báo Giá</span>
          </a>

          {/* Hotline Button: Chỉ hiển thị Desktop/Tablet >= 640px, ẩn hoàn toàn trên mobile */}
          <a
            href={`tel:${rawPhone}`}
            className="hidden sm:inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-md shadow-orange-500/25 transition-all hover:scale-105 active:scale-95"
            title={`Gọi Hotline ${contact.hotline1 || '0393.955.516'}`}
          >
            <Phone size={12} className="sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline">Hotline:</span>
            <span>{contact.hotline1 || '0393.955.516'}</span>
          </a>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-orange-600 hover:bg-orange-50 focus:outline-none transition-colors"
            aria-label="Mở menu chuyển mục"
          >
            {mobileMenuOpen ? <X size={20} className="text-orange-600" /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Floating Dropdown Drawer (Chỉ hiển thị các mục chuyển nhanh khu vực) */}
      {mobileMenuOpen && (
        <div className="w-full max-w-[420px] mt-2 p-3 sm:p-4 bg-white/95 backdrop-blur-2xl border border-orange-200/90 rounded-2xl shadow-2xl flex flex-col gap-1 pointer-events-auto lg:hidden transition-all duration-300">
          <p className="text-[10px] uppercase font-bold tracking-wider text-orange-600 px-3 pt-1 pb-0.5">
            Chuyển Nhanh Khu Vực
          </p>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:text-orange-600 hover:bg-orange-50 transition-all flex items-center justify-between"
            >
              <span>{link.label}</span>
              <ChevronRight size={14} className="text-orange-400" />
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
