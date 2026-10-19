/**
 * Omani Platform Data Validation & Rate Utilities
 */

export interface GovernorateShippingRate {
  id: string;
  name: string;
  rate: number;
  deliveryDays: string;
  coverage: string;
}

export const OMAN_SHIPPING_RATES: GovernorateShippingRate[] = [
  { id: 'muscat', name: 'محافظة مسقط', rate: 1.5, deliveryDays: '24 ساعة', coverage: 'توصيل مباشر لباب المنزل' },
  { id: 'dhofar', name: 'محافظة ظفار', rate: 2.5, deliveryDays: '48 ساعة', coverage: 'توصيل مباشر (صلالة وكافة الولايات)' },
  { id: 'dakhiliya', name: 'محافظة الداخلية', rate: 1.8, deliveryDays: '24-48 ساعة', coverage: 'نزوى، بهلاء، سمائل، وإزكي' },
  { id: 'batinah_n', name: 'محافظة شمال الباطنة', rate: 1.8, deliveryDays: '24 ساعة', coverage: 'صحار، السويق، وصحم' },
  { id: 'batinah_s', name: 'محافظة جنوب الباطنة', rate: 1.5, deliveryDays: '24 ساعة', coverage: 'بركاء، الرستاق، والمصنعة' },
  { id: 'sharqiyah_n', name: 'محافظة شمال الشرقية', rate: 2.0, deliveryDays: '48 ساعة', coverage: 'إبراء والمضيبي وبدية' },
  { id: 'sharqiyah_s', name: 'محافظة جنوب الشرقية', rate: 2.0, deliveryDays: '48 ساعة', coverage: 'صور وجعلان بني بو علي' },
  { id: 'dhahirah', name: 'محافظة الظاهرة', rate: 2.2, deliveryDays: '48 ساعة', coverage: 'عبري، ينقل، وضنك' },
  { id: 'buraimi', name: 'محافظة البريمي', rate: 2.2, deliveryDays: '48 ساعة', coverage: 'ولاية البريمي ومحضة' },
  { id: 'musandam', name: 'محافظة مسندم', rate: 3.5, deliveryDays: '72 ساعة', coverage: 'خصب، دبا، ومدحاء' },
  { id: 'wusta', name: 'محافظة الوسطى', rate: 3.0, deliveryDays: '48-72 ساعة', coverage: 'هيما والدقم والجازر' },
];

/**
 * Validates Omani mobile phone numbers:
 * Must start with 9 or 7, followed by 7 digits (Total: 8 digits).
 * Handles inputs with +968, 00968, or 968 prefixes.
 */
export function validateOmaniPhone(rawPhone: string): { isValid: boolean; formatted: string; error?: string } {
  if (!rawPhone) {
    return { isValid: false, formatted: '', error: 'رقم الهاتف مطلوب.' };
  }

  // Strip non-digit characters
  let clean = rawPhone.replace(/\D/g, '');

  // Strip international prefix if present
  if (clean.startsWith('968') && clean.length === 11) {
    clean = clean.substring(3);
  } else if (clean.startsWith('00968') && clean.length === 13) {
    clean = clean.substring(5);
  }

  // Check 8-digit requirement starting with 9 or 7
  const omaniPhoneRegex = /^[97]\d{7}$/;
  if (!omaniPhoneRegex.test(clean)) {
    return {
      isValid: false,
      formatted: clean,
      error: 'يجب أن يبدأ رقم الهاتف العُماني بـ 9 أو 7 ويتكون من 8 أرقام (مثال: 94842840).',
    };
  }

  return {
    isValid: true,
    formatted: clean,
  };
}

/**
 * Validates Commercial Registration (CR) number:
 * Must be 6 to 10 digits.
 */
export function validateCommercialRegister(crNumber: string): { isValid: boolean; error?: string } {
  if (!crNumber) return { isValid: true }; // optional
  const clean = crNumber.trim().replace(/\D/g, '');
  if (clean.length < 6 || clean.length > 10) {
    return {
      isValid: false,
      error: 'رقم السجل التجاري (CR) العماني يجب أن يتكون من 6 إلى 10 أرقام.',
    };
  }
  return { isValid: true };
}

/**
 * Validates Riyada Card ID
 */
export function validateRiyadaCard(cardId: string): { isValid: boolean; error?: string } {
  if (!cardId) return { isValid: true };
  const clean = cardId.trim();
  const pattern = /^(OM-)?(RIYADA-)?\d{4,8}$/i;
  if (!pattern.test(clean) && !/^\d{5,8}$/.test(clean)) {
    return {
      isValid: false,
      error: 'صيغة بطاقة ريادة غير صالحة. الصيغة المعتمدة: OM-RIYADA-XXXXXX أو رقم البطاقة المباشر.',
    };
  }
  return { isValid: true };
}
