import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  CheckCircle2,
  Briefcase,
  Users,
  Award,
  Sparkles,
  TrendingUp,
  ThumbsUp,
  Filter,
  ShieldCheck,
  Building2,
  Calendar,
} from 'lucide-react';
import {
  ProjectRating,
  ProjectRatingStats,
  EvaluatorRole,
} from '../data/mockProjectRatings';
import { ProjectRatingsService } from '../services/project-ratings-service';
import { useAuth } from '../context/AuthContext';

interface ProjectRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    companyName: string;
    founder: string;
    sector: string;
    governorate: string;
    image?: string;
  };
  onRatingSubmitted?: () => void;
}

export const ProjectRatingModal: React.FC<ProjectRatingModalProps> = ({
  isOpen,
  onClose,
  project,
  onRatingSubmitted,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'submit' | 'list'>('submit');
  const [ratings, setRatings] = useState<ProjectRating[]>([]);
  const [stats, setStats] = useState<ProjectRatingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<'all' | EvaluatorRole>('all');

  // Form states
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [evaluatorRole, setEvaluatorRole] = useState<EvaluatorRole>('investor');
  const [evaluatorName, setEvaluatorName] = useState(user?.displayName || '');
  const [evaluatorOrg, setEvaluatorOrg] = useState('');
  const [investmentScore, setInvestmentScore] = useState<number>(5);
  const [innovationScore, setInnovationScore] = useState<number>(5);
  const [marketScore, setMarketScore] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [recommendToInvestors, setRecommendToInvestors] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Load project ratings & stats
  const loadRatings = async () => {
    try {
      setLoading(true);
      const data = await ProjectRatingsService.getRatingsByProject(project.id);
      setRatings(data);
      const computed = ProjectRatingsService.calculateStats(data);
      setStats(computed);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadRatings();
      setIsSubmittedSuccess(false);
      if (user?.displayName && !evaluatorName) {
        setEvaluatorName(user.displayName);
      }
    }
  }, [isOpen, project.id, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatorName.trim() || !comment.trim()) return;

    try {
      setIsSubmitting(true);
      await ProjectRatingsService.submitProjectRating({
        projectId: project.id,
        projectName: project.companyName,
        evaluatorName,
        evaluatorRole,
        evaluatorOrganization: evaluatorOrg,
        rating,
        investmentPotentialScore: investmentScore,
        innovationScore,
        marketReadinessScore: marketScore,
        comment,
        recommendToInvestors,
      });

      setIsSubmittedSuccess(true);
      if (onRatingSubmitted) {
        onRatingSubmitted();
      }
      await loadRatings();

      setTimeout(() => {
        setIsSubmittedSuccess(false);
        setActiveTab('list');
      }, 1600);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpful = async (ratingId: string) => {
    await ProjectRatingsService.toggleHelpful(project.id, ratingId);
    setRatings((prev) =>
      prev.map((r) => (r.id === ratingId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r))
    );
  };

  const filteredRatings = ratings.filter((r) => {
    if (filterRole === 'all') return true;
    return r.evaluatorRole === filterRole;
  });

  const getRatingLabel = (val: number) => {
    if (val >= 5) return 'استثنائي وفائق الجدوى (5 نجوم)';
    if (val >= 4) return 'ممتاز جداً واستثماري واعد (4 نجوم)';
    if (val >= 3) return 'جيد ويمتلك إمكانيات واعدة (3 نجوم)';
    if (val >= 2) return 'متوسط ويحتاج لتطوير (نجمتان)';
    return 'غير مجدٍ حالياً (نجمة واحدة)';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl relative border border-slate-200 overflow-hidden animate-in zoom-in-95 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#122e3a] via-[#153e4d] to-[#1f5b70] p-5 sm:p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute left-4 top-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-[#e9cca0] mb-1">
            <Award className="w-4 h-4" />
            <span>منظومة تقييم المشاريع العمانية المعتمدة</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">{project.companyName}</h2>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200 mt-2">
            <span>
              المؤسس: <strong className="text-white">{project.founder}</strong>
            </span>
            <span>•</span>
            <span className="bg-white/10 px-2 py-0.5 rounded-md font-semibold">{project.sector}</span>
            <span>•</span>
            <span>{project.governorate}</span>
          </div>

          {stats && (
            <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-amber-300 font-mono">
                  {stats.averageRating.toFixed(1)}
                </span>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        stats.averageRating >= s
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-white/20 text-white/40'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white/80 font-bold">({stats.totalRatings} تقييم مسجل)</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-1 rounded-lg font-bold">
                  {stats.recommendationRate}% يوصون بالاستثمار
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'submit'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-xl shadow-2xs font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>إضافة تقييم مستثمر / زائر</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'list'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-xl shadow-2xs font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-slate-600" />
            <span>استعراض كافة التقييمات ({ratings.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-right">
          {/* TAB 1: SUBMIT RATING */}
          {activeTab === 'submit' && (
            <div>
              {isSubmittedSuccess ? (
                <div className="text-center py-12 space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">
                    تم استلام تقييمك للمشروع بنجاح!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    شكراً لمساهمتك القيمة في دعم المشاريع الوطنية العمانية ورفد مجتمع المستثمرين والزوار بآراء دقيقة وموثوقة.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Evaluator Role Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-800">
                      صفتك في التقييم: *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'investor', label: 'مستثمر 💼', desc: 'صناديق ومستثمرون' },
                        { id: 'visitor', label: 'زائر / مهتم 👁️', desc: 'مستهلك ومتذوق' },
                        { id: 'business_partner', label: 'شريك أعمال 🤝', desc: 'موزعون وتجار' },
                        { id: 'expert', label: 'خبير اقتصادي 🎓', desc: 'مستشار وريادة' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setEvaluatorRole(item.id as EvaluatorRole)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            evaluatorRole === item.id
                              ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950 font-black shadow-xs ring-1 ring-emerald-500'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className="text-xs font-bold">{item.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Star Rating Picker */}
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-center space-y-2">
                    <label className="block text-xs font-black text-amber-950">
                      التقييم العام للمشروع (من 1 إلى 5 نجوم): *
                    </label>
                    <div className="flex items-center justify-center gap-2 py-1" dir="ltr">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const activeVal = hoverRating || rating;
                        const isFilled = activeVal >= starVal;
                        return (
                          <button
                            key={starVal}
                            type="button"
                            onMouseEnter={() => setHoverRating(starVal)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(starVal)}
                            className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                          >
                            <Star
                              className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                                isFilled
                                  ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                                  : 'fill-slate-200 text-slate-300'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <div className="text-xs font-bold text-amber-900 font-mono">
                      {getRatingLabel(hoverRating || rating)}
                    </div>
                  </div>

                  {/* Name & Organization */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        اسمك الكريم: *
                      </label>
                      <input
                        type="text"
                        required
                        value={evaluatorName}
                        onChange={(e) => setEvaluatorName(e.target.value)}
                        placeholder="سالم بن عبدالله الخروصي"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        الجهة أو المؤسسة (اختياري للمستثمرين):
                      </label>
                      <input
                        type="text"
                        value={evaluatorOrg}
                        onChange={(e) => setEvaluatorOrg(e.target.value)}
                        placeholder="مستثمر ملائكي / صندوق استثماري"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 font-sans"
                      />
                    </div>
                  </div>

                  {/* Detailed Criteria Scores */}
                  <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800">
                        معايير التقييم المتخصصة (اختياري للمستثمرين والخبراء):
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">1 - 5 درجات</span>
                    </div>

                    {/* Criteria 1 */}
                    <div className="flex items-center justify-between text-xs gap-3">
                      <span className="text-slate-700 font-medium">1. الجدوى الاستثمارية والربحية المتوقعة:</span>
                      <div className="flex items-center gap-1" dir="ltr">
                        {[1, 2, 3, 4, 5].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setInvestmentScore(v)}
                            className={`w-6 h-6 rounded-md font-bold text-[11px] transition-all cursor-pointer ${
                              investmentScore >= v
                                ? 'bg-amber-400 text-slate-950 font-black'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Criteria 2 */}
                    <div className="flex items-center justify-between text-xs gap-3">
                      <span className="text-slate-700 font-medium">2. الابتكار والقيمة المضافة بالسوق:</span>
                      <div className="flex items-center gap-1" dir="ltr">
                        {[1, 2, 3, 4, 5].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setInnovationScore(v)}
                            className={`w-6 h-6 rounded-md font-bold text-[11px] transition-all cursor-pointer ${
                              innovationScore >= v
                                ? 'bg-amber-400 text-slate-950 font-black'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Criteria 3 */}
                    <div className="flex items-center justify-between text-xs gap-3">
                      <span className="text-slate-700 font-medium">3. الجاهزية التشغيلية والتوسع التجاري:</span>
                      <div className="flex items-center gap-1" dir="ltr">
                        {[1, 2, 3, 4, 5].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setMarketScore(v)}
                            className={`w-6 h-6 rounded-md font-bold text-[11px] transition-all cursor-pointer ${
                              marketScore >= v
                                ? 'bg-amber-400 text-slate-950 font-black'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ملاحظات وتوصيات التقييم: *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="شاركنا تحليلك لنقاط قوة المشروع، جودة المنتجات، والفرص الاستثمارية التي تراها في السوق..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 leading-relaxed font-sans"
                    />
                  </div>

                  {/* Recommendation Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/70 text-xs">
                    <input
                      type="checkbox"
                      checked={recommendToInvestors}
                      onChange={(e) => setRecommendToInvestors(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-emerald-950">
                      أوصي المستثمرين ورواد الأعمال والجهات التمويلية بدعم هذا المشروع 💼
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#008450] hover:bg-[#00683f] text-white font-black rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Star className="w-4 h-4 fill-white" />
                    <span>{isSubmitting ? 'جاري إرسال التقييم...' : 'اعتماد ونشر تقييم المشروع'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: LIST RATINGS */}
          {activeTab === 'list' && (
            <div className="space-y-5">
              {/* Filter Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span>تصفية التقييمات:</span>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setFilterRole('all')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      filterRole === 'all'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    الكل ({ratings.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterRole('investor')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      filterRole === 'investor'
                        ? 'bg-amber-500 text-slate-950 shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    المستثمرون 💼
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterRole('visitor')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      filterRole === 'visitor'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    الزوار 👁️
                  </button>
                </div>
              </div>

              {/* Reviews List */}
              {filteredRatings.length === 0 ? (
                <div className="text-center py-10 space-y-2 bg-slate-50 rounded-2xl border border-slate-200">
                  <Star className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-bold">لا توجد تقييمات مطابقة لهذا الفلتر بعد.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRatings.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-200/80 transition-all space-y-2.5 shadow-2xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-xs sm:text-sm">
                              {item.evaluatorName}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                item.evaluatorRole === 'investor'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300/60'
                                  : item.evaluatorRole === 'expert'
                                  ? 'bg-indigo-100 text-indigo-900 border-indigo-300/60'
                                  : item.evaluatorRole === 'business_partner'
                                  ? 'bg-blue-100 text-blue-900 border-blue-300/60'
                                  : 'bg-emerald-100 text-emerald-900 border-emerald-300/60'
                              }`}
                            >
                              {item.evaluatorRole === 'investor'
                                ? 'مستثمر معتمد 💼'
                                : item.evaluatorRole === 'expert'
                                ? 'خبير اقتصادي 🎓'
                                : item.evaluatorRole === 'business_partner'
                                ? 'شريك أعمال 🤝'
                                : 'زائر المنصة 👁️'}
                            </span>
                          </div>
                          {item.evaluatorOrganization && (
                            <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                              {item.evaluatorOrganization}
                            </div>
                          )}
                        </div>

                        {/* Stars and Date */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5 text-amber-400" dir="ltr">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  item.rating >= s
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-slate-200 text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {new Date(item.createdAt).toLocaleDateString('ar-OM')}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-sans">
                        {item.comment}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/50 text-[11px]">
                        <div className="flex items-center gap-2">
                          {item.recommendToInvestors && (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>يوصي بالاستثمار</span>
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleHelpful(item.id)}
                          className="flex items-center gap-1 text-slate-500 hover:text-emerald-700 font-bold transition-colors cursor-pointer bg-white border border-slate-200 px-2 py-0.5 rounded-md hover:border-emerald-300"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>مفيد ({item.helpfulCount || 0})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
