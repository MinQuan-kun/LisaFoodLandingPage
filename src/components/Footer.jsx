import React from 'react';
import { Phone, Mail, MapPin, Globe, ExternalLink, Settings } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export default function Footer({ onOpenAdmin }) {
  const { contact } = useSiteData();

  return (
    <footer id="contact" className="bg-gradient-to-b from-white to-orange-50/40 border-t border-orange-100 pt-12 sm:pt-16 pb-32 md:pb-16 text-slate-600 text-xs">
      {/* Anchor #ve-chung-toi phục vụ trỏ link */}
      <div id="ve-chung-toi" className="scroll-mt-24" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Lisa Food" className="h-10 w-auto" onError={(e) => e.currentTarget.src = "/logo_transference.png"} />
              <span className="text-xl font-bold text-orange-600 font-serif-luxury">LISA FOOD GLOBAL</span>
            </div>
            <p className="text-slate-600 leading-relaxed max-w-sm">
              Đơn vị sản xuất và cung ứng nông sản chế biến, hạt dinh dưỡng xuất khẩu và bộ quà tặng thực phẩm cao cấp chuẩn quốc tế tại Việt Nam.
            </p>

            {/* Về chúng tôi link trỏ về lisafood.vn */}
            <div className="pt-1">
              <a
                href={contact.websiteUrl || "https://lisafood.vn"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-100/70 hover:bg-orange-500 text-orange-700 hover:text-white font-bold text-xs transition-all shadow-sm group"
              >
                <span>Về Chúng Tôi (LisaFood.vn)</span>
                <ExternalLink size={13} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            <div className="pt-2 text-[11px] text-slate-400">
              Mã số thuế: 0317316788 • Cấp bởi Sở Kế hoạch và Đầu tư TP.HCM
            </div>
          </div>

          {/* Quick Contact & Showroom */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider">
              Liên Hệ Xem Mẫu Thực Tế
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <span>Showroom & Trụ sở: {contact.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-orange-500 flex-shrink-0" />
                <span>
                  Hotline: <a href={`tel:${contact.hotline1?.replace(/\./g, '')}`} className="text-orange-600 font-bold hover:underline">{contact.hotline1}</a>
                  {contact.hotline2 && (
                    <> - <a href={`tel:${contact.hotline2?.replace(/\./g, '')}`} className="text-orange-600 font-bold hover:underline">{contact.hotline2}</a></>
                  )}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-orange-500 flex-shrink-0" />
                <span>
                  Email: <a href={`mailto:${contact.email}`} className="text-slate-800 font-semibold hover:text-orange-600">{contact.email}</a>
                  {contact.emailSecondary && <> / {contact.emailSecondary}</>}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe size={16} className="text-orange-500 flex-shrink-0" />
                <span>
                  Website chính thức:{' '}
                  <a
                    href={contact.websiteUrl || "https://lisafood.vn"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-600 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    lisafood.vn
                    <ExternalLink size={12} />
                  </a>
                </span>
              </li>
            </ul>
          </div>

          {/* Hours & Support */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider">
              Thời Gian Làm Việc
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {contact.workingHours || "Thứ 2 – Thứ 7: 08:00 – 18:00 | Chủ Nhật: Hotline & Zalo 24/7"}
            </p>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-slate-500">
          <p>© 2027 LisaFood. Bản quyền bộ sưu tập Hamper Tết thuộc về Công ty TNHH Lisa Food.</p>
        </div>

      </div>
    </footer>
  );
}
