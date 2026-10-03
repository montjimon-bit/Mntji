import { Product } from '../data/mockData';

/**
 * Updates browser title and OpenGraph / Twitter meta tags dynamically
 * for products and specific views.
 */
export function updateProductSEO(product: Product) {
  if (typeof document === 'undefined') return;

  const pageTitle = `${product.title} (${product.price.toFixed(3)} ر.ع.) - منصة مُنتجي`;
  const pageDescription = `اطلب ${product.title} مباشرة من ${product.seller.name} في ${product.governorate}. منتج عماني معتمد من منصة مُنتجي مع توصيل لكافة المحافظات والدفع الإلكتروني.`;
  const pageUrl = window.location.href.split('#')[0] + `#product-${product.id}`;

  document.title = pageTitle;

  const setMeta = (nameOrProp: string, content: string, isProperty = false) => {
    const attr = isProperty ? 'property' : 'name';
    let element = document.querySelector(`meta[${attr}="${nameOrProp}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attr, nameOrProp);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  setMeta('description', pageDescription);
  setMeta('og:title', pageTitle, true);
  setMeta('og:description', pageDescription, true);
  setMeta('og:image', product.image, true);
  setMeta('og:url', pageUrl, true);
  setMeta('og:type', 'product', true);
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', pageTitle);
  setMeta('twitter:description', pageDescription);
  setMeta('twitter:image', product.image);
}

/**
 * Generates WhatsApp share URL with rich formatted Arabic message
 */
export function getWhatsAppShareUrl(product: Product): string {
  const url = window.location.href.split('#')[0] + `#product-${product.id}`;
  const message = `✨ *${product.title}* 🇴🇲\n\n` +
    `🏷️ *السعر:* ${product.price.toFixed(3)} ريال عماني\n` +
    `📍 *المصدر:* ${product.governorate} (${product.seller.name})\n` +
    `📦 *التوصيل:* متاح لكافة محافظات سلطنة عُمان الـ 11.\n\n` +
    `🔗 *رابط الطلب المباشر عبر منصة مُنتجي:*\n${url}`;

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

/**
 * Generates Twitter / X share URL
 */
export function getTwitterShareUrl(product: Product): string {
  const url = window.location.href.split('#')[0] + `#product-${product.id}`;
  const text = `تسوّق "${product.title}" من خيرات سلطنة عُمان عبر منصة مُنتجي الوطنية 🇴🇲✨`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=صنع_في_عمان,منصة_منتجي,رواد_الاعمال`;
}
