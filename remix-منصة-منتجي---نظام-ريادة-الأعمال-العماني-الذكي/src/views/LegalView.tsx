import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, ChevronLeft, ArrowRight } from 'lucide-react';

interface LegalViewProps {
  initialTab?: 'terms' | 'privacy';
  onNavigate: (view: string) => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ initialTab = 'terms', onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(initialTab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-2 cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          السياسات القانونية واللوائح التنظيمية
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          منصة "مُنتجي" تعمل وفق القوانين والتشريعات الصادرة في سلطنة عُمان
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-sm font-bold">
        <button
          onClick={() => setActiveTab('terms')}
          className={`pb-3 px-4 border-b-2 transition-all cursor-pointer ${
            activeTab === 'terms'
              ? 'border-[#008450] text-[#008450] font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          الشروط والأحكام العامة (Terms & Conditions)
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`pb-3 px-4 border-b-2 transition-all cursor-pointer ${
            activeTab === 'privacy'
              ? 'border-[#008450] text-[#008450] font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          سياسة الخصوصية وحماية البيانات (Privacy Policy)
        </button>
      </div>

      {/* Content Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs leading-relaxed text-sm text-slate-700 space-y-6 text-right">
        {activeTab === 'terms' ? (
          <>
            <div className="flex items-center gap-2 text-[#008450] font-bold text-xs bg-emerald-50 p-3 rounded-xl border border-emerald-100">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                آخر تحديث: سبتمبر 2026 - متوافق مع لائحة حماية المستهلك وقانون التجارة الإلكترونية العماني.
              </span>
            </div>

            <section className="space-y-2">
              <h2 className="text-base font-black text-slate-900">1. القبول والتعريفات</h2>
              <p className="text-slate-600">
                تسري هذه الشروط والأحكام على كافة مستخدمي منصة "مُنتجي" من رواد أعمال، ومستهلكين، ومستثمرين في سلطنة عُمان. يعتبر استخدامك أو تسجيلك في المنصة موافقة صريحة وكاملة على الالتزام بجميع البنود المذكورة.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-slate-900">2. أهلية رواد الأعمال والمتاجر</h2>
              <p className="text-slate-600">
                يشترط لرواد الأعمال الراغبين في إدراج منتجاتهم أو خدماتهم في سوق المنصة أن يكونوا مسجلين وفق الأنظمة التجارية العمانية لدى وزارة التجارة والصناعة وترويج الاستثمار أو حاصلين على بطاقة ريادة للمؤسسات الصغيرة والمتوسطة.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-slate-900">3. خدمات الاستشارات ودراسات الجدوى</h2>
              <p className="text-slate-600">
                المستشار "عوني" ونماذج دراسات الجدوى الاقتصادية تقدم تحليلات استرشادية استراتيجية لدعم اتخاذ القرار وتوجيه رواد الأعمال. لا تُعد المخرجات مستنداً قانونياً أو تمويلياً نهائياً ملزماً لأي جهة حكومية أو مصرفية، ويُنصح دائماً بالرجوع إلى الجهات المعنية للتثبت من اللوائح المتجددة.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-slate-900">4. الأسعار والمدفوعات بالريال العماني (OMR)</h2>
              <p className="text-slate-600">
                تُعرض جميع أسعار المنتجات والخدمات في المنصة بالريال العماني (ر.ع.)، شاملة أو مضافاً إليها ضريبة القيمة المضافة المعمول بها في السلطنة (VAT 5%) حسب نوع النشاط. وتتم عمليات الدفع الإلكتروني عبر بوابات مصرفية معتمدة ومرخصة من البنك المركزي العماني (بنك مسقط، ثواني، عُمان نت).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-slate-900">5. الشحن والاسترجاع</h2>
              <p className="text-slate-600">
                يلتزم البائعون بشحن المنتجات وفق المدد المحددة إلى كافة محافظات السلطنة. ويحق للمستهلك استبدال أو استرجاع المنتج غير المطابق للمواصفات أو المعيب وفقاً لأحكام قانون حماية المستهلك العماني ولائحته التنفيذية.
              </p>
            </section>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs bg-indigo-50 p-3 rounded-xl border border-indigo-100">
              <Lock className="w-4 h-4 shrink-0" />
              <span>
                التزام صارم بحماية البيانات الشخصية وفق قانون حماية البيانات الشخصية الصادر بالمرسوم السلطاني رقم 6/2022.
              </span>
            </div>

            <section className="space-y-2">
              <h2 className="text-base font-black text-slate-900">1. البيانات التي نجمعها</h2>
              <p className="text-slate-600">
                نقوم بجمع البيانات الضرورية فقط لتقديم وتسهيل الخدمات، وتشمل: الاسم، ورقم الهاتف النقال، والبريد الإلكتروني، وعنوان الشحن والتوصيل، والرقم المدني أو السجل التجاري لرواد الأعمال، وتفاصيل الطلبات والدورات التدريبية.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-slate-900">2. أمان المعاملات المالية</h2>
              <p className="text-slate-600">
                لا تحتفظ المنصة ببيانات البطاقات الائتمانية أو الحسابات المصرفية السرية. تتم كافة العمليات المالية من خلال مشفري بوابات الدفع الرسمية المعتمدة وفق معايير PCI-DSS وأعلى بروتوكولات الأمان الإلكتروني.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-slate-900">3. سرية دراسات الجدوى وأفكار المشاريع</h2>
              <p className="text-slate-600">
                تعتبر جميع المدخلات والأفكار التجارية واستفسارات دراسات الجدوى التي يدخلها المستخدمون في المنصة سرية تماماً، ولا يتم مشاركتها مع أطراف ثالثة أو استغلالها خارج إطار تقديم الخدمة الاستشارية للمستخدم نفسه.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-black text-slate-900">4. حقوق المستخدمين</h2>
              <p className="text-slate-600">
                يحق لأي مستخدم في أي وقت طلب مراجعة بياناته المسجلة، أو تعديلها، أو حذف حسابه من قاعدة بيانات المنصة من خلال التواصل مع فريق الدعم الفني على <span className="font-mono text-emerald-700">support@montaji.om</span>.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
