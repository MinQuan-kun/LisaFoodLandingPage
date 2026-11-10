import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

export default function LightboxModal({
  isOpen,
  images = [],
  initialIndex = 0,
  onClose,
  title = ''
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const handleNext = () => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in touch-none sm:touch-auto">
      {/* Top Bar Controls */}
      <div className="absolute top-0 inset-x-0 p-3 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/85 via-black/40 to-transparent">
        <div className="pr-2 min-w-0">
          <h3 className="text-orange-400 font-semibold text-sm sm:text-lg truncate">{title || 'Chi Tiết Hamper Tết LisaFood'}</h3>
          <p className="text-[10px] sm:text-xs text-slate-400">
            {currentIndex + 1} / {images.length} (Lướt hoặc bấm mũi tên để xem)
          </p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title={isZoomed ? "Thu nhỏ" : "Phóng to HD"}
            aria-label="Zoom"
          >
            {isZoomed ? <ZoomOut size={18} className="sm:w-5 sm:h-5" /> : <ZoomIn size={18} className="sm:w-5 sm:h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-red-500/80 text-white transition-colors"
            title="Đóng (Esc)"
            aria-label="Close"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-8 z-20 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-orange-500 text-white hover:text-white transition-all shadow-lg backdrop-blur-sm active:scale-90"
            aria-label="Ảnh trước"
          >
            <ChevronLeft size={20} className="sm:w-7 sm:h-7" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-8 z-20 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-orange-500 text-white hover:text-white transition-all shadow-lg backdrop-blur-sm active:scale-90"
            aria-label="Ảnh tiếp"
          >
            <ChevronRight size={20} className="sm:w-7 sm:h-7" />
          </button>
        </>
      )}

      {/* Center Image */}
      <div
        className="max-w-6xl max-h-[70vh] sm:max-h-[75vh] p-2 sm:p-4 flex items-center justify-center overflow-auto cursor-zoom-in"
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <img
          src={images[currentIndex]}
          alt={`Lisa Food Gift View ${currentIndex + 1}`}
          className={`max-h-[70vh] sm:max-h-[75vh] w-auto max-w-[95vw] object-contain rounded-xl shadow-2xl transition-transform duration-300 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 hover:scale-[1.02]'
          }`}
          style={{ imageRendering: '-webkit-optimize-contrast' }}
        />
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-4 inset-x-0 flex items-center justify-center gap-1.5 sm:gap-2 p-2 sm:p-3 overflow-x-auto no-scrollbar z-20 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsZoomed(false);
                setCurrentIndex(idx);
              }}
              className={`relative h-10 w-14 sm:h-14 sm:w-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                currentIndex === idx
                  ? 'border-orange-500 scale-105 ring-2 ring-orange-500/50'
                  : 'border-white/20 opacity-50 hover:opacity-100'
              }`}
            >
              <img src={img} alt="thumb" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
