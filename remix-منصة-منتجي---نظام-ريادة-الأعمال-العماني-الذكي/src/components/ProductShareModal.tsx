import React, { useState } from 'react';
import { X, Share2, Copy, Check, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { Product } from '../data/mockData';
import { getWhatsAppShareUrl, getTwitterShareUrl, updateProductSEO } from '../utils/seo';

interface ProductShareModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductShareModal: React.FC<ProductShareModalProps> = ({ product, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  // Sync SEO meta tags
  updateProductSEO(product);

  const productUrl = window.location.href.split('#')[0] + `#product-${product.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
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
              <h3 className="font-black text-sm text-[#153e4d] dark:text-white">مشاركة المنتج العماني</h3>
              <p className="text-[11px] text-slate-500">معاينة بطاقة المشاركة لمواقع التواصل</p>
            </div>
          </div>

          {/* Social Card Preview */}
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

          {/* Share Actions */}
          <div className="space-y-2 pt-1">
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
  );
};
