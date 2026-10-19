import React, { useState } from 'react';
import { Eye, ArrowRight, RotateCw } from 'lucide-react';

interface HologramViewerProps {
  productImage: string;
  productName: string;
  onBack: () => void;
}

export const HologramViewer: React.FC<HologramViewerProps> = ({
  productImage,
  productName,
  onBack,
}) => {
  const [isRotating, setIsRotating] = useState(true);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden select-none">
      {/* شريط أدوات التحكم العلوي (يختفي لصفاء العرض) */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50 opacity-40 hover:opacity-100 transition-opacity">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-slate-900/80 text-white px-4 py-2 rounded-xl text-sm border border-slate-700 backdrop-blur-md"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للمتجر</span>
        </button>

        <div className="text-center text-cyan-400 font-bold text-sm tracking-wider">
          وضع الهولوجرام النشط · {productName}
        </div>

        <button
          onClick={() => setIsRotating(!isRotating)}
          className="flex items-center gap-2 bg-slate-900/80 text-cyan-400 px-4 py-2 rounded-xl text-sm border border-slate-700 backdrop-blur-md"
        >
          <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
          <span>{isRotating ? 'إيقاف الدوران' : 'تشغيل الدوران'}</span>
        </button>
      </div>

      {/* منطقة مسرح الهولوجرام الرباعي */}
      <div className="relative w-[340px] h-[340px] md:w-[480px] md:h-[480px] flex items-center justify-center">
        {/* علامة المركز لتثبيت قمة الهرم البلاستيكي */}
        <div className="absolute w-12 h-12 border border-cyan-500/20 rounded-full flex items-center justify-center pointer-events-none">
          <div className="w-2 h-2 bg-cyan-400/40 rounded-full animate-ping" />
          <span className="absolute -bottom-6 text-[10px] text-cyan-400/50 whitespace-nowrap">
            ضع قمة الهرم هنا
          </span>
        </div>

        {/* 1. الجهة العليا (متجهة للأسفل) */}
        <div className="absolute top-0 flex flex-col items-center transform rotate-180">
          <HologramItem image={productImage} isRotating={isRotating} />
        </div>

        {/* 2. الجهة السفلى (متجهة للأعلى) */}
        <div className="absolute bottom-0 flex flex-col items-center">
          <HologramItem image={productImage} isRotating={isRotating} />
        </div>

        {/* 3. الجهة اليسرى (متجهة لليمين) */}
        <div className="absolute left-0 flex flex-col items-center transform rotate-90">
          <HologramItem image={productImage} isRotating={isRotating} />
        </div>

        {/* 4. الجهة اليمنى (متجهة لليسار) */}
        <div className="absolute right-0 flex flex-col items-center transform -rotate-90">
          <HologramItem image={productImage} isRotating={isRotating} />
        </div>
      </div>

      {/* تنبيه تعليمي في الأسفل */}
      <div className="absolute bottom-6 text-slate-500 text-xs text-center flex items-center gap-1.5 opacity-60">
        <Eye className="w-3.5 h-3.5 text-cyan-500" />
        <span>ضع هرم البلاستيك الشفاف في المنتصف وانظر من الجوانب بمستوى العين</span>
      </div>
    </div>
  );
};

// عنصر الصورة المعكوسة والمتحركة
const HologramItem: React.FC<{ image: string; isRotating: boolean }> = ({ image, isRotating }) => {
  return (
    <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center p-2">
      <img
        src={image}
        alt="Hologram Source"
        className={`max-w-full max-h-full object-contain filter drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] ${
          isRotating ? 'animate-pulse' : ''
        }`}
        style={{
          // فلاتر لتعزيز الانعكاس والظهور الفضائي للهولوجرام
          filter: 'drop-shadow(0 0 10px #06b6d4) contrast(1.15) brightness(1.2)',
        }}
      />
    </div>
  );
};