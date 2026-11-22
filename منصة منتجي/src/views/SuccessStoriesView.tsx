import React, { useState, useEffect } from 'react';
import {
  Award,
  TrendingUp,
  MapPin,
  Calendar,
  CheckCircle2,
  Share2,
  Sparkles,
  ArrowLeft,
  X,
  Search,
  Star,
  Briefcase,
  Users,
} from 'lucide-react';
import { SUCCESS_STORIES_DATA, SuccessStory } from '../data/mockData';
import { ProjectRatingBadge } from '../components/ProjectRatingBadge';
import { ProjectRatingModal } from '../components/ProjectRatingModal';
import { ProjectRatingsService } from '../services/project-ratings-service';
import { ProjectRatingStats } from '../data/mockProjectRatings';

interface SuccessStoriesViewProps {
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const SuccessStoriesView: React.FC<SuccessStoriesViewProps> = ({
  onNavigate,
  onOpenAuth,
}) => {
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  const [evaluatingProject, setEvaluatingProject] = useState<SuccessStory | null>(null);
  const [ratingsMap, setRatingsMap] = useState<Record<string, ProjectRatingStats>>({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'top_rated' | string>('all');
  const [searchQuery, setSearchQuery] = useState(() => {
    return sessionStorage.getItem('montaji_story_search') || '';
  });

  // Load ratings for all registered projects
  const refreshProjectRatings = async () => {
    const newMap: Record<string, ProjectRatingStats> = {};
    for (const story of SUCCESS_STORIES_DATA) {
      try {
        const stats = await ProjectRatingsService.getProjectStats(story.id);
        newMap[story.id] = stats;
      } catch (e) {
        newMap[story.id] = ProjectRatingsService.calculateStats([]);
      }
    }
    setRatingsMap(newMap);
  };

  useEffect(() => {
    refreshProjectRatings();

    const handleRatingUpdate = () => {
      refreshProjectRatings();
    };

    window.addEventListener('montaji-project-rated', handleRatingUpdate);
    return () => window.removeEventListener('montaji-project-rated', handleRatingUpdate);
  }, []);

  // Sync with Navbar search
  useEffect(() => {
    const initialQuery = sessionStorage.getItem('montaji_story_search');
    if (initialQuery) {
      setSearchQuery(initialQuery);
      sessionStorage.removeItem('montaji_story_search');
    }

    const handleStorySearch = (e: any) => {
      if (e.detail?.query !== undefined) {
        setSearchQuery(e.detail.query);
      }
      if (e.detail?.storyId) {
        const found = SUCCESS_STORIES_DATA.find((s) => s.id === e.detail.storyId);
        if (found) {
          setSelectedStory(found);
        }
      }
    };

    window.addEventListener('montaji-story-search', handleStorySearch);
    return () => window.removeEventListener('montaji-story-search', handleStorySearch);
  }, []);

  let filteredStories = SUCCESS_STORIES_DATA.filter((story) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      story.companyName.toLowerCase().includes(q) ||
      story.founder.toLowerCase().includes(q) ||
      story.sector.toLowerCase().includes(q) ||
      story.governorate.toLowerCase().includes(q) ||
      story.story.toLowerCase().includes(q)
    );
  });

  if (activeFilter === 'top_rated') {
    filteredStories = [...filteredStories].sort((a, b) => {
      const ratingA = ratingsMap[a.id]?.averageRating || 0;
      const ratingB = ratingsMap[b.id]?.averageRating || 0;
      return ratingB - ratingA;
    });
  } else if (activeFilter !== 'all') {
    filteredStories = filteredStories.filter((s) => s.sector.includes(activeFilter));
  }

  // Form for submission
  const [companyName, setCompanyName] = useState('');
  const [founderName, setFounderName] = useState('');
  const [governorate, setGovernorate] = useState('محافظة مسقط');
  const [storyText, setStoryText] = useState('');

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShareSuccess(true);
    setTimeout(() => {
      setShareSuccess(false);
      setShowShareModal(false);
      setCompanyName('');
      setFounderName('');
      setStoryText('');
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-emerald-900/50">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
            <Award className="w-3.5 h-3.5" />
            <span>نماذج عمانية ملهمة</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            قصص نجاح صنعت فارقاً في الاقتصاد الوطني
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            استكشف مسيرة شركات ومؤسسات عمانية ناشئة انطلقت من فكرة طموحة وأصبحت علامات تجارية رائدة تصدر منتجاتها للخليج والعالم بدعم وتسهيلات ريادة.
          </p>
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Share2 className="w-4 h-4" />
              <span>شارك قصة نجاح مشروعك</span>
            </button>
            <button
              onClick={() => setActiveFilter(activeFilter === 'top_rated' ? 'all' : 'top_rated')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                activeFilter === 'top_rated'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-[#e9cca0] border-white/20'
              }`}
            >
              <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>المشاريع الأعلى تقييماً من المستثمرين</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Category Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <span className="text-slate-500 ml-1">تصفح المشاريع:</span>
          {[
            { id: 'all', label: 'كافة المشاريع المسجلة' },
            { id: 'top_rated', label: '⭐ الأعلى تقييماً استثمارياً' },
            { id: 'التقنية والابتكار', label: 'التقنية والابتكار' },
            { id: 'الصناعات التحويلية', label: 'الصناعات التحويلية والطبية' },
            { id: 'الحرف', label: 'الحرف والتراث' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeFilter === cat.id
                  ? 'bg-[#153e4d] text-white shadow-xs font-black'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          عدد المشاريع المعروضة: <strong className="text-slate-900 font-mono">{filteredStories.length}</strong>
        </div>
      </div>

      {/* Active Search Indicator if searching */}
      {searchQuery && (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl text-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-bold">
            <Search className="w-4 h-4 text-emerald-700" />
            <span>تصفية قصص النجاح حسب: "{searchQuery}"</span>
            <span className="text-[11px] bg-emerald-200/60 px-2 py-0.5 rounded-full">
              {filteredStories.length} قصة
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

      {/* Stories Grid */}
      <div className="space-y-8">
        {filteredStories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Award className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">لا توجد قصص نجاح مطابقة لبحثك</h3>
            <p className="text-xs text-slate-500">جرب البحث بكلمات مختلفة أو استعراض كافة القصص.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-[#153e4d] text-[#e9cca0] text-xs font-bold rounded-xl hover:bg-[#122e3a] transition-colors cursor-pointer"
            >
              عرض جميع قصص النجاح
            </button>
          </div>
        ) : (
          filteredStories.map((story, index) => (
          <div
            key={story.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-4 aspect-4/3 rounded-2xl overflow-hidden shadow-sm bg-slate-100">
              <img
                src={story.image}
                alt={story.companyName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-8 space-y-4 text-right">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-50 text-[#008450] font-bold px-2.5 py-0.5 rounded-md">
                      {story.sector}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {story.governorate}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    {story.companyName}
                  </h2>
                </div>

                <div className="text-left">
                  <span className="text-sm font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                    {story.growthRate}
                  </span>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-600">
                المؤسس: <span className="text-slate-900 font-bold">{story.founder}</span> • سنة التأسيس: {story.yearEstablished}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {story.story}
              </p>

              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">
                  أبرز المحطات والإنجازات:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {story.achievements.map((ach, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#008450] shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Rating & Investor Evaluation Section */}
              {ratingsMap[story.id] && (
                <div className="pt-2">
                  <ProjectRatingBadge
                    stats={ratingsMap[story.id]}
                    onOpenRateModal={() => setEvaluatingProject(story)}
                  />
                </div>
              )}

              <div className="pt-3 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setEvaluatingProject(story)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <Star className="w-3.5 h-3.5 fill-slate-950" />
                  <span>تقييم المشروع أو قراءة آراء المستثمرين ({ratingsMap[story.id]?.totalRatings || 0})</span>
                </button>

                <button
                  onClick={() => onNavigate('marketplace.html')}
                  className="text-xs font-bold text-[#008450] hover:text-[#00683f] flex items-center gap-1 cursor-pointer"
                >
                  <span>استكشف منتجات مشابهة في السوق</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
      </div>

      {/* Project Rating & Evaluation Modal */}
      {evaluatingProject && (
        <ProjectRatingModal
          isOpen={!!evaluatingProject}
          onClose={() => setEvaluatingProject(null)}
          project={evaluatingProject}
          onRatingSubmitted={() => refreshProjectRatings()}
        />
      )}

      {/* Share Story Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 animate-in zoom-in-95 my-8">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute left-6 top-6 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {shareSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#008450] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  شكراً لك! تم استلام قصة نجاحك
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  سيقوم فريق التحرير بمراجعة التفاصيل ونشرها في المنصة لإلهام مجتمع رواد الأعمال العمانيين.
                </p>
              </div>
            ) : (
              <form onSubmit={handleShareSubmit} className="space-y-4 text-right">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-black text-slate-900">
                    شارك قصة نجاح مشروعك
                  </h3>
                  <p className="text-xs text-slate-500">
                    قصتك تلهم آلاف الشباب والشابات في سلطنة عمان لبدء مشاريعهم
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم الشركة / المشروع:
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="مثال: مصنع بهلاء للخزف..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم المؤسس / رائد الأعمال:
                  </label>
                  <input
                    type="text"
                    required
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                    placeholder="سالم بن أحمد المعمري"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    المحافظة:
                  </label>
                  <input
                    type="text"
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    placeholder="محافظة مسقط، ظفار، الداخلية..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ملخص قصة النجاح وأهم التحديات التي تجاوزتها:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    placeholder="كيف بدأت الفكرة، الدعم الذي تلقيته من ريادة أو بنك التنمية، وحجم نموك الحالي..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-emerald-500 text-right leading-relaxed"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#008450] hover:bg-[#00683f] text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-md"
                  >
                    إرسال القصة للمراجعة
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
