/**
 * AwniConversationsManager.tsx
 * A comprehensive smart classification and folder management component for Awni advisor.
 * Allows users to organize, browse, search, and resume saved feasibility studies,
 * business ideas, and consultations across custom folders and smart categories.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Folder,
  FolderPlus,
  FolderOpen,
  Search,
  Trash2,
  Edit3,
  Star,
  Clock,
  Check,
  Plus,
  X,
  TrendingUp,
  Lightbulb,
  Building,
  CreditCard,
  ShoppingBag,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Filter,
  ExternalLink,
  Tag,
  ChevronDown,
} from 'lucide-react';
import {
  AwniClassificationService,
  AwniCategoryKey,
  AwniCategoryConfig,
  AwniFolder,
  SavedAwniConversation,
  AWNI_CATEGORIES,
} from '../services/awni-classification-service';
import { ChatMessage } from '../services/ai-service';

interface AwniConversationsManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentMessages?: ChatMessage[];
  onSelectConversation: (conversation: SavedAwniConversation) => void;
  userId?: string;
  onSaveCurrentSuccess?: () => void;
}

export const AwniConversationsManager: React.FC<AwniConversationsManagerProps> = ({
  isOpen,
  onClose,
  currentMessages = [],
  onSelectConversation,
  userId,
  onSaveCurrentSuccess,
}) => {
  const [conversations, setConversations] = useState<SavedAwniConversation[]>([]);
  const [customFolders, setCustomFolders] = useState<AwniFolder[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<AwniCategoryKey | 'all'>('all');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // New folder modal state
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#153e4d');

  // Save current conversation modal state
  const [showSaveCurrentModal, setShowSaveCurrentModal] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [saveCategory, setSaveCategory] = useState<AwniCategoryKey>('feasibility');
  const [saveFolderId, setSaveFolderId] = useState<string>('');
  const [saveTags, setSaveTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Move conversation modal state
  const [movingConversation, setMovingConversation] = useState<SavedAwniConversation | null>(null);
  const [targetMoveFolder, setTargetMoveFolder] = useState<string>('');
  const [targetMoveCategory, setTargetMoveCategory] = useState<AwniCategoryKey>('general');

  // Success toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const [loadedFolders, loadedConvs] = await Promise.all([
        AwniClassificationService.getCustomFolders(userId),
        AwniClassificationService.getSavedConversations(userId),
      ]);
      setCustomFolders(loadedFolders);
      setConversations(loadedConvs);
    } catch (err) {
      console.error('Failed loading Awni archive:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, userId]);

  // When user opens "Save Current", auto-classify using smart AI engine
  const handleOpenSaveCurrent = () => {
    if (!currentMessages || currentMessages.length === 0) {
      showToast('لا توجد رسائل نشطة في المحادثة الحالية لحفظها');
      return;
    }
    const classification = AwniClassificationService.classifyConversation(currentMessages);
    setSaveTitle(classification.title);
    setSaveCategory(classification.category);
    setSaveTags(classification.tags);
    setSaveFolderId(customFolders[0]?.id || '');
    setShowSaveCurrentModal(true);
  };

  // Confirm saving current active conversation
  const handleConfirmSaveCurrent = async () => {
    if (!saveTitle.trim()) {
      showToast('يرجى تحديد عنوان للمشروع أو المحادثة');
      return;
    }

    const classification = AwniClassificationService.classifyConversation(currentMessages, saveTitle);

    const newConv: SavedAwniConversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      title: saveTitle.trim(),
      folderId: saveFolderId || undefined,
      category: saveCategory,
      summary: classification.summary,
      tags: saveTags.length > 0 ? saveTags : classification.tags,
      messages: currentMessages,
      starred: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await AwniClassificationService.saveConversation(newConv, userId);
    await loadData();
    setShowSaveCurrentModal(false);
    showToast('تم حفظ وتصنيف المحادثة بنجاح في الأرشيف المنظم! 📁✨');
    onSaveCurrentSuccess?.();
  };

  // Create custom folder
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    await AwniClassificationService.createCustomFolder(
      newFolderName.trim(),
      newFolderColor,
      'Folder',
      userId
    );
    setNewFolderName('');
    setShowCreateFolderModal(false);
    await loadData();
    showToast('تم إنشاء المجلد الجديد بنجاح');
  };

  // Delete custom folder
  const handleDeleteFolder = async (folderId: string, folderName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`هل أنت متأكد من حذف المجلد "${folderName}"؟ لن يتم حذف المحادثات الموجودة بداخله.`)) {
      await AwniClassificationService.deleteCustomFolder(folderId, userId);
      if (selectedFolderId === folderId) {
        setSelectedFolderId(null);
      }
      await loadData();
      showToast('تم حذف المجلد بنجاح');
    }
  };

  // Delete conversation
  const handleDeleteConversation = async (convId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`هل أنت متأكد من حذف المحادثة المنظمة "${title}" من الأرشيف؟`)) {
      await AwniClassificationService.deleteConversation(convId, userId);
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      showToast('تم حذف المحادثة من الأرشيف');
    }
  };

  // Toggle star
  const handleToggleStar = async (conv: SavedAwniConversation, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...conv, starred: !conv.starred };
    await AwniClassificationService.saveConversation(updated, userId);
    setConversations((prev) => prev.map((c) => (c.id === conv.id ? updated : c)));
  };

  // Open move modal
  const handleOpenMoveModal = (conv: SavedAwniConversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setMovingConversation(conv);
    setTargetMoveFolder(conv.folderId || '');
    setTargetMoveCategory(conv.category);
  };

  // Confirm move
  const handleConfirmMove = async () => {
    if (!movingConversation) return;

    await AwniClassificationService.assignConversationToFolder(
      movingConversation.id,
      targetMoveFolder || undefined,
      targetMoveCategory,
      userId
    );

    setConversations((prev) =>
      prev.map((c) =>
        c.id === movingConversation.id
          ? { ...c, folderId: targetMoveFolder || undefined, category: targetMoveCategory }
          : c
      )
    );

    setMovingConversation(null);
    showToast('تم نقل وتحديث تصنيف المحادثة بنجاح');
  };

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      // Category filter
      if (selectedCategory !== 'all' && conv.category !== selectedCategory) {
        return false;
      }
      // Folder filter
      if (selectedFolderId && conv.folderId !== selectedFolderId) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = conv.title.toLowerCase().includes(q);
        const matchSummary = conv.summary.toLowerCase().includes(q);
        const matchTags = conv.tags.some((t) => t.toLowerCase().includes(q));
        const matchMessages = conv.messages.some((m) => m.text.toLowerCase().includes(q));
        if (!matchTitle && !matchSummary && !matchTags && !matchMessages) {
          return false;
        }
      }
      return true;
    });
  }, [conversations, selectedCategory, selectedFolderId, searchQuery]);

  // Counts by category
  const countsByCategory = useMemo(() => {
    const map: Record<string, number> = { all: conversations.length };
    AWNI_CATEGORIES.forEach((cat) => {
      map[cat.id] = conversations.filter((c) => c.category === cat.id).length;
    });
    return map;
  }, [conversations]);

  // Counts by folder
  const countsByFolder = useMemo(() => {
    const map: Record<string, number> = {};
    customFolders.forEach((f) => {
      map[f.id] = conversations.filter((c) => c.folderId === f.id).length;
    });
    return map;
  }, [conversations, customFolders]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-2 sm:p-4 md:p-6 animate-in fade-in duration-200" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-60 bg-[#122e3a] text-[#e9cca0] border border-[#c59b5f] px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Archive Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-5xl h-[92vh] sm:h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#122e3a] via-[#153e4d] to-[#1f5b70] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#c59b5f]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#c59b5f] via-[#e9cca0] to-[#dfba83] p-0.5 shadow-md">
              <div className="w-full h-full bg-[#122e3a] rounded-2xl flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-[#e9cca0]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-base sm:text-lg tracking-wide">
                  أرشيف ومجلدات المستشار عوني
                </h3>
                <span className="text-[10px] bg-[#c59b5f]/25 text-[#f5e3c7] border border-[#c59b5f]/40 px-2.5 py-0.5 rounded-full font-bold">
                  تصنيف ذكي 🇴🇲
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                تنظيم دراسات الجدوى، الأفكار التجارية، وملفات التأسيس للرجوع إليها في أي وقت
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick button to save current session */}
            {currentMessages && currentMessages.length > 1 && (
              <button
                type="button"
                onClick={handleOpenSaveCurrent}
                className="px-3 py-1.5 bg-[#c59b5f] hover:bg-[#d8b075] text-[#122e3a] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="حفظ وتصنيف جلسة المحادثة الحالية"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">حفظ الجلسة الحالية</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area: Sidebar Folders + Main List */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar / Folders & Categories List */}
          <div className="w-full md:w-72 bg-[#f8fafb] border-b md:border-b-0 md:border-l border-slate-200 flex flex-col shrink-0">
            {/* Action Bar inside Sidebar */}
            <div className="p-3 border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Folder className="w-4 h-4 text-[#153e4d]" />
                <span>التصنيفات والمجلدات</span>
              </span>
              <button
                type="button"
                onClick={() => setShowCreateFolderModal(true)}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#153e4d] font-bold text-[11px] rounded-lg border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                title="إنشاء مجلد جديد"
              >
                <Plus className="w-3.5 h-3.5 text-[#c59b5f]" />
                <span>مجلد جديد</span>
              </button>
            </div>

            {/* Scrollable Category & Custom Folder List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
              {/* Smart System Categories */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block px-2 mb-1">
                  التصنيفات الذكية
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedFolderId(null);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-right transition-colors cursor-pointer ${
                    selectedCategory === 'all' && !selectedFolderId
                      ? 'bg-[#153e4d] text-white font-bold shadow-xs'
                      : 'hover:bg-slate-200/60 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-[#c59b5f]" />
                    <span>كافة المحادثات والمشاريع</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      selectedCategory === 'all' && !selectedFolderId
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {countsByCategory.all || 0}
                  </span>
                </button>

                {AWNI_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id && !selectedFolderId;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedFolderId(null);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-right transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#153e4d] text-white font-bold shadow-xs'
                          : 'hover:bg-slate-200/60 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {cat.id === 'feasibility' && <TrendingUp className="w-4 h-4 text-amber-500" />}
                        {cat.id === 'ideas' && <Lightbulb className="w-4 h-4 text-indigo-500" />}
                        {cat.id === 'riyada' && <Building className="w-4 h-4 text-emerald-500" />}
                        {cat.id === 'finance' && <CreditCard className="w-4 h-4 text-teal-500" />}
                        {cat.id === 'marketplace' && <ShoppingBag className="w-4 h-4 text-rose-500" />}
                        {cat.id === 'general' && <MessageSquare className="w-4 h-4 text-slate-500" />}
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {countsByCategory[cat.id] || 0}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* User Custom Folders */}
              <div className="space-y-1 pt-2 border-t border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block px-2 mb-1">
                  المجلدات المخصصة ({customFolders.length})
                </span>

                {customFolders.length === 0 ? (
                  <div className="px-3 py-3 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-600 text-[11px] leading-relaxed">
                    لا توجد مجلدات مخصصة بعد. اضغط على "+ مجلد جديد" لتنظيم مشاريعك حسب ولاياتك أو مجالاتك!
                  </div>
                ) : (
                  customFolders.map((folder) => {
                    const isSelected = selectedFolderId === folder.id;
                    return (
                      <div
                        key={folder.id}
                        onClick={() => {
                          setSelectedFolderId(folder.id);
                          setSelectedCategory('all');
                        }}
                        className={`group w-full flex items-center justify-between px-3 py-2 rounded-xl text-right transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#153e4d] text-white font-bold shadow-xs'
                            : 'hover:bg-slate-200/60 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: folder.color || '#153e4d' }}
                          />
                          <span className="truncate">{folder.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {countsByFolder[folder.id] || 0}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteFolder(folder.id, folder.name, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 rounded transition-opacity"
                            title="حذف المجلد"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Main List Area */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Search and Filters Bar */}
            <div className="p-3 sm:p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في دراسات الجدوى والأفكار والكلمات الدلالية..."
                  className="w-full bg-white border border-slate-300 focus:border-[#1f5b70] rounded-xl pr-10 pl-3 py-2 text-xs focus:outline-hidden transition-all text-right"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-semibold shrink-0">
                  عرض: <strong>{filteredConversations.length}</strong> محادثة
                </span>
                {currentMessages && currentMessages.length > 1 && (
                  <button
                    type="button"
                    onClick={handleOpenSaveCurrent}
                    className="px-3 py-1.5 bg-[#153e4d] hover:bg-[#122e3a] text-[#e9cca0] text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>حفظ المحادثة النشطة</span>
                  </button>
                )}
              </div>
            </div>

            {/* Conversations List Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-600 space-y-2">
                  <div className="w-8 h-8 border-3 border-[#c59b5f] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs">جاري تحميل وتصنيف المحفوظات...</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-16 px-4 bg-slate-50/70 border border-dashed border-slate-200 rounded-3xl space-y-3">
                  <div className="w-14 h-14 bg-amber-50 text-[#c59b5f] rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-amber-200">
                    <Folder className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800">
                    لم يتم العثور على محادثات أو دراسات في هذا التصنيف
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    {searchQuery
                      ? 'لا توجد نتائج تطابق بحثك. جرّب كلمات دلالية مختلفة أو امسح شريط البحث.'
                      : 'يمكنك حفظ أي استشارة أو دراسة جدوى من نافذة الدردشة مع عوني بالضغط على "حفظ الجلسة".'}
                  </p>
                  {currentMessages && currentMessages.length > 1 && (
                    <button
                      type="button"
                      onClick={handleOpenSaveCurrent}
                      className="px-4 py-2 bg-[#153e4d] text-[#e9cca0] font-bold text-xs rounded-xl shadow-md hover:bg-[#122e3a] transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>حفظ الجلسة النشطة الحالية الآن</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredConversations.map((conv) => {
                    const catConfig =
                      AWNI_CATEGORIES.find((c) => c.id === conv.category) || AWNI_CATEGORIES[0];
                    const folder = customFolders.find((f) => f.id === conv.folderId);
                    const formattedDate = new Date(conv.updatedAt || conv.createdAt).toLocaleDateString(
                      'ar-OM',
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }
                    );

                    return (
                      <div
                        key={conv.id}
                        className="bg-white border border-slate-200 hover:border-[#1f5b70]/60 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all group relative flex flex-col justify-between"
                      >
                        {/* Top row: Category Badge, Folder, Star, Date */}
                        <div className="flex items-start justify-between gap-2 pb-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {/* Category Badge */}
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${catConfig.bgColor} ${catConfig.color} ${catConfig.borderColor}`}
                            >
                              {catConfig.badge}
                            </span>

                            {/* Folder Badge if assigned */}
                            {folder && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: folder.color || '#153e4d' }}
                                />
                                <span>{folder.name}</span>
                              </span>
                            )}

                            {/* Messages count pill */}
                            <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                              {conv.messages.length} رسائل
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-slate-600">
                            <span className="text-[11px] text-slate-600 flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-slate-600" />
                              <span>{formattedDate}</span>
                            </span>

                            <button
                              type="button"
                              onClick={(e) => handleToggleStar(conv, e)}
                              className={`p-1 rounded-md transition-colors cursor-pointer ${
                                conv.starred
                                  ? 'text-amber-500 fill-amber-500'
                                  : 'text-slate-300 hover:text-amber-500'
                              }`}
                              title={conv.starred ? 'إزالة التفضيل' : 'تمييز بنجمة'}
                            >
                              <Star
                                className={`w-4 h-4 ${conv.starred ? 'fill-amber-400 text-amber-500' : ''}`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Title & Summary */}
                        <div className="py-1">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#153e4d] transition-colors leading-snug">
                            {conv.title}
                          </h4>
                          {conv.summary && (
                            <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                              {conv.summary}
                            </p>
                          )}
                        </div>

                        {/* Tags and Action buttons */}
                        <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100">
                          {/* Tags */}
                          <div className="flex flex-wrap items-center gap-1">
                            {conv.tags &&
                              conv.tags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-200/80 px-1.5 py-0.5 rounded"
                                >
                                  #{tag}
                                </span>
                              ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => handleOpenMoveModal(conv, e)}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-[#153e4d] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="نقل إلى مجلد آخر أو تغيير التصنيف"
                            >
                              <Folder className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline text-[11px]">نقل</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleDeleteConversation(conv.id, conv.title, e)}
                              className="p-1.5 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              title="حذف المحادثة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onSelectConversation(conv);
                                onClose();
                              }}
                              className="px-3 py-1.5 bg-[#153e4d] hover:bg-[#122e3a] text-[#e9cca0] text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                              title="استئناف هذه المحادثة في عوني"
                            >
                              <span>استئناف</span>
                              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create New Custom Folder */}
      {showCreateFolderModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[#c59b5f]" />
                <h4 className="text-sm font-black text-slate-900">إنشاء مجلد مخصص جديد</h4>
              </div>
              <button
                onClick={() => setShowCreateFolderModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المجلد:</label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="مثال: مشروع متجر عسل نزوى، دراسات 2026..."
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#1f5b70] rounded-xl px-3 py-2 text-xs focus:outline-hidden text-right"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">لون التمييز للمجلد:</label>
                <div className="flex items-center gap-2">
                  {['#153e4d', '#c59b5f', '#059669', '#d97706', '#4f46e5', '#e11d48'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewFolderColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        newFolderColor === c ? 'scale-115 border-slate-900 shadow-xs' : 'border-white'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateFolderModal(false)}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-2 py-2 px-3 bg-[#153e4d] hover:bg-[#122e3a] text-[#e9cca0] font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>تأكيد وإنشاء المجلد</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Save Current Active Conversation */}
      {showSaveCurrentModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#c59b5f]" />
                <h4 className="text-sm font-black text-slate-900">حفظ وتصنيف الاستشارة الحالية</h4>
              </div>
              <button
                onClick={() => setShowSaveCurrentModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-right">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  عنوان المشروع أو الموضوع:
                </label>
                <input
                  type="text"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  placeholder="أدخل عنواناً واضحاً للاستشارة..."
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#1f5b70] rounded-xl px-3 py-2 text-xs focus:outline-hidden text-right font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">التصنيف الذكي:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {AWNI_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSaveCategory(cat.id)}
                      className={`px-2.5 py-1.5 rounded-xl text-right font-bold transition-all border flex items-center gap-1.5 cursor-pointer text-[11px] ${
                        saveCategory === cat.id
                          ? 'bg-[#153e4d] text-white border-[#153e4d] shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{cat.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {customFolders.length > 0 && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    حفظ داخل مجلد مخصص (اختياري):
                  </label>
                  <select
                    value={saveFolderId}
                    onChange={(e) => setSaveFolderId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#1f5b70] rounded-xl px-3 py-2 text-xs focus:outline-hidden text-right"
                  >
                    <option value="">بدون مجلد مخصص (الأرشيف الرئيسي)</option>
                    {customFolders.map((f) => (
                      <option key={f.id} value={f.id}>
                        📁 {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tags Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">الكلمات الدلالية:</label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {saveTags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold flex items-center gap-1"
                    >
                      <span>#{t}</span>
                      <button
                        type="button"
                        onClick={() => setSaveTags(saveTags.filter((_, i) => i !== idx))}
                        className="text-amber-700 hover:text-amber-900 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && tagInput.trim()) {
                        e.preventDefault();
                        if (!saveTags.includes(tagInput.trim())) {
                          setSaveTags([...saveTags, tagInput.trim()]);
                        }
                        setTagInput('');
                      }
                    }}
                    placeholder="اكتب وسماً ثم اضغط إضافة أو Enter..."
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-right focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tagInput.trim() && !saveTags.includes(tagInput.trim())) {
                        setSaveTags([...saveTags, tagInput.trim()]);
                        setTagInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    إضافة
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSaveCurrentModal(false)}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSaveCurrent}
                  className="flex-2 py-2 px-3 bg-[#153e4d] hover:bg-[#122e3a] text-[#e9cca0] font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>تأكيد الحفظ والتصنيف</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Move & Reclassify Conversation */}
      {movingConversation && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-[#c59b5f]" />
                <h4 className="text-sm font-black text-slate-900">نقل وتعديل تصنيف المحادثة</h4>
              </div>
              <button
                onClick={() => setMovingConversation(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-right">
              <p className="text-slate-600 font-medium">
                المحادثة: <strong>{movingConversation.title}</strong>
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">اختر التصنيف:</label>
                <select
                  value={targetMoveCategory}
                  onChange={(e) => setTargetMoveCategory(e.target.value as AwniCategoryKey)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-hidden text-right"
                >
                  {AWNI_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.badge}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المجلد المخصص:</label>
                <select
                  value={targetMoveFolder}
                  onChange={(e) => setTargetMoveFolder(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-hidden text-right"
                >
                  <option value="">بدون مجلد مخصص (الأرشيف العام)</option>
                  {customFolders.map((f) => (
                    <option key={f.id} value={f.id}>
                      📁 {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMovingConversation(null)}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleConfirmMove}
                  className="flex-2 py-2 px-3 bg-[#153e4d] hover:bg-[#122e3a] text-[#e9cca0] font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>تأكيد النقل</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
