import React from 'react';
import { Eye, ArrowDown, ArrowRight } from 'lucide-react';
import CountUp from './CountUp';
import MaskedHeading from './MaskedHeading';
import { useSiteData } from '../context/SiteDataContext';

export default function Hero({ onOpenLightbox }) {
  const { hero } = useSiteData();

  return (
    <section className="relative pt-28 pb-14 sm:pt-36 sm:pb-24 md:pt-44 md:pb-32 overflow-hidden flex items-center min-h-[75vh] sm:min-h-[85vh]">
      
      {/* Background Image: Hiển thị rõ ảnh banner thực tế do admin cấu hình */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={hero.bannerImage || "/images/catalogue-tet-2027-lisafood.jpg"}
          alt="LisaFood Hamper Tết 2027 Background"
          className="w-full h-full object-cover object-center lg:object-right brightness-[0.96] contrast-[1.12]"
          style={{ imageRendering: '-webkit-optimize-contrast' }}
          onError={(e) => {
            e.currentTarget.src = "/home-banner/qua_tang.jpg";
          }}
        />
        {/* Dải gradient ngang: Êm dịu ở bên trái để đọc chữ rõ ràng, trong suốt hoàn toàn ở bên phải để thấy trọn vẹn hộp quà */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fafafa] via-[#fafafa]/85 md:via-[#fafafa]/25 to-transparent" />
        {/* Dải gradient dọc nhẹ ở đỉnh và chân để hòa quyện với trang */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fafafa]/50 via-transparent to-[#fafafa]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Toàn bộ nội dung hiển thị gọn gàng ở BÊN TRÁI (Left-Aligned) */}
        <div className="max-w-2xl text-left space-y-4 sm:space-y-6">
          
          {/* MaskedHeading (Hiển thị bên trái) */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="max-w-lg">
              <MaskedHeading
                text={hero.title || "LISA FOOD HAMPER TẾT 2027"}
                tag="h1"
                mediaType="image"
                src={hero.bannerImage || "/images/catalogue-tet-2027-lisafood.jpg"}
                fillScale={1.3}
                parallax={30}
                reveal="rise"
                trigger="view"
                spotlight
                spotlightRadius={180}
                align="left"
                weight={800}
                textScale={0.1}
                className="font-serif-luxury text-slate-900"
              />
            </div>
            
            <p className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-serif-luxury tracking-tight leading-tight">
              {hero.subtitle || "Hamper Tết 2027: Quà Tặng Nông Sản Việt"}
            </p>
          </div>

          <p className="text-slate-800 text-sm sm:text-lg max-w-xl leading-relaxed font-normal [text-shadow:0_1px_3px_rgba(255,255,255,0.9)]">
            {hero.description || "LisaFood tuyển chọn thực phẩm cao cấp từ các nông trại đạt chuẩn, gói trọn lời chúc xuân an khang vào từng set Hamper sang trọng, sạch và an toàn cho doanh nghiệp."}
          </p>

          {/* Hàng số liệu với Component <CountUp /> (Động từ Admin) */}
          <div className="pt-2 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg">
            {hero.stats?.map((stat, idx) => {
              const isAccent = idx !== 1;
              return (
                <div
                  key={stat.id || idx}
                  className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 backdrop-blur-sm border border-orange-100 shadow-sm text-center"
                >
                  <div
                    className={`text-xl sm:text-3xl font-extrabold font-serif-luxury ${
                      isAccent ? 'text-orange-600' : 'text-slate-900'
                    }`}
                  >
                    <CountUp
                      to={stat.value}
                      from={0}
                      separator=","
                      prefix={stat.prefix || ''}
                      suffix={stat.suffix || ''}
                      duration={1.8}
                      mode="count"
                      easing="easeOut"
                      trigger="view"
                    />
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-600 font-semibold mt-0.5 sm:mt-1 leading-tight">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Chỉ dẫn cuộn xuống */}
      <div className="absolute bottom-4 sm:bottom-6 left-6 sm:left-12 z-10 hidden sm:block">
        <a
          href="#hamper"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 text-xs tracking-wider uppercase font-semibold transition-colors"
        >
          <span>Cuộn xem Hamper Tết</span>
          <ArrowDown size={14} className="animate-bounce text-orange-500" />
        </a>
      </div>
    </section>
  );
}
