import React from 'react';
import { Star, TrendingUp, Users, Award, Briefcase } from 'lucide-react';
import { ProjectRatingStats } from '../data/mockProjectRatings';

interface ProjectRatingBadgeProps {
  stats: ProjectRatingStats;
  onOpenRateModal?: () => void;
  variant?: 'card' | 'compact' | 'hero';
}

export const ProjectRatingBadge: React.FC<ProjectRatingBadgeProps> = ({
  stats,
  onOpenRateModal,
  variant = 'card',
}) => {
  const { averageRating, totalRatings, investorCount, visitorCount, recommendationRate } = stats;

  // Render 5 stars based on rating
  const renderStars = (size: string = 'w-4 h-4') => {
    return (
      <div className="flex items-center gap-0.5" dir="ltr">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFull = averageRating >= starIndex;
          const isHalf = !isFull && averageRating >= starIndex - 0.5;
          return (
            <span key={starIndex} className="relative inline-block">
              <Star
                className={`${size} ${
                  isFull
                    ? 'fill-amber-400 text-amber-400 drop-shadow-2xs'
                    : isHalf
                    ? 'fill-amber-400/60 text-amber-400'
                    : 'fill-slate-200 text-slate-300'
                }`}
              />
            </span>
          );
        })}
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-2 bg-amber-50/90 border border-amber-200/80 px-2.5 py-1 rounded-xl text-xs">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span className="font-black text-amber-950 font-mono">{averageRating.toFixed(1)}</span>
        </div>
        <span className="text-amber-800 text-[11px] font-bold">({totalRatings} تقييم)</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-amber-50/70 via-slate-50/90 to-emerald-50/70 border border-amber-200/60 rounded-2xl p-3 sm:p-4 space-y-2.5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Rating and Stars */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-black text-base shadow-sm font-mono">
            {averageRating.toFixed(1)}
          </div>

          <div>
            <div className="flex items-center gap-2">
              {renderStars('w-3.5 h-3.5 sm:w-4 sm:h-4')}
              <span className="text-xs font-black text-slate-900">
                {averageRating >= 4.8
                  ? 'مشروع استثماري رائد ★'
                  : averageRating >= 4.5
                  ? 'تقييم ممتاز'
                  : 'مشروع معتمد'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1.5">
              <span>متوسط تقييم المستثمرين والزوار</span>
              <span>•</span>
              <span className="text-slate-700 font-bold font-mono">({totalRatings} تقييم مسجل)</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {onOpenRateModal && (
          <button
            type="button"
            onClick={onOpenRateModal}
            className="px-3.5 py-1.5 bg-gradient-to-r from-[#122e3a] to-[#153e4d] hover:from-[#153e4d] hover:to-[#1f5b70] text-[#e9cca0] hover:text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer border border-[#c59b5f]/30 active:scale-95"
          >
            <Star className="w-3.5 h-3.5 fill-[#e9cca0] text-[#e9cca0]" />
            <span>تقييم المشروع</span>
          </button>
        )}
      </div>

      {/* Breakdown Pills: Investors, Visitors, Recommendation Rate */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60 text-[11px]">
        {investorCount > 0 && (
          <span className="inline-flex items-center gap-1 bg-amber-100/70 text-amber-900 px-2.5 py-0.5 rounded-lg font-bold border border-amber-200/50">
            <Briefcase className="w-3 h-3 text-amber-700" />
            <span>{investorCount} تقييم مستثمر وشركاء</span>
          </span>
        )}

        {visitorCount > 0 && (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg font-semibold border border-slate-200/60">
            <Users className="w-3 h-3 text-slate-500" />
            <span>{visitorCount} تقييم زائر</span>
          </span>
        )}

        {recommendationRate > 0 && (
          <span className="inline-flex items-center gap-1 bg-emerald-100/70 text-emerald-900 px-2.5 py-0.5 rounded-lg font-bold border border-emerald-200/60 mr-auto">
            <TrendingUp className="w-3 h-3 text-emerald-700" />
            <span>{recommendationRate}% يوصون بالاستثمار</span>
          </span>
        )}
      </div>
    </div>
  );
};
