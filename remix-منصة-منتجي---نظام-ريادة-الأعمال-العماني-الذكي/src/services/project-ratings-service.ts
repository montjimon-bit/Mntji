/**
 * project-ratings-service.ts
 * خدمة تقييم المشاريع العمانية المسجلة في منصة منتجي
 * تتيح للمستثمرين، الخبراء، والزوار تقييم المشاريع، وتخزينها سحابياً في Firestore
 * مع حساب متوسط التقييم ونسب التوصية الاستثمارية وتوزيع المعايير بدقة.
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  updateDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  ProjectRating,
  ProjectRatingStats,
  INITIAL_PROJECT_RATINGS,
  EvaluatorRole,
} from '../data/mockProjectRatings';

const STORAGE_KEY = 'montaji_project_ratings_v1';

export class ProjectRatingsService {
  /**
   * استرجاع كافة التقييمات المحفوظة محلياً أو المبدئية
   */
  private static getStoredRatings(): Record<string, ProjectRating[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read project ratings from localStorage', e);
    }
    // حفظ البيانات المبدئية
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECT_RATINGS));
    return INITIAL_PROJECT_RATINGS;
  }

  /**
   * حفظ التقييمات محلياً
   */
  private static saveStoredRatings(data: Record<string, ProjectRating[]>): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('montaji-project-rated', { detail: { timestamp: Date.now() } }));
    } catch (e) {
      console.warn('Could not save project ratings to localStorage', e);
    }
  }

  /**
   * جلب تقييمات مشروع معين (من Firestore مع التزامن المحلي)
   */
  public static async getRatingsByProject(projectId: string): Promise<ProjectRating[]> {
    const localAll = this.getStoredRatings();
    let ratings = localAll[projectId] ? [...localAll[projectId]] : [];

    try {
      // محاولة الجلب السحابي من Firestore إذا كانت قاعدة البيانات متصلة
      const ratingsRef = collection(db, 'projectRatings');
      const q = query(ratingsRef, where('projectId', '==', projectId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const cloudRatings: ProjectRating[] = [];
        snapshot.forEach((d) => {
          cloudRatings.push({ id: d.id, ...d.data() } as ProjectRating);
        });

        // دمج التقييمات وتجنب التكرار
        const mergedMap = new Map<string, ProjectRating>();
        ratings.forEach((r) => mergedMap.set(r.id, r));
        cloudRatings.forEach((r) => mergedMap.set(r.id, r));
        ratings = Array.from(mergedMap.values());
      }
    } catch (e) {
      // العمل بالبيانات المحلية في حال عدم توفر الاتصال السحابي
      // console.info('Using local fallback for project ratings', e);
    }

    // ترتيب من الأحدث للأقدم
    return ratings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * جلب إحصائيات ومتوسط تقييم مشروع معين
   */
  public static async getProjectStats(projectId: string): Promise<ProjectRatingStats> {
    const ratings = await this.getRatingsByProject(projectId);
    return this.calculateStats(ratings);
  }

  /**
   * حساب الإحصائيات المتكاملة من قائمة التقييمات
   */
  public static calculateStats(ratings: ProjectRating[]): ProjectRatingStats {
    if (!ratings || ratings.length === 0) {
      return {
        averageRating: 5.0,
        totalRatings: 0,
        investorCount: 0,
        visitorCount: 0,
        recommendationRate: 100,
        scores: {
          investmentPotential: 5.0,
          innovation: 5.0,
          marketReadiness: 5.0,
        },
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    let sumRating = 0;
    let sumInvestment = 0;
    let sumInnovation = 0;
    let sumMarket = 0;
    let investorCount = 0;
    let visitorCount = 0;
    let recommendCount = 0;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    ratings.forEach((r) => {
      sumRating += r.rating;
      sumInvestment += r.investmentPotentialScore || r.rating;
      sumInnovation += r.innovationScore || r.rating;
      sumMarket += r.marketReadinessScore || r.rating;

      if (r.evaluatorRole === 'investor' || r.evaluatorRole === 'business_partner') {
        investorCount++;
      } else {
        visitorCount++;
      }

      if (r.recommendToInvestors) {
        recommendCount++;
      }

      const roundedStar = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      distribution[roundedStar] = (distribution[roundedStar] || 0) + 1;
    });

    const count = ratings.length;
    return {
      averageRating: Number((sumRating / count).toFixed(1)),
      totalRatings: count,
      investorCount,
      visitorCount,
      recommendationRate: Math.round((recommendCount / count) * 100),
      scores: {
        investmentPotential: Number((sumInvestment / count).toFixed(1)),
        innovation: Number((sumInnovation / count).toFixed(1)),
        marketReadiness: Number((sumMarket / count).toFixed(1)),
      },
      distribution,
    };
  }

  /**
   * إضافة تقييم جديد لمشروع عماني مسجل
   */
  public static async submitProjectRating(params: {
    projectId: string;
    projectName: string;
    evaluatorName: string;
    evaluatorRole: EvaluatorRole;
    evaluatorOrganization?: string;
    rating: number;
    investmentPotentialScore?: number;
    innovationScore?: number;
    marketReadinessScore?: number;
    comment: string;
    recommendToInvestors?: boolean;
  }): Promise<ProjectRating> {
    const newRating: ProjectRating = {
      id: `pr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      projectId: params.projectId,
      projectName: params.projectName,
      evaluatorName: params.evaluatorName.trim(),
      evaluatorRole: params.evaluatorRole,
      evaluatorOrganization: params.evaluatorOrganization?.trim() || (params.evaluatorRole === 'investor' ? 'مستثمر مستقل' : 'زائر المنصة'),
      rating: Number(params.rating),
      investmentPotentialScore: Number(params.investmentPotentialScore || params.rating),
      innovationScore: Number(params.innovationScore || params.rating),
      marketReadinessScore: Number(params.marketReadinessScore || params.rating),
      comment: params.comment.trim(),
      recommendToInvestors: params.recommendToInvestors !== false,
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
    };

    // 1. التخزين المحلي
    const all = this.getStoredRatings();
    if (!all[params.projectId]) {
      all[params.projectId] = [];
    }
    all[params.projectId].unshift(newRating);
    this.saveStoredRatings(all);

    // 2. المحاولة السحابية في Firestore
    try {
      const docRef = doc(db, 'projectRatings', newRating.id);
      await setDoc(docRef, {
        ...newRating,
        serverCreatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Could not save project rating to Firestore (cached locally)', e);
    }

    return newRating;
  }

  /**
   * زيادة عدد الإعجاب / مفيد لتقييم معين
   */
  public static async toggleHelpful(projectId: string, ratingId: string): Promise<number> {
    const all = this.getStoredRatings();
    let newCount = 1;

    if (all[projectId]) {
      const item = all[projectId].find((r) => r.id === ratingId);
      if (item) {
        item.helpfulCount = (item.helpfulCount || 0) + 1;
        newCount = item.helpfulCount;
        this.saveStoredRatings(all);
      }
    }

    try {
      const docRef = doc(db, 'projectRatings', ratingId);
      await updateDoc(docRef, {
        helpfulCount: increment(1),
      });
    } catch (e) {
      // Local is already saved
    }

    return newCount;
  }

  /**
   * جلب كافة تقييمات المشاريع المسجلة (للمشرف وقاعدة البيانات)
   */
  public static async getAllRatings(): Promise<ProjectRating[]> {
    const localAll = this.getStoredRatings();
    const flatRatings: ProjectRating[] = [];
    Object.values(localAll).forEach((list) => {
      flatRatings.push(...list);
    });

    try {
      const snap = await getDocs(collection(db, 'projectRatings'));
      if (!snap.empty) {
        const merged = new Map<string, ProjectRating>();
        flatRatings.forEach((r) => merged.set(r.id, r));
        snap.forEach((d) => merged.set(d.id, { id: d.id, ...d.data() } as ProjectRating));
        return Array.from(merged.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    } catch (e) {
      // Local fallback
    }

    return flatRatings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
