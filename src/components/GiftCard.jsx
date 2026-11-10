import React from 'react';
import { Eye, Package, CheckCircle2, ChevronRight, ZoomIn } from 'lucide-react';
import SpotlightCard from './SpotlightCard';
import TiltedCard from './TiltedCard';

export default function GiftCard({ box, onOpenLightbox }) {
  return (
    <TiltedCard rotateAmplitude={5} scaleOnHover={1.015} className="h-full">
      <SpotlightCard className="h-full flex flex-col justify-between p-4 sm:p-6 bg-white border-orange-100 hover:border-orange-300 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 rounded-2xl sm:rounded-3xl">
        
        {/* Top Header: Tag & Zoom Pill */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-[10px] sm:text-[11px] font-bold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              {box.tag}
            </span>


          </div>

          {/* Photo Showcase Container: Tỉ lệ 4:3 phù hợp hộp quà, ảnh fill trọn khung, hover zoom nhẹ */}
          <div
            className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden cursor-zoom-in group mb-4 sm:mb-5 bg-gradient-to-b from-slate-50 to-orange-50/20 border border-slate-100 shadow-inner"
            onClick={() => onOpenLightbox(box.gallery, 0, box.name)}
          >
            <img
              src={box.coverImage}
              alt={box.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="p-2 sm:p-2.5 rounded-full bg-white/95 text-orange-600 shadow-lg border border-orange-200 scale-90 group-hover:scale-100 transition-transform">
                <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
              </span>
            </div>

            <div className="absolute bottom-2 right-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/90 backdrop-blur-md text-orange-600 text-[9px] sm:text-[10px] font-bold border border-orange-200 shadow-sm">
                <Eye size={10} />
                <span>Xem ảnh HD</span>
              </span>
            </div>
          </div>

          {/* Title, Price & Subtitle (Tối ưu chống tràn chữ trên mobile) */}
          <div className="space-y-1 mb-3.5 sm:mb-4">
            <div className="flex flex-col xs:flex-row xs:items-baseline justify-between gap-1 xs:gap-3">
              <h3 className="text-lg sm:text-2xl font-bold text-slate-900 font-serif-luxury group-hover:text-orange-600 transition-colors leading-snug">
                {box.name}
              </h3>
              <div className="text-left xs:text-right flex items-baseline xs:flex-col gap-2 xs:gap-0 flex-shrink-0">
                <span className="text-xl sm:text-2xl font-black text-orange-600 font-serif-luxury tracking-tight">
                  {box.price}
                </span>
                <span className="block text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold">Giá niêm yết</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {box.subtitle}
            </p>
          </div>

          {/* Inside Items List */}
          <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-orange-600 font-bold flex items-center gap-1.5">
              <Package size={12} className="sm:w-[13px] sm:h-[13px]" />
              Thành phần tuyển chọn bên trong:
            </p>
            <div className="grid grid-cols-1 gap-1 sm:gap-1.5">
              {box.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-orange-50/40 border border-orange-100/70 gap-2"
                >
                  <span className="text-slate-800 flex items-center gap-1.5 sm:gap-2 font-medium min-w-0">
                    <CheckCircle2 size={12} className="text-orange-500 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className="text-orange-600 font-bold text-[10px] sm:text-[11px] flex-shrink-0 whitespace-nowrap">
                    {item.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </SpotlightCard>
    </TiltedCard>
  );
}
