import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  Building,
  CheckCircle2,
  FileText,
  DollarSign,
  TrendingUp,
  Award,
  Layers,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface FeasibilityDataInput {
  projectTitle?: string;
  applicantName?: string;
  governorate?: string;
  sector?: string;
  phone?: string;
  crNumber?: string;
  riyadaNumber?: string;
  requestedAmount?: number;
  equityContribution?: number;
  monthlyOpex?: number;
  capexTotal?: number;
  expectedAnnualRevenue?: number;
  breakevenUnits?: number;
  unitPrice?: number;
  unitCost?: number;
  summaryNotes?: string;
}

interface OdbLoanPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: FeasibilityDataInput;
}

export const OdbLoanPdfModal: React.FC<OdbLoanPdfModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { user, userProfile } = useAuth();

  const [projectTitle, setProjectTitle] = useState(
    initialData?.projectTitle || 'مشروع تصنيع وتعبئة منتجات اللبان الظفاري الملكي'
  );
  const [applicantName, setApplicantName] = useState(
    initialData?.applicantName || userProfile?.displayName || user?.displayName || 'حذيفة بن موسى المعمري'
  );
  const [phone, setPhone] = useState(
    initialData?.phone || userProfile?.phone || '94842840'
  );
  const [governorate, setGovernorate] = useState(
    initialData?.governorate || userProfile?.governorate || 'محافظة ظفار'
  );
  const [sector, setSector] = useState(
    initialData?.sector || 'الصناعات الحرفية والتحويلية (أولوية وطنية)'
  );
  const [crNumber, setCrNumber] = useState(
    initialData?.crNumber || '1428590'
  );
  const [riyadaNumber, setRiyadaNumber] = useState(
    initialData?.riyadaNumber || 'OM-RIYADA-88421'
  );
  const [targetEntity, setTargetEntity] = useState<'odb' | 'riyada' | 'both'>('odb');
  const [requestedAmount, setRequestedAmount] = useState<number>(
    initialData?.requestedAmount || 25000
  );
  const [equityPercent, setEquityPercent] = useState<number>(
    initialData?.equityContribution ? Math.round((initialData.equityContribution / (initialData.requestedAmount || 25000)) * 100) : 15
  );

  // Capex items
  const [equipmentCost, setEquipmentCost] = useState<number>(11500);
  const [premisesCost, setPremisesCost] = useState<number>(4500);
  const [rawMaterialsCost, setRawMaterialsCost] = useState<number>(5500);
  const [licensingCost, setLicensingCost] = useState<number>(1500);
  const [workingCapital, setWorkingCapital] = useState<number>(2000);

  const totalBudget = equipmentCost + premisesCost + rawMaterialsCost + licensingCost + workingCapital;
  const equityAmount = Math.round((totalBudget * equityPercent) / 100);
  const loanAmount = totalBudget - equityAmount;

  if (!isOpen) return null;

  const handlePrintPdf = () => {
    const todayDate = new Date().toLocaleDateString('ar-OM', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const refCode = `ODB-OM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const printableHtml = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>استمارة دراسة الجدوى وطلب التمويل - بنك التنمية وهيئة ريادة</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: 'Cairo', 'Tajawal', sans-serif;
            padding: 30px 40px;
            color: #0f172a;
            background: #ffffff;
            direction: rtl;
            line-height: 1.5;
            font-size: 13px;
          }
          .no-print-bar {
            background: #153e4d;
            color: #ffffff;
            padding: 12px 20px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 25px;
          }
          .print-btn {
            background: #c59b5f;
            color: #0d232d;
            border: none;
            padding: 9px 24px;
            border-radius: 8px;
            font-weight: 800;
            font-size: 13px;
            cursor: pointer;
            font-family: inherit;
          }
          .header-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px double #153e4d;
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          .logo-text {
            font-size: 20px;
            font-weight: 900;
            color: #153e4d;
            margin: 0 0 4px 0;
          }
          .sub-logo {
            font-size: 12px;
            color: #64748b;
            font-weight: 600;
          }
          .ref-badge {
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            padding: 6px 14px;
            border-radius: 8px;
            text-align: left;
            font-size: 11px;
            font-weight: 700;
          }
          .section-heading {
            background: #f8fafc;
            border-right: 4px solid #c59b5f;
            padding: 6px 12px;
            margin: 18px 0 10px 0;
            font-size: 14px;
            font-weight: 800;
            color: #153e4d;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 14px;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #cbd5e1;
            padding: 7px 10px;
            text-align: right;
          }
          th {
            background: #f1f5f9;
            color: #1e293b;
            font-weight: 700;
            width: 28%;
          }
          .highlight-cell {
            background: #fefce8;
            font-weight: 800;
            color: #854d0e;
          }
          .footer-stamps {
            margin-top: 35px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            page-break-inside: avoid;
          }
          .stamp-box {
            border: 2px dashed #008450;
            color: #008450;
            padding: 12px 20px;
            border-radius: 12px;
            text-align: center;
            font-weight: 800;
            font-size: 12px;
          }
          .signature-box {
            text-align: right;
            font-size: 12px;
          }
          .signature-line {
            display: inline-block;
            width: 180px;
            border-bottom: 1px solid #334155;
            margin-right: 8px;
          }
          @media print {
            .no-print-bar { display: none !important; }
            body { padding: 15px 25px; }
          }
        </style>
      </head>
      <body>
        <div class="no-print-bar">
          <div>
            <strong>جاهز للطباعة والتنزيل بصيغة PDF:</strong> ملف التمويل الرسمي لبنك التنمية وهيئة ريادة
          </div>
          <button class="print-btn" onclick="window.print()">
            🖨️ طباعة / حفظ كملف PDF
          </button>
        </div>

        <div class="header-box">
          <div>
            <h1 class="logo-text">سلطنة عُمان - منظومة ريادة الأعمال الوطنية</h1>
            <div class="sub-logo">نموذج دراسة الجدوى وطلب التمويل التنموي المعتمد · رؤية عُمان 2040</div>
          </div>
          <div class="ref-badge">
            <div>الجهة: <strong>${targetEntity === 'odb' ? 'بنك التنمية العماني' : targetEntity === 'riyada' ? 'هيئة ريادة' : 'بنك التنمية + هيئة ريادة'}</strong></div>
            <div>الرقم المرجعي: <span style="font-family: monospace;">${refCode}</span></div>
            <div>التاريخ: ${todayDate}</div>
          </div>
        </div>

        <div class="section-heading">1. البيانات العامة لصاحب المشروع والمؤسسة</div>
        <table>
          <tr>
            <th>اسم رائد الأعمال / مقدم الطلب</th>
            <td><strong>${applicantName}</strong></td>
            <th>رقم الهاتف المسجل</th>
            <td dir="ltr" style="text-align: right;">+968 ${phone}</td>
          </tr>
          <tr>
            <th>اسم المشروع المقترح</th>
            <td colspan="3"><strong>${projectTitle}</strong></td>
          </tr>
          <tr>
            <th>القطاع والنشاط الاقتصادي</th>
            <td>${sector}</td>
            <th>المحافظة المقر</th>
            <td>${governorate}</td>
          </tr>
          <tr>
            <th>رقم السجل التجاري (CR)</th>
            <td>${crNumber || 'قيد الإصدار التلقائي'}</td>
            <th>رقم بطاقة ريادة</th>
            <td>${riyadaNumber} (رائد أعمال متفرغ)</td>
          </tr>
        </table>

        <div class="section-heading">2. التكاليف الرأسمالية والتشغيلية الموزعة (CAPEX & OPEX)</div>
        <table>
          <thead>
            <tr style="background: #e2e8f0;">
              <th style="width: 35%;">البند الاستثماري</th>
              <th style="width: 40%;">التفاصيل والمواصفات</th>
              <th style="width: 25%;">التكلفة المقدرة (ر.ع.)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>خطوط الإنتاج والآلات والمعدات</strong></td>
              <td>أجهزة التقطير والتعبئة والتغليف الآلي للمنتجات</td>
              <td>${equipmentCost.toLocaleString('ar-OM')} ر.ع.</td>
            </tr>
            <tr>
              <td><strong>تجهيز المقر والديكور والاشتراطات</strong></td>
              <td>تهيئة مساحة الورشة وتركيب أنظمة السلامة والتهوية</td>
              <td>${premisesCost.toLocaleString('ar-OM')} ر.ع.</td>
            </tr>
            <tr>
              <td><strong>المواد الخام والمحاصيل الأولية</strong></td>
              <td>شراء محاصيل اللبان والأعشاب من الموردين المحليين بظفار</td>
              <td>${rawMaterialsCost.toLocaleString('ar-OM')} ر.ع.</td>
            </tr>
            <tr>
              <td><strong>التراخيص والهوية والتسويق</strong></td>
              <td>السجل، الفحص المخبري، وتصاميم الهوية الوطنية للعبوات</td>
              <td>${licensingCost.toLocaleString('ar-OM')} ر.ع.</td>
            </tr>
            <tr>
              <td><strong>رأس المال العامل التشغيلي</strong></td>
              <td>تغطية نفقات التشغيل والنقل للأشهر الثلاثة الأولى</td>
              <td>${workingCapital.toLocaleString('ar-OM')} ر.ع.</td>
            </tr>
            <tr class="highlight-cell">
              <td colspan="2"><strong>إجمالي الموازنة الاستثمارية للمشروع</strong></td>
              <td><strong>${totalBudget.toLocaleString('ar-OM')} ريال عماني</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="section-heading">3. هيكل التمويل المطلوب والشروط التنموية</div>
        <table>
          <tr>
            <th>مبلغ القرض المطلوب من بنك التنمية</th>
            <td><strong style="color: #153e4d; font-size: 14px;">${loanAmount.toLocaleString('ar-OM')} ريال عماني</strong></td>
            <th>نسبة التمويل التنموي</th>
            <td><strong>${100 - equityPercent}%</strong> (قرض ميسر)</td>
          </tr>
          <tr>
            <th>المساهمة الذاتية لصاحب المشروع</th>
            <td>${equityAmount.toLocaleString('ar-OM')} ريال عماني</td>
            <th>نسبة المساهمة الذاتية</th>
            <td>${equityPercent}%</td>
          </tr>
          <tr>
            <th>فترة السماح المقترحة</th>
            <td>6 أشهر من تاريخ بدء الإنتاج</td>
            <th>فترة سداد القرض</th>
            <td>60 شهراً (أقساط ميسرة مدعومة)</td>
          </tr>
        </table>

        <div class="section-heading">4. مؤشرات الجدوى ونقطة التعادل (Break-Even & Feasibility)</div>
        <table>
          <tr>
            <th>متوسط سعر بيع الوحدة</th>
            <td>18.500 ر.ع.</td>
            <th>التكلفة المباشرة المتغيرة</th>
            <td>7.200 ر.ع.</td>
          </tr>
          <tr>
            <th>هامش المساهمة للوحدة</th>
            <td>11.300 ر.ع. (61%)</td>
            <th>حجم التعادل الشهري</th>
            <td>110 وحدة شهرياً</td>
          </tr>
          <tr>
            <th>المبيعات السنوية المتوقعة (السنة الأولى)</th>
            <td>${(totalBudget * 1.8).toLocaleString('ar-OM')} ر.ع.</td>
            <th>صافي الربح السنوي المتوقع</th>
            <td>${(totalBudget * 0.42).toLocaleString('ar-OM')} ر.ع. (38%)</td>
          </tr>
          <tr>
            <th>فترة استرداد رأس المال (Payback)</th>
            <td>15 شهراً</td>
            <th>العائد المتوقع على الاستثمار (ROI)</th>
            <td>32.4% سنوياً</td>
          </tr>
        </table>

        <div class="section-heading">5. الإقرار والاعتماد والتعهد الرسمي</div>
        <p style="font-size: 11px; color: #475569; margin: 4px 0 16px 0;">
          أقر أنا مقدم الطلب الموقع أدناه بصحة واكتمال كافة البيانات الواردة في دراسة الجدوى هذه، وأتعهد باستخدام مبلغ التمويل في الأغراض المحددة للمشروع وفق اشتراطات بنك التنمية العماني وضوابط هيئة تنمية المؤسسات الصغيرة والمتوسطة (ريادة)، وتخصيص نسبة التعمين المقررة.
        </p>

        <div class="footer-stamps">
          <div class="signature-box">
            <div>اسم مقدم الطلب: <strong>${applicantName}</strong></div>
            <div style="margin-top: 6px;">التوقيع: <span class="signature-line"></span></div>
            <div style="margin-top: 6px;">التاريخ: ${todayDate}</div>
          </div>

          <div class="stamp-box">
            <div>معتمد رقمياً عبر منصة مُنتجي 🇴🇲</div>
            <div style="font-size: 10px; margin-top: 3px; font-family: monospace;">MONTAJI VERIFIED DOSSIER</div>
            <div style="font-size: 10px; color: #0f172a; margin-top: 2px;">رمز التحقق: ${refCode}</div>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
      iframe.contentDocument?.open();
      iframe.contentDocument?.write(printableHtml);
      iframe.contentDocument?.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          try {
            document.body.removeChild(iframe);
          } catch {}
        }, 3000);
      }, 500);
    } catch {
      window.print();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-white dark:bg-[#0d232d] text-slate-800 dark:text-slate-100 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 my-8">
        <button
          onClick={onClose}
          className="absolute left-6 top-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#153e4d] to-[#1f5b70] text-[#dfba83] flex items-center justify-center shadow-md">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#153e4d] dark:text-white">
                  محرك استمارة تمويل بنك التنمية وهيئة ريادة (PDF)
                </h3>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full">
                  معتمد 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                توليد وثيقة دراسة الجدوى الاقتصادية وجداول CAPEX/OPEX المعتمدة للتقديم المباشر
              </p>
            </div>
          </div>

          {/* Form Configuration Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اسم المشروع المقترح:</label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-[#1f5b70]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اسم رائد الأعمال:</label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">رقم الهاتف العُماني:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9XXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">المحافظة المقر:</label>
              <select
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs font-semibold"
              >
                <option value="محافظة ظفار">محافظة ظفار</option>
                <option value="محافظة مسقط">محافظة مسقط</option>
                <option value="محافظة الداخلية">محافظة الداخلية</option>
                <option value="محافظة شمال الباطنة">محافظة شمال الباطنة</option>
                <option value="محافظة جنوب الباطنة">محافظة جنوب الباطنة</option>
                <option value="محافظة مسندم">محافظة مسندم</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الجهة التمويلية المستهدفة:</label>
              <select
                value={targetEntity}
                onChange={(e) => setTargetEntity(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs font-semibold"
              >
                <option value="odb">بنك التنمية العماني (قرض ميسر بدون فوائد)</option>
                <option value="riyada">هيئة تنمية المؤسسات الصغيرة والمتوسطة (ريادة)</option>
                <option value="both">بنك التنمية + هيئة ريادة (ملف موحد)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">تكلفة الآلات والمعدات (ر.ع.):</label>
              <input
                type="number"
                value={equipmentCost}
                onChange={(e) => setEquipmentCost(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">نسبة مساهمتك الذاتية (%):</label>
              <select
                value={equityPercent}
                onChange={(e) => setEquityPercent(Number(e.target.value) || 10)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs font-semibold"
              >
                <option value={10}>10% (الحد الأدنى لرواد الأعمال)</option>
                <option value={15}>15% (الموصى به)</option>
                <option value={20}>20% (مساهمة متوازنة)</option>
              </select>
            </div>
          </div>

          {/* Quick Summary Pill */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">إجمالي مبلغ التمويل المطلوب:</span>
              <strong className="text-base font-black text-[#153e4d] dark:text-[#dfba83]">
                {loanAmount.toLocaleString('ar-OM')} ر.ع.
              </strong>
            </div>
            <div className="text-left">
              <span className="text-slate-500 dark:text-slate-400 block">الموازنة الكلية للمشروع:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {totalBudget.toLocaleString('ar-OM')} ر.ع.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrintPdf}
              className="w-full sm:flex-1 py-3.5 bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] font-black rounded-2xl text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>تحميل استمارة بنك التنمية PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs transition cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
