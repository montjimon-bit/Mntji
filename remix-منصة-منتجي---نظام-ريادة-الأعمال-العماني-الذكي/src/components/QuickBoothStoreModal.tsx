import React, { useState } from 'react';
import { generateHologramConcept } from '../services/ai-service';
import { processAndCompressImage } from '../utils/imageUpload';
import { useCart } from '../context/CartContext';

export const QuickBoothStoreModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { addNewProduct } = useCart();
  const [visitorName, setVisitorName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateStoreNow = async () => {
    if (!visitorName.trim() || !imageFile) return;

    setLoading(true);
    try {
      // 1. ضغط الصورة فوراً لتكون سريعة وخفيفة
      const compressed = await processAndCompressImage(imageFile, 800, 0.8);

      // 2. الذكاء الاصطناعي يحلل المجسم ويقترح تفاصيل المنتج
      const aiResult = await generateHologramConcept(compressed.dataUrl, visitorName);

      const productDetails = aiResult.success
        ? aiResult.data
        : {
            productName: `ابتكار ${visitorName}`,
            slogan: 'منتج ابتكاري واعد من زوار المنصة',
            suggestedPrice: '10.000 ر.ع.',
          };

      // تنظيف السعر إلى رقم
      const cleanPrice =
        parseFloat(productDetails.suggestedPrice.replace(/[^\d.]/g, '')) || 10;

      // 3. إضافة المنتج فوراً في المنصة باسم الزائر ومتجره
      await addNewProduct({
        title: productDetails.productName,
        description: `${productDetails.slogan} - ابتكار تم تصميمه بواسطة ${visitorName} في منصة مُنتجي.`,
        price: cleanPrice,
        category: 'تقنية وابتكار',
        governorate: 'محافظة مسقط',
        seller: {
          name: `متجر ${visitorName}`,
          isRiyadaCertified: true,
          rating: 5.0,
        },
        image: compressed.dataUrl,
        stock: 1,
        featured: true,
      });

      // 4. إغلاق النافذة
      onClose();
      alert(`مبروك يا ${visitorName}! تم فتح متجرك ونشر منتجك في السوق بنجاح 🎉`);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء رفع المنتج، جرب مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 text-right" dir="rtl">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-black text-[#1b4d5e]">افتح متجرك واعرض منتجك الآن 🇴🇲</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>

        <div>
          <label className="text-xs font-bold block mb-1">اسمك الكريم:</label>
          <input
            type="text"
            value={visitorName}
            onChange={(e) => setVisitorName(e.target.value)}
            placeholder="مثال: أحمد المعمري"
            className="w-full border rounded-xl p-2.5 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-bold block mb-1">صورة المجسم من البوث:</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full text-xs"
          />
        </div>

        <button
          onClick={handleCreateStoreNow}
          disabled={loading || !visitorName || !imageFile}
          className="w-full py-3 bg-[#d4ab71] text-slate-950 font-black rounded-xl text-xs disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'الذكاء الاصطناعي يصنع متجرك...' : 'إنشاء المتجر وعرض المنتج في السوق فوراً ✨'}
        </button>
      </div>
    </div>
  );
};