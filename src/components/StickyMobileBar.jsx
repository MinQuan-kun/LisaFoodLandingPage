import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export default function StickyMobileBar() {
  const { contact } = useSiteData();
  const phone = contact.hotline1 || '0393.955.516';
  const rawPhone = phone.replace(/\./g, '');
  const zaloUrl = contact.zaloUrl || 'https://zalo.me/0393955516';

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 px-3 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-white/95 backdrop-blur-xl border-t border-orange-100 md:hidden flex items-center gap-2.5 shadow-[0_-8px_25px_rgba(0,0,0,0.08)]">
      <a
        href={zaloUrl}
        target="_blank"
        rel="noreferrer"
        className="flex-1 py-3 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-600 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
      >
        <MessageCircle size={15} className="text-orange-500 flex-shrink-0" />
        <span>Chat Zalo Báo Giá</span>
      </a>

      <a
        href={`tel:${rawPhone}`}
        className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-lg shadow-orange-500/25"
      >
        <Phone size={14} className="flex-shrink-0" />
        <span>Gọi: {phone}</span>
      </a>
    </div>
  );
}
