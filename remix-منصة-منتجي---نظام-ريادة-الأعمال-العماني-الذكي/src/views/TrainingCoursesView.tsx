import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  X,
  Award,
  Star,
  ShieldCheck,
  GraduationCap,
  Search,
} from 'lucide-react';
import { TRAINING_COURSES_DATA, TrainingCourse } from '../data/mockData';

export const TrainingCoursesView: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedLevel, setSelectedLevel] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState(() => {
    return sessionStorage.getItem('montaji_course_search') || '';
  });
  const [regSuccess, setRegSuccess] = useState(false);

  // Sync with Navbar search
  useEffect(() => {
    const initialQuery = sessionStorage.getItem('montaji_course_search');
    if (initialQuery) {
      setSearchQuery(initialQuery);
      sessionStorage.removeItem('montaji_course_search');
    }

    const handleCourseSearch = (e: any) => {
      if (e.detail?.query !== undefined) {
        setSearchQuery(e.detail.query);
      }
      if (e.detail?.courseId) {
        const found = TRAINING_COURSES_DATA.find((c) => c.id === e.detail.courseId);
        if (found) {
          setSelectedCourse(found);
        }
      }
    };

    window.addEventListener('montaji-course-search', handleCourseSearch);
    return () => window.removeEventListener('montaji-course-search', handleCourseSearch);
  }, []);

  // Form states
  const [fullName, setFullName] = useState('');
  const [civilId, setCivilId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [hasRiyadaCard, setHasRiyadaCard] = useState(false);

  const categories = [
    'الكل',
    'التشريعات والتراخيص الحكومية',
    'الإدارة والمالية',
    'التسويق والتجارة الإلكترونية',
    'التقنية والابتكار',
  ];

  const filteredCourses = TRAINING_COURSES_DATA.filter((course) => {
    const matchCat = selectedCategory === 'الكل' || course.category === selectedCategory;
    const matchLevel = selectedLevel === 'الكل' || course.level === selectedLevel;
    const matchSearch =
      !searchQuery.trim() ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      course.syllabus.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase().trim()));
    return matchCat && matchLevel && matchSearch;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setSelectedCourse(null);
      setFullName('');
      setCivilId('');
      setPhone('');
      setEmail('');
    }, 2800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-emerald-900/60">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>أكاديمية مُنتجي لريادة الأعمال والتدريب المهني</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            برامج تدريبية متخصصة لتطوير مهارات الرواد
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            ورش عمل ودورات تفاعلية معتمدة يقدمها نخبة من الخبراء والاستشاريين العمانيين في مجالات الإدارة المالية، وتراخيص الأعمال، والتسويق الرقمي الحديث.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 ml-2">المجال:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#008450] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">المستوى:</span>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 cursor-pointer"
          >
            <option value="الكل">جميع المستويات</option>
            <option value="مبتدئ">مبتدئ</option>
            <option value="متوسط">متوسط</option>
            <option value="متقدم">متقدم</option>
          </select>
        </div>
      </div>

      {/* Active Search Indicator if searching */}
      {searchQuery && (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl text-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-bold">
            <Search className="w-4 h-4 text-emerald-700" />
            <span>تصفية الدورات التدريبية حسب: "{searchQuery}"</span>
            <span className="text-[11px] bg-emerald-200/60 px-2 py-0.5 rounded-full">
              {filteredCourses.length} دورة
            </span>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
          >
            إلغاء التصفية
          </button>
        </div>
      )}

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">لا توجد دورات تدريبية مطابقة لبحثك</h3>
          <p className="text-xs text-slate-500">جرب البحث بمصطلحات أخرى أو إزالة التصفية.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 bg-[#153e4d] text-[#e9cca0] text-xs font-bold rounded-xl hover:bg-[#122e3a] transition-colors cursor-pointer"
          >
            عرض كافة الدورات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="aspect-16/9 relative overflow-hidden bg-slate-100">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded">
                  {course.category}
                </span>
                <span className="absolute bottom-3 left-3 bg-emerald-600/90 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs">
                  مستوى: {course.level}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-[#008450] transition-colors">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-600">
                  <span className="font-bold">المحاضر:</span> {course.instructor}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                    المقاعد المتبقية: {course.seatsAvailable}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 block">
                    أبرز المحاور التدريبية:
                  </span>
                  <ul className="text-xs text-slate-600 space-y-1 pr-2">
                    {course.syllabus.slice(0, 2).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {typeof course.price === 'number'
                    ? `${course.price.toFixed(3)} ر.ع.`
                    : course.price}
                </span>
              </div>

              <button
                onClick={() => setSelectedCourse(course)}
                className="px-4 py-2 bg-[#008450] hover:bg-[#00683f] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                التسجيل بالدورة
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Registration Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 animate-in zoom-in-95 my-8">
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute left-6 top-6 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {regSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#008450] flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  تم تسجيلك بنجاح في الدورة!
                </h3>
                <p className="text-sm text-slate-600 max-w-xs mx-auto">
                  تم إرسال تفاصيل الحضور ورابط القاعة الافتراضية إلى رقم هاتفك وبريدك الإلكتروني.
                </p>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold">
                  سيتم منحك شهادة معتمدة بعد إتمام متطلبات الدورة بنجاح.
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-right">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-xs bg-emerald-50 text-[#008450] font-bold px-2 py-0.5 rounded">
                    {selectedCourse.category}
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-2">
                    {selectedCourse.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    المحاضر: {selectedCourse.instructor} • المدة: {selectedCourse.duration}
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      الاسم الثلاثي والقبيلة:
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="سالم بن خميس البلوشي"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        الرقم المدني (Civil ID):
                      </label>
                      <input
                        type="text"
                        value={civilId}
                        onChange={(e) => setCivilId(e.target.value)}
                        placeholder="12345678"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        رقم الهاتف النقال:
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+968 9XXXXXXX"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      البريد الإلكتروني:
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.om"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-left font-mono"
                      dir="ltr"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={hasRiyadaCard}
                      onChange={(e) => setHasRiyadaCard(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span>أحمل بطاقة ريادة للمؤسسات الصغيرة والمتوسطة (إعفاء من الرسوم إن وجدت)</span>
                  </label>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#008450] hover:bg-[#00683f] text-white font-bold rounded-xl text-sm shadow-md transition-colors cursor-pointer"
                    >
                      تأكيد التسجيل وحجز المقعد
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
