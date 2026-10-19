import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  RefreshCw,
  Copy,
  Check,
  User,
  ShieldAlert,
  ShieldCheck,
  Building,
  CreditCard,
  FileCheck2,
  TrendingUp,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ShoppingBag,
  Award,
  ThumbsUp,
  Folder,
  FolderOpen,
  FolderPlus,
  Bookmark,
  Sparkles,
  Plus,
  Tag,
  Lightbulb,
  Printer,
  Download,
} from 'lucide-react';
import { AiService, ChatMessage } from '../services/ai-service';
import { useAuth } from '../context/AuthContext';
import { AwniConversationsManager } from '../components/AwniConversationsManager';
import {
  AwniClassificationService,
  SavedAwniConversation,
  AWNI_CATEGORIES,
  AwniCategoryKey,
} from '../services/awni-classification-service';
import { OdbLoanPdfModal, FeasibilityDataInput } from '../components/OdbLoanPdfModal';

interface AiPlatformViewProps {
  onNavigate?: (view: string) => void;
}

export const AiPlatformView: React.FC<AiPlatformViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const cached = localStorage.getItem('montaji_awni_chat_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: 'msg-welcome',
        role: 'model',
        text: `يا هلا والله ومرحبا بيك في منصة "مُنتجي"! 🇴🇲✨

أنا **عوني**، كبير المستشارين الاقتصاديين والرياديين لتمكين المشاريع العمانية.
أنا هنا لأرافقك خطوة بخطوة بالخبرة العملية والأرقام الدقيقة:

1. 💼 **رواد الأعمال وتأسيس المشاريع:** شروط وإعفاءات بطاقة ريادة 2026، التمويل الميسر من بنك التنمية العماني، السجل التجاري واستثمر بسهولة، وتراخيص الأعمال المنزلية.
2. 📊 **دراسات الجدوى الاستثمارية:** تقدير رأس المال التأسيسي، وتكاليف التشغيل، ونقطة التعادل وهوامش الربح بالريال العماني (OMR).
3. 🛍️ **سوق المنتجات العمانية:** ترشيح الهدايا الوطنية الفاخرة، وسائل الدفع الحديثة، والشحن لكافة المحافظات الـ 11.

عن موه حاب نستشير أو نبدأ اليوم؟ تفضل بطرح موضوعك كتابياً أو صوتياً، أو اضغط على «تحميل استمارة بنك التنمية PDF» لإنشاء ملف التمويل المعتمد فوراً!`,
        timestamp: new Date().toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputPrompt, setInputPrompt] = useState(() => {
    try {
      return localStorage.getItem('montaji_awni_draft_input') || '';
    } catch {
      return '';
    }
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedId, setLikedId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // ODB & Riyada Loan PDF Formatter Modal
  const [showOdbModal, setShowOdbModal] = useState(false);
  const [currentFeasibilityData, setCurrentFeasibilityData] = useState<FeasibilityDataInput | undefined>();

  // Smart Classification & Archive States
  const [showArchiveManager, setShowArchiveManager] = useState(false);
  const [activeSavedConv, setActiveSavedConv] = useState<SavedAwniConversation | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Voice recording & Google Speech Recognition
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isTranscribingVoice, setIsTranscribingVoice] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [showMicPermissionModal, setShowMicPermissionModal] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [liveTranscriptPreview, setLiveTranscriptPreview] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const voiceMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Suggested prompts
  const suggestedPrompts = [
    {
      icon: ShoppingBag,
      label: 'ترشيح هدايا عمانية أصيلة',
      query: 'موه أفضل المنتجات العمانية الفاخرة اللي تنصحني أهديها في مناسبة زواج أو تذكار رسمي مع الأسعار؟',
    },
    {
      icon: FileCheck2,
      label: 'شروط بطاقة ريادة 2026',
      query: 'ما هي الشروط الدقيقة للحصول على بطاقة ريادة للأسر المنتجة ورواد الأعمال وما هي الإعفاءات المتاحة؟',
    },
    {
      icon: CreditCard,
      label: 'تمويل بنك التنمية العماني',
      query: 'كيف أقدم على تمويل ميسر بدون فوائد من بنك التنمية العماني وما هي المستندات المطلوبة؟',
    },
    {
      icon: TrendingUp,
      label: 'فرص ورؤية عمان 2040',
      query: 'ما هي أكثر المشاريع المنزلية والإنتاجية ربحية في سلطنة عمان حالياً والتي تدعمها رؤية 2040؟',
    },
  ];

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Offline Caching of conversation & input prompt
  useEffect(() => {
    try {
      localStorage.setItem('montaji_awni_chat_cache', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem('montaji_awni_draft_input', inputPrompt);
    } catch {}
  }, [inputPrompt]);

  // Check if there was an initial query passed from home page
  useEffect(() => {
    const initialQuery = sessionStorage.getItem('initial_ai_query');
    if (initialQuery) {
      sessionStorage.removeItem('initial_ai_query');
      handleSendMessage(initialQuery);
    }
  }, []);

  // Online / Offline Network Listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setErrorMsg(null);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setErrorMsg('انقطع الاتصال بالإنترنت. محادثاتك ومسوداتك محفوظة بأمان محلياً.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // فحص دعم المتصفح لميزة التعرف الصوتي (SpeechRecognition) لزر الميكروفون
  useEffect(() => {
    const micBtn = document.getElementById('voice-record-btn');
    const inputField = document.getElementById('chat-input') as HTMLInputElement | null;

    // فحص دعم المتصفح لميزة التعرف الصوتي
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition && micBtn) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-OM'; // ضبط اللغة على العربية (لهجة عمانية / فصحى)
      recognition.continuous = false;

      const handleMicClick = () => {
        try {
          recognition.start();
          micBtn.classList.add('animate-pulse', 'bg-red-600', 'text-white');
        } catch (e) {
          console.warn('Speech recognition warning:', e);
        }
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (inputField) {
          inputField.value = transcript; // وضع الكلام المنطوق داخل خانة الرسالة
        }
        setInputPrompt(transcript);
        micBtn.classList.remove('animate-pulse', 'bg-red-600', 'text-white');
      };

      recognition.onerror = () => {
        micBtn.classList.remove('animate-pulse', 'bg-red-600', 'text-white');
      };

      recognition.onend = () => {
        micBtn.classList.remove('animate-pulse', 'bg-red-600', 'text-white');
      };

      micBtn.addEventListener('click', handleMicClick);

      return () => {
        micBtn.removeEventListener('click', handleMicClick);
        try {
          recognition.stop();
        } catch {}
      };
    } else if (micBtn) {
      micBtn.style.display = 'none'; // إخفاء الزر إذا كان المتصفح لا يدعم الميزة
    }
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const promptText = (textToSend || inputPrompt).trim();
    if (!promptText || loading) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' }),
    };

    const modelMsgId = `model-${Date.now()}`;
    const initialModelMsg: ChatMessage = {
      id: modelMsgId,
      role: 'model',
      text: '',
      timestamp: new Date().toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg, initialModelMsg]);
    setInputPrompt('');
    setLiveTranscriptPreview('');
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'msg-welcome' && m.text.trim())
        .map((m) => ({ role: m.role, text: m.text }));

      await AiService.askAwniStream({
        prompt: promptText,
        history,
        onChunk: (accumulatedText) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === modelMsgId ? { ...msg, text: accumulatedText } : msg
            )
          );
        },
      });
    } catch (err: any) {
      console.error('Error in AiPlatformView:', err);
      setLastFailedPrompt(promptText);
      setMessages((prev) => prev.filter((m) => m.id !== modelMsgId || m.text.trim().length > 0));
      setErrorMsg(
        !navigator.onLine
          ? 'انقطع الاتصال بالإنترنت أثناء إرسال السؤال. تم حفظ سؤالك بأمان لتتمكن من إعادة الإرسال فور عودة الشبكة.'
          : (err?.message || 'تعذر الاتصال بالخدمة الاستشارية حالياً. تم حفظ سؤالك لإعادة المحاولة.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLike = (id: string) => {
    setLikedId(id);
    setTimeout(() => setLikedId(null), 2500);
  };

  const handleToggleSpeak = (text: string, id: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`~>-]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ar-SA';
    utterance.rate = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arVoice) utterance.voice = arVoice;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleResetChat = () => {
    if (window.confirm('هل تود بدء جلسة استشارية جديدة ومسح المحادثة الحالية؟')) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingMessageId(null);
      setMessages([
        {
          id: 'msg-welcome',
          role: 'model',
          text: 'أهلاً بك مجدداً يا غالي! تم بدء جلسة استشارية جديدة مع المستشار عوني. ما هو موضوع مشروعك أو استفسارك اليوم؟',
          timestamp: new Date().toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setErrorMsg(null);
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectSavedConversation = (conv: SavedAwniConversation) => {
    setActiveSavedConv(conv);
    setMessages(conv.messages);
    setShowArchiveManager(false);
    showToast(`تم استئناف المحادثة: "${conv.title}" 📁`);
  };

  const handleQuickSaveCurrent = async (forcedCategory?: AwniCategoryKey) => {
    if (messages.length <= 1) {
      showToast('لا توجد استشارة نشطة لحفظها حالياً.');
      return;
    }
    const classification = AwniClassificationService.classifyConversation(messages);
    const cat = forcedCategory || classification.category;
    const newConv: SavedAwniConversation = {
      id: activeSavedConv?.id || `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: user?.uid,
      title: activeSavedConv?.title || classification.title,
      folderId: activeSavedConv?.folderId,
      category: cat,
      summary: classification.summary,
      tags: classification.tags,
      messages: messages,
      starred: activeSavedConv?.starred || false,
      createdAt: activeSavedConv?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await AwniClassificationService.saveConversation(newConv, user?.uid);
    setActiveSavedConv(newConv);
    showToast(`تم حفظ وتصنيف الجلسة بنجاح في "${AWNI_CATEGORIES.find((c) => c.id === cat)?.name}"! 📁✨`);
  };

  const handleMicButtonClick = () => {
    if (isRecordingVoice) {
      stopVoiceRecording();
    } else {
      setVoiceError(null);
      setShowMicPermissionModal(true);
    }
  };

  const confirmAndStartVoiceRecording = async () => {
    setShowMicPermissionModal(false);
    setVoiceError(null);
    setLiveTranscriptPreview('');

    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      setVoiceError('التسجيل الصوتي غير مدعوم في هذا المتصفح.');
      setTimeout(() => setVoiceError(null), 5000);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = 'ar-OM';
          recognition.interimResults = true;
          recognition.continuous = true;

          recognition.onresult = (event: any) => {
            let currentTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
              currentTranscript += event.results[i][0].transcript;
            }
            if (currentTranscript.trim()) {
              setLiveTranscriptPreview(currentTranscript);
              setInputPrompt(currentTranscript);
            }
          };

          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch (e) {
          console.warn('Speech recognition warning:', e);
        }
      }

      voiceChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      voiceMediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) voiceChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }

        if (speechRecognitionRef.current) {
          try {
            speechRecognitionRef.current.stop();
          } catch {}
          speechRecognitionRef.current = null;
        }

        const audioBlob = new Blob(voiceChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());

        if (inputRef.current?.value && inputRef.current.value.trim().length > 0) {
          setIsTranscribingVoice(false);
          setRecordingDuration(0);
          inputRef.current.focus();
          return;
        }

        if (audioBlob.size === 0) {
          setRecordingDuration(0);
          return;
        }

        setIsTranscribingVoice(true);
        try {
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
          });
          reader.readAsDataURL(audioBlob);
          const base64Audio = await base64Promise;

          const text = await AiService.transcribeAudio({
            audioBase64: base64Audio,
            mimeType: 'audio/webm',
            prompt: 'قم بتفريغ هذا السؤال الصوتي إلى نص عربي دقيق للاستشارة مع عوني.',
          });

          if (text && text.trim()) {
            setInputPrompt((prev) => (prev ? `${prev} ${text.trim()}` : text.trim()));
            setTimeout(() => inputRef.current?.focus(), 100);
          }
        } catch (err) {
          console.warn('Voice transcription error:', err);
        } finally {
          setIsTranscribingVoice(false);
          setRecordingDuration(0);
        }
      };

      mediaRecorder.start(250);
      setIsRecordingVoice(true);
      setRecordingDuration(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Mic error:', err);
      setIsRecordingVoice(false);
      setRecordingDuration(0);
      setVoiceError('تم رفض إذن المايكروفون في المتصفح. يمكنك السماح به بالنقر على رمز القفل 🔒 بجانب العنوان في المتصفح.');
      setTimeout(() => setVoiceError(null), 6000);
    }
  };

  const stopVoiceRecording = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {}
      speechRecognitionRef.current = null;
    }
    if (voiceMediaRecorderRef.current && isRecordingVoice) {
      voiceMediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const cancelVoiceRecording = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {}
      speechRecognitionRef.current = null;
    }
    if (voiceMediaRecorderRef.current && isRecordingVoice) {
      try {
        voiceMediaRecorderRef.current.stream?.getTracks().forEach((track) => track.stop());
      } catch {}
      voiceMediaRecorderRef.current = null;
    }
    voiceChunksRef.current = [];
    setIsRecordingVoice(false);
    setLiveTranscriptPreview('');
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setRecordingDuration(0);
  };

  const renderInteractiveChips = (text: string) => {
    const hasMarketplace = text.includes('سوق') || text.includes('منتجات') || text.includes('لبان') || text.includes('عسل') || text.includes('شراء') || text.includes('حلوى') || text.includes('خنجر');
    const hasFeasibility = text.includes('دراسة') || text.includes('جدوى') || text.includes('تكاليف') || text.includes('رأس مال') || text.includes('أرباح');
    const hasCourses = text.includes('دورة') || text.includes('ورش') || text.includes('تدريب');
    const hasIdeas = text.includes('فكرة') || text.includes('مشروع') || text.includes('ابتكار');
    const hasRiyada = text.includes('ريادة') || text.includes('سجل') || text.includes('ترخيص');

    return (
      <div className="pt-2.5 mt-2 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
        {/* Smart Save to Folder Shortcuts */}
        {hasFeasibility && (
          <button
            onClick={() => handleQuickSaveCurrent('feasibility')}
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="حفظ سريع في مجلد دراسات الجدوى"
          >
            <Folder className="w-3.5 h-3.5 text-amber-600" />
            <span>حفظ في دراسات الجدوى 📊</span>
          </button>
        )}
        {hasIdeas && (
          <button
            onClick={() => handleQuickSaveCurrent('ideas')}
            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/80 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="حفظ سريع في أفكار المشاريع"
          >
            <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
            <span>حفظ في أفكار المشاريع 💡</span>
          </button>
        )}
        {hasRiyada && (
          <button
            onClick={() => handleQuickSaveCurrent('riyada')}
            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="حفظ سريع في ملفات التأسيس والريادة"
          >
            <Building className="w-3.5 h-3.5 text-emerald-600" />
            <span>حفظ في ملفات التأسيس 💼</span>
          </button>
        )}

        {hasFeasibility && (
          <>
            <button
              onClick={() => onNavigate?.('ai-business-idea.html')}
              className="px-2.5 py-1 bg-[#153e4d]/10 hover:bg-[#153e4d]/20 text-[#153e4d] font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#c59b5f]" />
              <span>فتح دراسة الجدوى الاستثمارية 📊</span>
            </button>
            <button
              onClick={() => {
                setCurrentFeasibilityData({
                  summaryNotes: text.substring(0, 300),
                });
                setShowOdbModal(true);
              }}
              className="px-3 py-1 bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] border border-[#c59b5f]/50 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="توليد استمارة بنك التنمية وهيئة ريادة الرسمية PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#c59b5f]" />
              <span>تحميل استمارة بنك التنمية PDF 📄</span>
            </button>
          </>
        )}
        {hasMarketplace && (
          <button
            onClick={() => onNavigate?.('marketplace.html')}
            className="px-2.5 py-1 bg-[#c59b5f]/15 hover:bg-[#c59b5f]/25 text-[#735323] font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#c59b5f]" />
            <span>تصفح سوق المنتجات الوطنية 🛍️</span>
          </button>
        )}
        {hasCourses && (
          <button
            onClick={() => onNavigate?.('training-courses.html')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-[#1f5b70]" />
            <span>عرض الدورات التدريبية 🎓</span>
          </button>
        )}
      </div>
    );
  };

  // Helper to render formatted markdown, tables, and financial metric cards
  const renderAwniFormattedContent = (text: string) => {
    const lines = text.split('\n');
    const blocks: { type: 'text' | 'table'; content: string | string[] }[] = [];
    let currentTableLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('|') && line.includes('|')) {
        currentTableLines.push(line);
      } else {
        if (currentTableLines.length > 0) {
          blocks.push({ type: 'table', content: currentTableLines });
          currentTableLines = [];
        }
        blocks.push({ type: 'text', content: line });
      }
    }
    if (currentTableLines.length > 0) {
      blocks.push({ type: 'table', content: currentTableLines });
    }

    const hasFeasibilityMetrics =
      text.includes('رأس المال') ||
      text.includes('نقطة التعادل') ||
      text.includes('تكاليف التشغيل') ||
      text.includes('التكلفة الرأسمالية');

    return (
      <div className="space-y-3 leading-relaxed text-xs sm:text-sm">
        {blocks.map((b, idx) => {
          if (b.type === 'table') {
            const tableLines = (b.content as string[]).filter((l) => l.trim().startsWith('|'));
            if (tableLines.length >= 2) {
              const headers = tableLines[0]
                .split('|')
                .map((c) => c.trim())
                .filter(Boolean);
              const dataRows = tableLines.slice(2).map((row) =>
                row
                  .split('|')
                  .map((c) => c.trim())
                  .filter((_, i, arr) => (i > 0 && i < arr.length - 1) || arr.length <= 2)
              );

              return (
                <div key={idx} className="my-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-bold px-1">
                    <span className="flex items-center gap-1 text-[#153e4d] dark:text-[#dfba83]">
                      <TrendingUp className="w-3.5 h-3.5 text-[#c59b5f]" />
                      <span>جدول التكاليف والجدوى الاستثمارية بالريال العماني</span>
                    </span>
                    <span className="text-[10px] text-slate-400 sm:hidden">← اسحب أفقياً لتصفح الجدول →</span>
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs bg-white dark:bg-[#0b1922]">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-[#153e4d] dark:bg-[#07131a] text-[#dfba83] border-b border-[#c59b5f]/40">
                        <tr>
                          {headers.map((h, hIdx) => (
                            <th key={hIdx} className="px-3.5 py-2.5 font-black whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {dataRows.map((r, rIdx) => (
                          <tr
                            key={rIdx}
                            className={`${
                              rIdx % 2 === 0 ? 'bg-white dark:bg-[#0d232d]' : 'bg-slate-50/70 dark:bg-[#091a22]'
                            } hover:bg-amber-50/40 dark:hover:bg-slate-800 transition-colors`}
                          >
                            {r.map((cell, cIdx) => (
                              <td key={cIdx} className="px-3.5 py-2 text-slate-800 dark:text-slate-200 font-medium">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            }
          }

          const lineStr = b.content as string;
          if (!lineStr.trim()) return <div key={idx} className="h-1.5" />;

          // Bold parsing
          const formatted = lineStr.split(/(\*\*.*?\*\*)/g).map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-black text-[#153e4d] dark:text-[#dfba83]">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          return (
            <div key={idx} className="text-slate-800 dark:text-slate-100 font-normal">
              {formatted}
            </div>
          );
        })}

        {/* Financial Snapshot Card if Feasibility detected */}
        {hasFeasibilityMetrics && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-amber-50/50 dark:from-[#0d232d] dark:via-[#122e3a] dark:to-[#0d232d] border border-amber-200/80 dark:border-amber-700/60 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#153e4d] text-[#dfba83] flex items-center justify-center font-bold">
                  🇴🇲
                </div>
                <div>
                  <h5 className="font-black text-xs text-[#153e4d] dark:text-white">
                    بطاقة المؤشرات المالية والتمويل المعتمد (ملخص سريع)
                  </h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    متوافق مع نماذج بنك التنمية العماني وبطاقة ريادة 2026
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-[#008450]/15 text-[#008450] dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                مؤشرات معتمدة ✓
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">تمويل بنك التنمية</span>
                <strong className="text-xs sm:text-sm font-black text-[#008450] dark:text-emerald-400 font-mono">قرض ميسر (85%)</strong>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">فترة السماح</span>
                <strong className="text-xs sm:text-sm font-black text-[#153e4d] dark:text-[#dfba83]">6 أشهر مدعومة</strong>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">سداد الأقساط</span>
                <strong className="text-xs sm:text-sm font-black text-slate-800 dark:text-white font-mono">حتى 5 سنوات</strong>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">إعفاءات ريادة</span>
                <strong className="text-xs sm:text-sm font-black text-[#c59b5f]">100% ضريبية</strong>
              </div>
            </div>

            {/* Quick PDF Action */}
            <div className="pt-1 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-600 dark:text-slate-300 hidden sm:inline">
                تصدير هذه الدراسة كملف رسمي مطابق لنماذج التمويل:
              </span>
              <button
                type="button"
                onClick={() => {
                  setCurrentFeasibilityData({
                    summaryNotes: text.substring(0, 300),
                  });
                  setShowOdbModal(true);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#008450] to-[#153e4d] hover:opacity-95 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-400/40"
              >
                <Printer className="w-3.5 h-3.5 text-[#dfba83]" />
                <span>تحميل استمارة بنك التنمية PDF 📄</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Offline Status Warning Banner */}
      {!isOnline && (
        <div className="mb-4 p-3.5 bg-amber-500/15 border border-amber-500 text-amber-900 dark:text-amber-200 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span>أنت تتصفح في وضع عدم الاتصال (أوفلاين) - محادثاتك ومسوداتك محفوظة بالكامل في جهازك.</span>
          </div>
          <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded-full">
            حفظ محلي آمن ✓
          </span>
        </div>
      )}

      {/* Saved Prompt Recovery Banner if previous request failed */}
      {lastFailedPrompt && (
        <div className="mb-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 rounded-2xl text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <div>
              <span className="font-bold">استفسارك محفوظ بأمان: </span>
              <span className="text-slate-600 dark:text-slate-300 line-clamp-1">"{lastFailedPrompt}"</span>
            </div>
          </div>
          <button
            onClick={() => handleSendMessage(lastFailedPrompt)}
            className="px-3.5 py-1.5 bg-[#153e4d] text-[#dfba83] hover:bg-[#122e3a] font-bold rounded-xl text-xs shrink-0 cursor-pointer shadow-xs"
          >
            إعادة الإرسال الآن 🔄
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-60 bg-[#122e3a] text-[#e9cca0] border border-[#c59b5f] px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Microphone Permission Modal */}
      {showMicPermissionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="w-14 h-14 bg-gradient-to-br from-[#153e4d] to-[#1f5b70] text-[#e9cca0] rounded-2xl flex items-center justify-center mx-auto shadow-md border border-[#c59b5f]/40 relative">
              <Mic className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#153e4d]/10 text-[#153e4d] mb-1">
                <span>التعرف الصوتي الذكي من Google</span>
              </div>
              <h4 className="text-base font-black text-slate-900">
                السماح بالوصول إلى الميكروفون
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                يطلب المستشار <strong>"عوني"</strong> الإذن باستخدام الميكروفون للاستماع إلى سؤالك وتحويله مباشرة إلى نص للاستشارة.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-[11px] text-amber-900 leading-normal text-right space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>خطوة التأكيد في المتصفح:</span>
              </div>
              <p className="text-amber-800">
                عند النقر على "السماح والبدء"، سيظهر لك إشعار المتصفح (Google Chrome). يُرجى اختيار <strong>Allow / سماح</strong> للبدء فوراً.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowMicPermissionModal(false)}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmAndStartVoiceRecording}
                className="flex-2 py-2.5 px-4 bg-[#153e4d] hover:bg-[#122e3a] text-[#e9cca0] text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>السماح وبدء التحدث</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner - Executive Sovereign Design */}
      <div className="bg-gradient-to-r from-[#122e3a] via-[#153e4d] to-[#1f5b70] rounded-3xl p-6 sm:p-8 text-white mb-6 border border-[#c59b5f]/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#c59b5f] via-[#e9cca0] to-[#dfba83] p-0.5 shadow-lg">
              <div className="w-full h-full bg-[#122e3a] rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-[#e9cca0]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">المستشار الوطني "عوني"</h1>
                <span className="text-[10px] bg-[#c59b5f]/25 text-[#f5e3c7] border border-[#c59b5f]/50 px-2.5 py-0.5 rounded-full font-bold">
                  مستشار ريادي معتمد 🇴🇲
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  متصل مباشرة
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                المنظومة الاستشارية الرسمية لتمكين رواد الأعمال • دراسات جدوى وأفكار مشاريع وتصنيف ذكي للملفات
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* ODB & Riyada PDF Formatter Button */}
            <button
              onClick={() => {
                setCurrentFeasibilityData(undefined);
                setShowOdbModal(true);
              }}
              className="px-3.5 py-2 bg-gradient-to-r from-[#008450] to-[#153e4d] hover:opacity-90 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-400/40"
              title="توليد استمارة قرض بنك التنمية وهيئة ريادة PDF"
            >
              <Printer className="w-4 h-4 text-[#dfba83]" />
              <span>تحميل استمارة بنك التنمية PDF</span>
            </button>

            {/* Archive and Folders Manager Button */}
            <button
              onClick={() => setShowArchiveManager(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#c59b5f] to-[#e9cca0] hover:from-[#dfba83] hover:to-[#f5e3c7] text-[#122e3a] rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              title="فتح أرشيف ومجلدات المحادثات ودراسات الجدوى"
            >
              <FolderOpen className="w-4 h-4 text-[#122e3a]" />
              <span>الأرشيف والمجلدات</span>
            </button>

            {/* Quick Save and Classify active conversation */}
            {messages.length > 1 && (
              <button
                onClick={() => handleQuickSaveCurrent()}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-[#e9cca0] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/20 cursor-pointer"
                title="حفظ وتصنيف الاستشارة الحالية"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">حفظ وتصنيف</span>
              </button>
            )}

            <button
              onClick={handleResetChat}
              className="px-3.5 py-2 bg-[#122e3a] hover:bg-slate-800 text-[#dfba83] hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-[#c59b5f]/30 cursor-pointer"
              title="جلسة جديدة"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>جلسة جديدة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Saved Conversation indicator */}
      {activeSavedConv && (
        <div className="mb-4 p-3 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-amber-700 shrink-0" />
            <span>ملف محفوظ مستأنف: <strong>{activeSavedConv.title}</strong></span>
            <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
              {AWNI_CATEGORIES.find((c) => c.id === activeSavedConv.category)?.badge}
            </span>
          </div>
          <button
            onClick={() => {
              setActiveSavedConv(null);
              showToast('تم الرجوع للوضع العام المفتوح.');
            }}
            className="text-amber-800 hover:text-amber-950 font-bold text-[11px] underline cursor-pointer"
          >
            بدء موضوع جديد
          </button>
        </div>
      )}

      {/* Preset Pill suggestions */}
      <div className="mb-6 space-y-2">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
          محاور استشارية مقترحة مع عوني:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {suggestedPrompts.map((p, idx) => {
            const Icon = p.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                disabled={loading}
                className="text-right p-3 bg-white dark:bg-[#0d232d] hover:bg-[#153e4d]/5 dark:hover:bg-[#153e4d]/40 border border-slate-200 dark:border-slate-800 hover:border-[#1f5b70] rounded-xl transition-all shadow-2xs group cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white group-hover:text-[#153e4d] dark:group-hover:text-[#dfba83]">
                  <Icon className="w-4 h-4 text-[#c59b5f] shrink-0" />
                  <span>{p.label}</span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-400 line-clamp-1 mt-1 font-normal">
                  {p.query}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white dark:bg-[#07131a] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md overflow-hidden flex flex-col min-h-[500px] max-h-[680px] transition-colors">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => {
            const isSpeakingThis = speakingMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-[#153e4d] text-white'
                      : 'bg-gradient-to-tr from-[#1f5b70] to-[#153e4d] text-[#e9cca0] border border-[#c59b5f]/40'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-[#e9cca0]" />
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-4 sm:p-5 text-sm leading-relaxed space-y-2 relative group ${
                    msg.role === 'user'
                      ? 'bg-[#153e4d] text-white rounded-tr-xs'
                      : 'bg-slate-50 dark:bg-[#0d232d] text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-tl-xs shadow-xs'
                  }`}
                >
                  {/* Formatted Model Body or Clean User Text */}
                  {msg.role === 'model' ? (
                    renderAwniFormattedContent(msg.text)
                  ) : (
                    <div className="whitespace-pre-wrap font-normal text-white space-y-2 leading-relaxed text-xs sm:text-sm">
                      {msg.text}
                    </div>
                  )}

                  {/* Interactive Contextual Actions */}
                  {msg.role === 'model' && msg.text && renderInteractiveChips(msg.text)}

                  {/* Footer details */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>
                      {isSpeakingThis && (
                        <span className="text-[#c59b5f] font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c59b5f] animate-ping" />
                          <span>عوني يقرأ الاستشارة صوتياً...</span>
                        </span>
                      )}
                    </div>

                    {msg.role === 'model' && msg.text && (
                      <div className="flex items-center gap-2">
                        {/* Audio voice readout */}
                        <button
                          onClick={() => handleToggleSpeak(msg.text, msg.id)}
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            isSpeakingThis
                              ? 'bg-amber-100 text-amber-800'
                              : 'hover:bg-slate-200 text-slate-500'
                          }`}
                          title={isSpeakingThis ? 'إيقاف الصوت' : 'استمع للاستشارة بصوت عوني'}
                        >
                          {isSpeakingThis ? (
                            <VolumeX className="w-4 h-4 text-amber-700" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>

                        {/* Like button */}
                        <button
                          onClick={() => handleLike(msg.id)}
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            likedId === msg.id
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'hover:bg-slate-200 text-slate-500'
                          }`}
                          title="إجابة مفيدة"
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>

                        {/* Copy button */}
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="flex items-center gap-1 hover:text-slate-700 cursor-pointer transition-colors p-1"
                          title="نسخ الإجابة"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-600" />
                              <span className="text-emerald-600 font-bold">تم النسخ</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>نسخ</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Thinking / Loading State */}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#153e4d] text-[#e9cca0] flex items-center justify-center shrink-0 shadow-xs animate-pulse border border-[#c59b5f]/40">
                <ShieldCheck className="w-5 h-5 text-[#e9cca0]" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-xs p-4 text-xs text-slate-600 flex items-center gap-3">
                <div className="flex space-x-1 space-x-reverse">
                  <div className="w-2 h-2 bg-[#1f5b70] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#1f5b70] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-[#c59b5f] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span>المستشار "عوني" يصيغ لك الإجابة الاقتصادية المعتمدة...</span>
              </div>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={() => handleSendMessage()}
                className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700"
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Voice Recording & Google Speech Integration */}
        <div className="p-4 bg-slate-50 dark:bg-[#0d232d] border-t border-slate-200 dark:border-slate-800 transition-colors">
          {/* Active Voice Recording Indicator & Waveform */}
          {isRecordingVoice && (
            <div className="mb-3 p-3 bg-gradient-to-r from-emerald-50 via-amber-50 to-emerald-50 dark:from-emerald-950/40 dark:via-amber-950/30 dark:to-emerald-950/40 border border-emerald-300 dark:border-emerald-700 rounded-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                </span>
                <div className="text-xs font-black text-[#153e4d] dark:text-[#dfba83] flex items-center gap-1.5">
                  <span>عوني يستمع لصوتك عبر Google:</span>
                  <span className="font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-bold">
                    {formatRecordingTime(recordingDuration)}
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-0.5 h-4">
                  {[40, 80, 60, 100, 75, 45, 90, 60, 30].map((h, i) => (
                    <span
                      key={i}
                      className="w-0.5 bg-emerald-600 rounded-full animate-pulse"
                      style={{
                        height: `${Math.max(25, (h * ((recordingDuration % 3) + 1)) / 3)}%`,
                        animationDelay: `${i * 120}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={cancelVoiceRecording}
                  className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={stopVoiceRecording}
                  className="px-3.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>إنهاء وتأكيد</span>
                </button>
              </div>
            </div>
          )}

          {/* Live voice transcript preview pill */}
          {liveTranscriptPreview && isRecordingVoice && (
            <div className="mb-2 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold shrink-0">
                كلامك المباشر:
              </span>
              <span className="line-clamp-1 font-medium">{liveTranscriptPreview}</span>
            </div>
          )}

          {voiceError && (
            <div className="mb-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 text-center font-medium leading-relaxed">
              {voiceError}
            </div>
          )}

          {isTranscribingVoice && (
            <div className="mb-2 p-2 bg-[#153e4d]/10 dark:bg-[#153e4d]/30 border border-[#1f5b70]/20 dark:border-[#1f5b70]/50 rounded-xl text-xs text-[#153e4d] dark:text-[#dfba83] flex items-center justify-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#c59b5f] animate-ping" />
              <span>جاري تحويل صوتك إلى نص استشاري...</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* خانة الكتابة الأساسية (chat-input) */}
            <input
              id="chat-input"
              ref={inputRef}
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={isRecordingVoice ? 'عوني يستمع لصوتك الآن...' : 'اكتب استفسارك للمستشار عوني، بلهجتك الطبيعية أو بالفصحى...'}
              disabled={loading}
              className="flex-1 bg-white dark:bg-[#07131a] border border-slate-300 dark:border-slate-700 dark:text-white rounded-2xl px-5 py-3.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1f5b70] focus:border-[#1f5b70] disabled:bg-slate-100 disabled:opacity-60 text-right dark:placeholder-slate-400 transition-colors"
            />

            {/* زر الميكروفون للتسجيل الصوتي المباشر */}
            <button
              id="voice-record-btn"
              type="button"
              className="p-2.5 rounded-xl bg-[#153e4d] text-[#dfba83] hover:bg-[#1f5b70] dark:bg-[#153e4d] dark:text-[#dfba83] dark:hover:bg-[#1f5b70] transition-colors border border-[#c59b5f]/40 shrink-0 cursor-pointer shadow-xs"
              title="تحدث مع عوني صوتياً"
            >
              <svg id="mic-icon" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 02-3-3V5a3 3 0 116 0v6a3 3 0 02-3 3z" />
              </svg>
            </button>

            <button
              type="submit"
              disabled={!inputPrompt.trim() || loading}
              className="p-3.5 bg-gradient-to-r from-[#153e4d] to-[#1f5b70] hover:from-[#122e3a] hover:to-[#153e4d] text-[#e9cca0] rounded-2xl transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shrink-0 border border-[#c59b5f]/30"
              title="إرسال"
            >
              <Send className="w-5 h-5 rotate-180" />
            </button>
          </form>

          <div className="mt-2 text-center">
            <span className="text-[11px] text-slate-400 dark:text-slate-400">
              المستشار "عوني" المنظومة الوطنية المعتمدة لرواد الأعمال والمشاريع العُمانية في سلطنة عُمان.
            </span>
          </div>
        </div>
      </div>

      {/* Awni Conversations & Folders Manager Modal */}
      <AwniConversationsManager
        isOpen={showArchiveManager}
        onClose={() => setShowArchiveManager(false)}
        currentMessages={messages}
        onSelectConversation={handleSelectSavedConversation}
        userId={user?.uid}
        onSaveCurrentSuccess={() => {
          showToast('تم تحديث المحفوظات بنجاح!');
        }}
      />

      {/* Official ODB & Riyada PDF Formatter Modal */}
      <OdbLoanPdfModal
        isOpen={showOdbModal}
        onClose={() => setShowOdbModal(false)}
        initialData={currentFeasibilityData}
      />
    </div>
  );
};
