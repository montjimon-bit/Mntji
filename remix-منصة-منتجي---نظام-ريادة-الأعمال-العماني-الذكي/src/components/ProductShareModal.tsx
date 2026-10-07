import React, { useState } from 'react';
import { X, Share2, Copy, Check, ExternalLink, Eye, RotateCw, ArrowRight } from 'lucide-react';
import { Product } from '../data/mockData';
import { getWhatsAppShareUrl, getTwitterShareUrl, updateProductSEO } from '../utils/seo';

interface ProductShareModalProps {
  product: Product | null;
  onClose: () => void;
}

// -------------------------------------------------------------
// 1. مكوّن الهولوجرام الرباعي المخصص لهرم البلاستيك الشفاف
// -------------------------------------------------------------
interface HologramScreenProps {
  productImage: string;
  productName: string;
  onCloseHologram: () => void;
}

const HologramScreen: React.FC<HologramScreenProps> = ({
  productImage,
  productName,
  onCloseHologram,
}) => {
  const [isRotating, setIsRotating] = useState(true);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden select-none">
      {/* شريط التحكم العلوي */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50 opacity-50 hover:opacity-100 transition-opacity">
        <button
          onClick={onCloseHologram}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs border border-slate-700"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع للمنتج</span>
        </button>

        <div className="text-cyan-400 font-bold text-xs tracking-wider">
          وضع الهولوجرام النشط · {productName}
        </div>

        <button
          onClick={() => setIsRotating(!isRotating)}
          className="flex items-center gap-2 bg-slate-900 text-cyan-400 px-4 py-2 rounded-xl text-xs border border-slate-700"
        >
          <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
          <span>{isRotating ? 'إيقاف' : 'دوران'}</span>
        </button>
      </div>

      {/* مسرح الانعكاس الرباعي للهرم */}
      <div className="relative w-[340px] h-[340px] md:w-[460px] md:h-[460px] flex items-center justify-center">
        {/* نقطة ارتكاز قمة الهرم الشفاف */}
        <div className="absolute w-12 h-12 border border-cyan-500/20 rounded-full flex items-center justify-center pointer-events-none">
          <div className="w-2 h-2 bg-cyan-400/40 rounded-full animate-ping" />
          <span className="absolute -bottom-6 text-[10px] text-cyan-400/50 whitespace-nowrap">
            ضع قمة الهرم هنا
          </span>
        </div>

        {/* الاتجاه 1: الأعلى (مقلوب للأسفل) */}
        <div className="absolute top-0 flex flex-col items-center transform rotate-180">
          <HologramFrame image={productImage} isRotating={isRotating} />
        </div>

        {/* الاتجاه 2: الأسفل (متجه للأعلى) */}
        <div className="absolute bottom-0 flex flex-col items-center">
          <HologramFrame image={productImage} isRotating={isRotating} />
        </div>

        {/* الاتجاه 3: اليسار (متجه لليمين) */}
        <div className="absolute left-0 flex flex-col items-center transform rotate-90">
          <HologramFrame image={productImage} isRotating={isRotating} />
        </div>

        {/* الاتجاه 4: اليمين (متجه لليسار) */}
        <div className="absolute right-0 flex flex-col items-center transform -rotate-90">
          <HologramFrame image={productImage} isRotating={isRotating} />
        </div>
      </div>

      <div className="absolute bottom-6 text-slate-500 text-xs text-center flex items-center gap-1.5 opacity-60">
        <Eye className="w-3.5 h-3.5 text-cyan-500" />
        <span>ضع الهرم الشفاف فوق النقطة وانظر من الجوانب بمستوى العين</span>
      </div>
    </div>
  );
};

// عنصر عرض الصورة المضيئة
const HologramFrame: React.FC<{ image: string; isRotating: boolean }> = ({ image, isRotating }) => (
  <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center p-2">
    <img
      src={image}
      alt="Hologram Element"
      className={`max-w-full max-h-full object-contain ${isRotating ? 'animate-pulse' : ''}`}
      style={{
        filter: 'drop-shadow(0 0 10px #06b6d4) contrast(1.15) brightness(1.2)',
      }}
    />
  </div>
);

// -------------------------------------------------------------
// 2. المكوّن الرئيسي: نافذة المنتج مع زر الهولوجرام المباشر
// -------------------------------------------------------------
export const ProductShareModal: React.FC<ProductShareModalProps> = ({ product, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showHologram, setShowHologram] = useState(false);

  if (!product) return null;

  updateProductSEO(product);

  const productUrl = window.location.href.split('#')[0] + `#product-${product.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* شاشة الهولوجرام ملء الشاشة إذا تم الضغط على الزر */}
      {showHologram && (
        <HologramScreen
          productImage={product.image}
          productName={product.title}
          onCloseHologram={() => setShowHologram(false)}
        />
      )}

      {/* نافذة المنتج والمشاركة العادية */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4" dir="rtl">
        <div className="bg-white dark:bg-[#0d232d] text-slate-800 dark:text-slate-100 rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 dark:border-slate-700 animate-in zoom-in-95">
          <button
            onClick={onClose}
            className="absolute left-5 top-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-9 h-9 rounded-xl bg-[#c59b5f]/20 text-[#c59b5f] flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-[#153e4d] dark:text-white">تفاصيل ومشاركة المنتج</h3>
                <p className="text-[11px] text-slate-500">العرض الذكي ومواقع التواصل</p>
              </div>
            </div>

            {/* بطاقة معاينة المنتج */}
            <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xs">
              <div className="relative aspect-16/9 bg-slate-200 overflow-hidden">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-[#153e4d] text-[#dfba83] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                  منصة مُنتجي 🇴🇲
                </div>
              </div>
              <div className="p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#1f5b70] dark:text-[#dfba83] font-bold">{product.category}</span>
                  <span className="text-xs font-black text-[#008450] font-mono">{product.price.toFixed(3)} ر.ع.</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{product.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">{product.description}</p>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span>المصدر: {product.governorate}</span>
                  <span>توصيل لكافة المحافظات</span>
                </div>
              </div>
            </div>

            {/* أزرار العمليات */}
            <div className="space-y-2 pt-1">
              {/* زر تشغيل شاشة الهولوجرام المباشر */}
              <button
                type="button"
                onClick={() => setShowHologram(true)}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
              >
                <Eye className="w-4 h-4" />
                <span>تشغيل شاشة الهولوجرام ثلاثي الأبعاد 🛸</span>
              </button>

              <a
                href={getWhatsAppShareUrl(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>مشاركة مباشرة عبر واتساب</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={getTwitterShareUrl(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-[#0f1419] hover:bg-[#272c30] text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>مشاركة عبر منصة X (تويتر)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم نسخ الرابط الذكي بنجاح!' : 'نسخ رابط المنتج المباشر'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};