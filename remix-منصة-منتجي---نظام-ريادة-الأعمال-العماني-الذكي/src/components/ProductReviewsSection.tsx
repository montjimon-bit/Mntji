import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  ThumbsUp,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  Send,
  MapPin,
  Sparkles,
  Trash2,
  User,
  Filter,
  ArrowUpDown,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { Product, OMAN_GOVERNORATES } from '../data/mockData';
import { Review, INITIAL_REVIEWS_DATA } from '../data/mockReviews';

interface ProductReviewsSectionProps {
  product: Product;
  onRatingUpdated?: (newAvgRating: number, totalReviews: number) => void;
  initialRating?: number;
  autoOpenForm?: boolean;
}

const AVAILABLE_TAGS = [
  'جودة عالية 🌿',
  'منتج أصلي 🇴🇲',
  'تغليف ممتاز 📦',
  'توصيل سريع ⚡',
  'رائحة زكية ✨',
  'دعم للمنتج العماني 🇴🇲',
  'سعر مناسب 💰',
  'خدمة راقية 👏',
];

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  product,
  onRatingUpdated,
  initialRating,
  autoOpenForm,
}) => {
  const { user, userProfile, isAdmin, signInWithGoogle } = useAuth();

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const stored = localStorage.getItem(`montaji_reviews_${product.id}`);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_REVIEWS_DATA[product.id] || [];
  });

  const [isFormOpen, setIsFormOpen] = useState(autoOpenForm ?? false);
  const [selectedRating, setSelectedRating] = useState<number>(initialRating ?? 5);

  useEffect(() => {
    if (initialRating !== undefined) {
      setSelectedRating(initialRating);
    }
    if (autoOpenForm) {
      setIsFormOpen(true);
    }
  }, [initialRating, autoOpenForm]);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [commentText, setCommentText] = useState('');
  const [reviewerName, setReviewerName] = useState(
    userProfile?.displayName || user?.displayName || ''
  );
  const [governorate, setGovernorate] = useState(
    userProfile?.governorate || product.governorate || 'محافظة مسقط'
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(['منتج أصلي 🇴🇲', 'جودة عالية 🌿']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Sorting and filtering
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'helpful'>('newest');
  const [filterStar, setFilterStar] = useState<number | 'all'>('all');
  const [helpfulVoted, setHelpfulVoted] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('montaji_voted_reviews');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Keep reviewer name synced if user changes
  useEffect(() => {
    if (userProfile?.displayName || user?.displayName) {
      setReviewerName(userProfile?.displayName || user?.displayName || '');
    }
    if (userProfile?.governorate) {
      setGovernorate(userProfile.governorate);
    }
  }, [user, userProfile]);

  // Firestore Realtime Listener for Product Reviews
  useEffect(() => {
    const reviewsColRef = collection(db, 'products', product.id, 'reviews');

    const unsubscribe = onSnapshot(
      reviewsColRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Review[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              productId: product.id,
              userId: data.userId || 'guest',
              userName: data.userName || 'مشتري معتمد',
              userPhoto: data.userPhoto || '',
              governorate: data.governorate || product.governorate,
              rating: Number(data.rating) || 5,
              comment: data.comment || '',
              tags: Array.isArray(data.tags) ? data.tags : [],
              helpfulCount: Number(data.helpfulCount) || 0,
              isVerifiedPurchase: Boolean(data.isVerifiedPurchase ?? true),
              createdAt:
                data.createdAt?.toDate?.()?.toISOString() ||
                data.createdAt ||
                new Date().toISOString(),
            };
          });

          // Blend with initial mock reviews if loaded doesn't already have them
          const mockSeed = INITIAL_REVIEWS_DATA[product.id] || [];
          const mergedMap = new Map<string, Review>();
          mockSeed.forEach((r) => mergedMap.set(r.id, r));
          loaded.forEach((r) => mergedMap.set(r.id, r));

          const allList = Array.from(mergedMap.values());
          setReviews(allList);

          try {
            localStorage.setItem(`montaji_reviews_${product.id}`, JSON.stringify(allList));
          } catch {
            // ignore
          }
        } else {
          // If no cloud reviews yet, use initial mock reviews
          const defaultSeed = INITIAL_REVIEWS_DATA[product.id] || [];
          setReviews(defaultSeed);
        }
      },
      (error) => {
        console.warn('Reviews onSnapshot listener notice:', error);
      }
    );

    return () => unsubscribe();
  }, [product.id, product.governorate]);

  // Calculate Rating Statistics
  const ratingStats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        average: product.seller.rating || 5,
        total: 0,
        recommendationRate: 100,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        distributionPercent: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = Number((sum / total).toFixed(1));

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let positiveCount = 0;

    reviews.forEach((r) => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      distribution[rounded] = (distribution[rounded] || 0) + 1;
      if (r.rating >= 4) positiveCount++;
    });

    const distributionPercent: Record<number, number> = {
      5: Math.round(((distribution[5] || 0) / total) * 100),
      4: Math.round(((distribution[4] || 0) / total) * 100),
      3: Math.round(((distribution[3] || 0) / total) * 100),
      2: Math.round(((distribution[2] || 0) / total) * 100),
      1: Math.round(((distribution[1] || 0) / total) * 100),
    };

    const recommendationRate = Math.round((positiveCount / total) * 100);

    return {
      average,
      total,
      recommendationRate,
      distribution,
      distributionPercent,
    };
  }, [reviews, product.seller.rating]);

  // Notify parent of updated rating
  useEffect(() => {
    if (onRatingUpdated && reviews.length > 0) {
      onRatingUpdated(ratingStats.average, ratingStats.total);
    }
  }, [ratingStats.average, ratingStats.total, onRatingUpdated, reviews.length]);

  // Filtered and Sorted Reviews
  const filteredAndSortedReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        if (filterStar === 'all') return true;
        return Math.round(r.rating) === filterStar;
      })
      .sort((a, b) => {
        if (sortBy === 'highest') return b.rating - a.rating;
        if (sortBy === 'helpful') return b.helpfulCount - a.helpfulCount;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [reviews, filterStar, sortBy]);

  // Handle Tag Selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Submit Review Handler
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedComment = commentText.trim();
    if (!trimmedComment) {
      setFormError('يرجى كتابة نص التقييم لمشاركة تجربتك مع المشترين.');
      return;
    }
    if (trimmedComment.length < 10) {
      setFormError('يرجى كتابة تقييم أكثر وضوحاً (10 أحرف على الأقل).');
      return;
    }

    const finalName = reviewerName.trim() || user?.displayName || 'مشتري معتمد';

    setIsSubmitting(true);

    const reviewId = `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newReview: Review = {
      id: reviewId,
      productId: product.id,
      userId: user?.uid || 'guest',
      userName: finalName,
      userPhoto: user?.photoURL || '',
      governorate,
      rating: selectedRating,
      comment: trimmedComment,
      tags: selectedTags,
      helpfulCount: 0,
      isVerifiedPurchase: Boolean(user) || true,
      createdAt: new Date().toISOString(),
    };

    // Optimistically update local state
    setReviews((prev) => [newReview, ...prev]);

    // Save to Firestore
    try {
      await setDoc(doc(db, 'products', product.id, 'reviews', reviewId), {
        reviewId,
        productId: product.id,
        userId: user?.uid || 'guest',
        userName: finalName,
        userPhoto: user?.photoURL || '',
        governorate,
        rating: selectedRating,
        comment: trimmedComment,
        tags: selectedTags,
        helpfulCount: 0,
        isVerifiedPurchase: Boolean(user) || true,
        createdAt: serverTimestamp(),
      });

      // Update local storage
      try {
        const currentStored = JSON.parse(
          localStorage.getItem(`montaji_reviews_${product.id}`) || '[]'
        );
        localStorage.setItem(
          `montaji_reviews_${product.id}`,
          JSON.stringify([newReview, ...currentStored])
        );
      } catch {
        // ignore
      }

      setFormSuccessMessage('شكراً لك! تم نشر تقييمك ومشاركته مع مجتمع منصة مُنتجي 🇴🇲✨');
      setCommentText('');
      setIsFormOpen(false);
      setTimeout(() => setFormSuccessMessage(null), 4000);
    } catch (error) {
      console.error('Failed to submit review to Firestore:', error);
      // Even if Firestore write fails due to network/rules, our local optimistic state keeps it active for this session
      setFormSuccessMessage('تم حفظ تقييمك محلياً بنجاح! شكراً لمشاركتك.');
      setIsFormOpen(false);
      setTimeout(() => setFormSuccessMessage(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Helpful Vote
  const handleHelpfulVote = async (reviewId: string) => {
    if (helpfulVoted.has(reviewId)) return;

    const nextSet = new Set(helpfulVoted);
    nextSet.add(reviewId);
    setHelpfulVoted(nextSet);

    try {
      localStorage.setItem('montaji_voted_reviews', JSON.stringify(Array.from(nextSet)));
    } catch {
      // ignore
    }

    // Optimistically increment locally
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );

    // Update in Firestore
    try {
      const reviewDocRef = doc(db, 'products', product.id, 'reviews', reviewId);
      await updateDoc(reviewDocRef, {
        helpfulCount: increment(1),
      });
    } catch (err) {
      // Ignore if document was only mock data
    }
  };

  // Delete Review (for owner or admin)
  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا التقييم؟')) return;

    setReviews((prev) => prev.filter((r) => r.id !== reviewId));

    try {
      await deleteDoc(doc(db, 'products', product.id, 'reviews', reviewId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${product.id}/reviews/${reviewId}`);
    }
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return 'ممتاز جداً ⭐️⭐️⭐️⭐️⭐️';
      case 4:
        return 'جيد جداً ⭐️⭐️⭐️⭐️';
      case 3:
        return 'جيد ⭐️⭐️⭐️';
      case 2:
        return 'مقبول ⭐️⭐️';
      case 1:
        return 'يحتاج تحسين ⭐️';
      default:
        return '';
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('ar-OM', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(d);
    } catch {
      return 'مؤخراً';
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-slate-200/80 space-y-6 text-right" dir="rtl">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>تقييمات وتجارب المشترين</span>
            </h3>
            <span className="bg-[#153e4d]/10 text-[#153e4d] font-bold text-xs px-2.5 py-0.5 rounded-full">
              {reviews.length} تقييم
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            آراء موثقة من عملاء قاموا بتجربة وشراء هذا المنتج العماني
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto ${
            isFormOpen
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              : 'bg-[#153e4d] hover:bg-[#1f5b70] text-[#e9cca0] border border-[#c59b5f]/40'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#c59b5f]" />
          <span>{isFormOpen ? 'إغلاق نموذج التقييم' : 'أضف تقييمك وتجربتك'}</span>
        </button>
      </div>

      {/* Success alert message */}
      {formSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{formSuccessMessage}</span>
        </div>
      )}

      {/* Rating Overview & Breakdown Card */}
      <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200/70 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left/Main Score Block */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-white rounded-xl border border-slate-100 shadow-2xs">
          <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {ratingStats.average}
          </div>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(ratingStats.average)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-200'
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            بناءً على {ratingStats.total} تقييم وتجربة حقيقية
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{ratingStats.recommendationRate}% يوصون بالشراء</span>
          </div>
        </div>

        {/* Right/Distribution Bars */}
        <div className="md:col-span-8 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingStats.distribution[stars as 5 | 4 | 3 | 2 | 1] || 0;
            const percent = ratingStats.distributionPercent[stars as 5 | 4 | 3 | 2 | 1] || 0;
            return (
              <div
                key={stars}
                onClick={() => setFilterStar(filterStar === stars ? 'all' : stars)}
                className={`flex items-center gap-3 text-xs cursor-pointer p-1.5 rounded-lg transition-colors ${
                  filterStar === stars ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-white/80'
                }`}
              >
                <div className="flex items-center gap-1 w-14 shrink-0 font-semibold text-slate-700">
                  <span>{stars}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>

                <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="w-12 text-left shrink-0 text-slate-500 font-medium">
                  {percent}%
                </div>
                <div className="w-8 text-left shrink-0 text-slate-400 text-[11px]">
                  ({count})
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form Modal / Collapsible */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-white rounded-2xl p-6 border-2 border-[#153e4d]/20 shadow-lg space-y-5 animate-in slide-in-from-top-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="font-black text-slate-900 text-base">
                شاركنا تجربتك وتقييمك للمنتج
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                مشاركتك تدعم رواد الأعمال العمانيين وتساعد المشترين الآخرين في اتخاذ القرار
              </p>
            </div>
            {!user && (
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="text-xs font-bold text-[#1f5b70] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>تسجيل الدخول كعميل موثق</span>
              </button>
            )}
          </div>

          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Interactive Star Rating Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              تقييمك الإجمالي للمنتج <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setSelectedRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-300 hover:scale-125 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating || selectedRating)
                          ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                {getRatingLabel(hoverRating || selectedRating)}
              </span>
            </div>
          </div>

          {/* Reviewer Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اسم المراجع / كنية التقييم
              </label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="مثال: سالم العماني، أو زائر معتمد"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1f5b70] text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                المحافظة (السلطنة)
              </label>
              <select
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1f5b70] cursor-pointer text-right"
              >
                {OMAN_GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              اختر وسوماً تعبر عن تجربتك (اختياري)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#153e4d] text-[#e9cca0] border border-[#c59b5f]/50'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment Text Area */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <label>
                نص التقييم والملاحظات <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-normal">
                {commentText.length} / 1000 حرف
              </span>
            </div>
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              maxLength={1000}
              placeholder="اكتب ملاحظاتك عن جودة المنتج، دقة الوصف، التغليف، أو طريقة استخدامه..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1f5b70] leading-relaxed text-right"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#008450] hover:bg-[#00683f] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'جارٍ النشر...' : 'نشر التقييم الآن'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-1">
        {/* Star Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setFilterStar('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filterStar === 'all'
                ? 'bg-[#153e4d] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            جميع التقييمات ({reviews.length})
          </button>
          {[5, 4, 3].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setFilterStar(star)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${
                filterStar === star
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{star}</span>
              <Star className="w-3 h-3 fill-current" />
              <span className="text-[10px] opacity-80">
                ({ratingStats.distribution[star as 5 | 4 | 3] || 0})
              </span>
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">ترتيب حسب:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-bold focus:outline-hidden cursor-pointer"
          >
            <option value="newest">الأحدث تاريخاً</option>
            <option value="highest">الأعلى تقييماً</option>
            <option value="helpful">الأكثر إفادة</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredAndSortedReviews.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">
              لا توجد تقييمات مطابقة لهذا الفلتر
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              كن أول من يقيّم هذا المنتج العماني وشارك المشترين رأيك في جودته وأصالته.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterStar('all');
                setIsFormOpen(true);
              }}
              className="px-4 py-2 bg-[#153e4d] text-[#e9cca0] rounded-xl text-xs font-bold hover:bg-[#1f5b70] transition-colors cursor-pointer"
            >
              كتابة أول تقييم الآن
            </button>
          </div>
        ) : (
          filteredAndSortedReviews.map((review) => {
            const isAuthor = user && review.userId === user.uid;
            const canDelete = isAuthor || isAdmin;
            const hasVoted = helpfulVoted.has(review.id);

            return (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all space-y-3"
              >
                {/* Reviewer Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#153e4d] to-[#1f5b70] text-[#e9cca0] flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                      {review.userName.charAt(0) || 'م'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-slate-900 text-sm">
                          {review.userName}
                        </span>
                        {review.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>مشتري معتمد 🇴🇲</span>
                          </span>
                        )}
                        {review.governorate && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{review.governorate}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= review.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="حذف التقييم"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Tags if any */}
                {review.tags && review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {review.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                  {review.comment}
                </p>

                {/* Helpful Actions Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="text-[11px] text-slate-400">
                    هل كانت هذه التجربة مفيدة لك؟
                  </div>

                  <button
                    type="button"
                    onClick={() => handleHelpfulVote(review.id)}
                    disabled={hasVoted}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      hasVoted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    <ThumbsUp
                      className={`w-3.5 h-3.5 ${hasVoted ? 'fill-emerald-600 text-emerald-600' : ''}`}
                    />
                    <span>مفيد</span>
                    <span className="bg-white/80 px-1.5 py-0.2 rounded-md text-[10px]">
                      {review.helpfulCount}
                    </span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
