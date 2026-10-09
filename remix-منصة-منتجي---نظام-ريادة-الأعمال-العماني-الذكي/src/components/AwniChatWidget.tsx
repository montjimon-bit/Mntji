import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  X,
  RefreshCw,
  Copy,
  Check,
  User,
  ShoppingBag,
  ExternalLink,
  Minimize2,
  Maximize2,
  ShieldCheck,
  Square,
  Building,
  CreditCard,
  Briefcase,
  HelpCircle,
  FileCheck2,
  TrendingUp,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Phone,
  MessageCircle,
  Award,
  ThumbsUp,
  Type,
  Plus,
  Minus,
  RotateCcw,
  Zap,
  Folder,
  FolderOpen,
  Bookmark,
  Lightbulb,
} from 'lucide-react';
import { AiService, ChatMessage } from '../services/ai-service';
import { useAuth } from '../context/AuthContext';
import { AwniConversationsManager } from './AwniConversationsManager';
import {
  AwniClassificationService,
  SavedAwniConversation,
  AwniCategoryKey,
  AWNI_CATEGORIES,
} from '../services/awni-classification-service';

interface AwniChatWidgetProps {
  onNavigate?: (view: string) => void;
}

// Typography configuration options for chat bubbles
export type ChatFontSize = 'sm' | 'base' | 'lg' | 'xl';
export type ChatFontFamily = 'cairo' | 'tajawal' | 'amiri' | 'almarai';
export type ChatWindowSize = 'standard' | 'wide' | 'fullscreen';

interface FontFamilyOption {
  id: ChatFontFamily;
  name: string;
  fontFamilyCSS: string;
  sample: string;
  badge: string;
}

interface FontSizeOption {
  id: ChatFontSize;
  label: string;
  cssClass: string;
  sizePx: string;
}

const FONT_FAMILIES: FontFamilyOption[] = [
  {
    id: 'cairo',
    name: 'القاهرة (Cairo)',
    fontFamilyCSS: "'Cairo', sans-serif",
    sample: 'أهلاً بك في منصة مُنتجي',
    badge: 'الافتراضي',
  },
  {
    id: 'tajawal',
    name: 'تجوال (Tajawal)',
    fontFamilyCSS: "'Tajawal', sans-serif",
    sample: 'أهلاً بك في منصة مُنتجي',
    badge: 'سلس ومريح',
  },
  {
    id: 'amiri',
    name: 'الأميري (Amiri)',
    fontFamilyCSS: "'Amiri', serif",
    sample: 'أهلاً بك في منصة مُنتجي',
    badge: 'نسخ أصيل',
  },
  {
    id: 'almarai',
    name: 'المراعي (Almarai)',
    fontFamilyCSS: "'Almarai', sans-serif",
    sample: 'أهلاً بك في منصة مُنتجي',
    badge: 'هندسي معاصر',
  },
];

const FONT_SIZES: FontSizeOption[] = [
  { id: 'sm', label: 'صغير', cssClass: 'text-[13px] leading-relaxed', sizePx: '13px' },
  { id: 'base', label: 'قياسي', cssClass: 'text-[15px] leading-relaxed', sizePx: '15px' },
  { id: 'lg', label: 'كبير', cssClass: 'text-[17px] leading-relaxed', sizePx: '17px' },
  { id: 'xl', label: 'كبير جداً', cssClass: 'text-[19px] leading-loose', sizePx: '19px' },
];

// Dedicated Omani Entrepreneurship & Marketplace Expert System Prompt
const AWNI_ENTREPRENEURIAL_SYSTEM_INSTRUCTION = `أنت "عوني" (Awni)، كبير المستشارين الاقتصاديين والرياديين والخبراء الوطنيين في سلطنة عُمان لمنصة "مُنتجي" (Montaji).
أنت مستشار استراتيجي رفيع المستوى يتمتع بخبرة استشارية وتجارية عميقة، ورزانة، وذكاء استراتيجي، وفهم دقيق لمنظومة الأعمال العمانية ورؤية عُمان 2040:

دورك ومجالات خبرتك:
1. بيئة ريادة الأعمال والاستثمار في سلطنة عُمان:
   - ملم بمتطلبات هيئة تنمية المؤسسات الصغيرة والمتوسطة (ريادة): شروط بطاقة ريادة 2026، متطلبات التفرغ، الإعفاءات الجمركية والضريبية، وتخصيص نسبة 10% من مشتريات ومناقصات الأجهزة الحكومية لحاملي البطاقة.
   - منصة عُمان للأعمال (استثمر بسهولة) التابعة لوزارة التجارة والصناعة وترويج الاستثمار: إصدار السجل التجاري، التراخيص التلقائية، وترخيص الأعمال المنزلية للأسر المنتجة.
   - برامج التمويل الحكومية الميسرة: بنك التنمية العماني (قروض ميسرة بدون فوائد أو مدعومة)، وصناديق رأس المال الجريء، ومبادرات الدعم الوطني.
   - دراسات الجدوى الاقتصادية الدقيقة: تقدير رأس المال التأسيسي، وتكاليف التشغيل، ونقطة التعادل وهوامش الربح بالريال العماني (OMR)، وتحليل الفرص والمخاطر.

2. سوق المنتجات العمانية والأسر المنتجة على منصة مُنتجي:
   - اللبان الحوجري الظفاري الملكي النقي من جبال سمحان (18.5 ر.ع).
   - عسل السدر والسمر العماني الجبلي من الجبل الأخضر (32.0 ر.ع).
   - الحلوى العمانية السلطانية بالسمن البقري والزعفران والمكسرات من بركاء (9.5 ر.ع).
   - الخنجر العماني النزوي الأصلي بصياغة فضية يدوية وتطريز متقن (195.0 ر.ع).
   - دهن العود السلطاني الكمبودي المعتق الفاخر (45.0 ر.ع).
   - طقم الخزف والفخار التراثي البهلاوي (24.0 ر.ع).
   - الزعفران النقيل الفاخر (12.5 ر.ع).
   - العبايات والشيلات العمانية بالتطريز التراثي الأنيق (38.0 ر.ع).

3. الشراء وطرق الدفع والتوصيل:
   - وسائل دفع سريعة: Apple Pay و Google Pay و Samsung Pay والبطاقات البنكية العمانية بالريال العماني (OMR) ومحفظة ثواني.
   - التوصيل يغطي جميع ولايات ومحافظات سلطنة عُمان الـ 11 خلال 24 إلى 48 ساعة بتغليف احترافي وآمن.

4. لهجة وأسلوب المحادثة:
   - تتحدث بروح الترحيب العماني الأصيل ("يا هلا والله ومرحبا بيك ونورتنا في منتجي"، "أبشر ومن عيوني يا غالي"، "حياك الله وتسلم"، "شورك وهداية الله").
   - تفهم المصطلحات واللهجة العمانية الدارجة بسلاسة تامة مع إتقان الفصحى الراقية.
   - نسق الردود بنقاط وأرقام واضحة وجذابة تلهم العميل وتوجهه للخطوة التالية.`;

export const AwniChatWidget: React.FC<AwniChatWidgetProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [unreadBadge, setUnreadBadge] = useState(true);

  // Chatbot Window Dimensions & Measurements (Standard 480px, Wide 720px, Fullscreen 92vh)
  const [windowSize, setWindowSize] = useState<ChatWindowSize>(() => {
    try {
      const saved = localStorage.getItem('montaji_awni_window_size');
      if (saved && ['standard', 'wide', 'fullscreen'].includes(saved)) return saved as ChatWindowSize;
    } catch {}
    return 'standard';
  });

  const changeWindowSize = (size: ChatWindowSize) => {
    setWindowSize(size);
    setIsExpanded(size === 'fullscreen');
    try {
      localStorage.setItem('montaji_awni_window_size', size);
    } catch {}
  };

  const initialWelcomeText = `يا هلا والله ومسهلا بك في منصة **"مُنتجي"**! 🇴🇲✨

أنا **"عوني"**، مستشارك الاقتصادي والريادي المباشر.
يسعدني مرافقتك والإجابة على كافة استفسارات مشاريعك وتسوّقك الوطني:
- 💼 **تأسيس وتمويل المشاريع:** شروط بطاقة ريادة، قروض بنك التنمية العماني الميسرة (بدون فوائد)، السجل التجاري واستثمر بسهولة، ونمذجة دراسات الجدوى بالريال العماني.
- 🛍️ **سوق المنتجات الوطنية:** هدايا وتذكارات فاخرة (لبان حوجري، عسل الجبل الأخضر، حلوى بركاء، فضيات وخناجر نزوى).
- 💳 **الدفع والشحن المعتمد:** Apple Pay و Google Pay والدفع الإلكتروني، وتوصيل سريع لكافة المحافظات.

تفضل بطرح موضوعك أو سؤالك كتابياً أو بالتحدث صوتياً، وأبشر بما يسرك!`;

  // Session conversation history
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-awni',
      role: 'model',
      text: initialWelcomeText,
      timestamp: new Date().toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedId, setLikedId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Chat Typography preferences (Font Size and Font Family) for chat bubbles
  const [fontSize, setFontSize] = useState<ChatFontSize>(() => {
    try {
      const saved = localStorage.getItem('montaji_awni_font_size');
      if (saved && ['sm', 'base', 'lg', 'xl'].includes(saved)) return saved as ChatFontSize;
    } catch {}
    return 'base';
  });

  const [fontFamily, setFontFamily] = useState<ChatFontFamily>(() => {
    try {
      const saved = localStorage.getItem('montaji_awni_font_family');
      if (saved && ['cairo', 'tajawal', 'amiri', 'almarai'].includes(saved)) return saved as ChatFontFamily;
    } catch {}
    return 'cairo';
  });

  const [showFontSettings, setShowFontSettings] = useState(false);

  const changeFontSize = (size: ChatFontSize) => {
    setFontSize(size);
    try {
      localStorage.setItem('montaji_awni_font_size', size);
    } catch {}
  };

  const changeFontFamily = (family: ChatFontFamily) => {
    setFontFamily(family);
    try {
      localStorage.setItem('montaji_awni_font_family', family);
    } catch {}
  };

  // Smart Classification & Archive Manager States
  const { user } = useAuth();
  const [showArchiveManager, setShowArchiveManager] = useState(false);
  const [activeSavedConv, setActiveSavedConv] = useState<SavedAwniConversation | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectSavedConv = (conv: SavedAwniConversation) => {
    setMessages(conv.messages);
    setActiveSavedConv(conv);
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
      id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: user?.uid,
      title: classification.title,
      category: cat,
      summary: classification.summary,
      tags: classification.tags,
      messages: messages,
      starred: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await AwniClassificationService.saveConversation(newConv, user?.uid);
    setActiveSavedConv(newConv);
    showToast(`تم حفظ وتصنيف الجلسة في "${AWNI_CATEGORIES.find((c) => c.id === cat)?.name}"! 📁✨`);
  };

  // Voice recording & Google Speech Recognition states
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isTranscribingVoice, setIsTranscribingVoice] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [showMicPermissionModal, setShowMicPermissionModal] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [liveTranscriptPreview, setLiveTranscriptPreview] = useState<string>('');

  const abortControllerRef = useRef<AbortController | null>(null);
  const voiceMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick suggestions tailored for entrepreneurship and marketplace
  const quickSuggestions = [
    {
      label: '📋 شروط بطاقة ريادة 2026',
      query: 'ما هي الشروط الدقيقة والتفرغ المطلوب للحصول على بطاقة ريادة والإعفاءات المتاحة لمشروعي؟',
    },
    {
      label: '💰 تمويل بنك التنمية العماني',
      query: 'كيف أقدم على تمويل ميسر للمشاريع الصغيرة من بنك التنمية العماني وما هي التسهيلات المتاحة؟',
    },
    {
      label: '📊 دراسة جدوى استثمارية لمشروعي',
      query: 'كيف أعد دراسة جدوى استثمارية لمشروعي لحساب رأس المال وتكاليف التشغيل وهوامش الربح بالريال العماني؟',
    },
    {
      label: '🎁 اقتراح هدايا عمانية فاخرة',
      query: 'اقترح لي بكج هدايا عمانية راقية للإهداء الرسمي أو المناسبات الخاصة مع الأسعار بالريال العماني.',
    },
    {
      label: '🇴🇲 كيف أعرض منتجاتي في المنصة؟',
      query: 'عندي منتجات وطنية، كيف أعرض منتجاتي على منصة منتجي وأستفيد من دعم المنصة وتسويق المنتجات؟',
    },
    {
      label: '💳 وسائل الدفع والشحن',
      query: 'ما هي طرق الدفع المتاحة على المنصة (Apple Pay وغيرها) وكم مدة التوصيل لولايتي؟',
    },
  ];

  // Auto-scroll on new message or during streaming chunks
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming, isOpen]);

  // Focus input when widget opens
  useEffect(() => {
    if (isOpen) {
      setUnreadBadge(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Cleanup speech synthesis and timers on unmount
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

  // Handle sending a message with real-time SSE streaming & session history
  const handleSendMessage = async (textToSend?: string) => {
    const promptText = (textToSend || inputPrompt).trim();
    if (!promptText || isStreaming) return;

    // Create User Message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' }),
    };

    // Placeholder Model Message for Streaming
    const modelMsgId = `model-${Date.now()}`;
    const initialModelMsg: ChatMessage = {
      id: modelMsgId,
      role: 'model',
      text: '',
      timestamp: new Date().toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' }),
    };

    // Update state with user message and streaming placeholder
    setMessages((prev) => [...prev, userMsg, initialModelMsg]);
    setInputPrompt('');
    setLiveTranscriptPreview('');
    setIsStreaming(true);

    // Setup abort controller for user cancellation
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Build conversation history for multi-turn session understanding
      const history = messages
        .filter((m) => m.id !== 'welcome-awni' && m.text.trim())
        .map((m) => ({ role: m.role, text: m.text }));

      // Call streaming API
      await AiService.askAwniStream({
        prompt: promptText,
        history,
        systemInstruction: AWNI_ENTREPRENEURIAL_SYSTEM_INSTRUCTION,
        userContext: {
          sessionTime: new Date().toISOString(),
          currentPath: window.location.hash || 'home',
        },
        signal: controller.signal,
        onChunk: (accumulatedText) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === modelMsgId ? { ...msg, text: accumulatedText } : msg
            )
          );
        },
      });
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error during Awni streaming:', err);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === modelMsgId
              ? {
                  ...msg,
                  text:
                    msg.text ||
                    'أهلاً بك يا غالي! أنا معك دائماً. تفضل بطرح استفسارك الريادي أو التجاري وسأوافيك بالتفاصيل الدقيقة.',
                }
              : msg
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  // Stop active generation
  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  };

  // Copy message text to clipboard
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Like feedback
  const handleLike = (id: string) => {
    setLikedId(id);
    setTimeout(() => setLikedId(null), 2500);
  };

  // Text-To-Speech: Speak Awni's advice in natural Arabic
  const handleToggleSpeak = (text: string, id: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown bold syntax before reading
    const cleanText = text.replace(/[*_#`~>-]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ar-SA';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick best Arabic voice if available
    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arVoice) {
      utterance.voice = arVoice;
    }

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };
    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Clear/Reset session conversation history
  const handleResetChat = () => {
    setActiveSavedConv(null);
    if (isStreaming) handleStopStreaming();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
    setMessages([
      {
        id: 'welcome-awni',
        role: 'model',
        text: 'أهلاً بك في جلسة استشارية جديدة مع عوني! تم تحديث سجل المحادثة. ما هو موضوعنا الريادي أو التجاري اليوم؟',
        timestamp: new Date().toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Format recording duration mm:ss
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // User clicks microphone icon -> Prompt for permission with clear Google voice info
  const handleMicButtonClick = () => {
    if (isRecordingVoice) {
      stopVoiceRecording();
    } else {
      setVoiceError(null);
      setShowMicPermissionModal(true);
    }
  };

  // Start voice recording with Google Speech Recognition & MediaRecorder dual-channel
  const confirmAndStartVoiceRecording = async () => {
    setShowMicPermissionModal(false);
    setVoiceError(null);
    setLiveTranscriptPreview('');

    // Check getUserMedia support
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      setVoiceError('التسجيل الصوتي غير مدعوم في هذا المتصفح. يمكنك كتابة استفسارك مباشرة.');
      setTimeout(() => setVoiceError(null), 5000);
      return;
    }

    try {
      // 1. Request microphone permission via browser/Google prompt
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 2. Try initializing Google Chrome Native Speech Recognition for live real-time Arabic text
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      let recognitionActive = false;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = 'ar-OM'; // Omani Arabic dialect recognition
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

          recognition.onerror = (e: any) => {
            console.warn('Speech recognition notice:', e.error);
          };

          recognition.start();
          speechRecognitionRef.current = recognition;
          recognitionActive = true;
        } catch (recognitionErr) {
          console.warn('Could not launch speech recognition directly, using recorder fallback:', recognitionErr);
        }
      }

      // 3. Setup MediaRecorder as robust fallback / audio chunking
      voiceChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      voiceMediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          voiceChunksRef.current.push(event.data);
        }
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

        // If speech recognition already provided words, focus input
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

        // Otherwise transcribe via server audio transcriber
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
            prompt: 'قم بتفريغ هذا السؤال الصوتي إلى نص عربي واضح للاستفسار من المستشار عوني.',
          });

          if (text && text.trim()) {
            setInputPrompt((prev) => (prev ? `${prev} ${text.trim()}` : text.trim()));
            setTimeout(() => inputRef.current?.focus(), 100);
          }
        } catch (err) {
          console.warn('Voice transcription note in chat widget:', err);
        } finally {
          setIsTranscribingVoice(false);
          setRecordingDuration(0);
        }
      };

      mediaRecorder.start(250);
      setIsRecordingVoice(true);
      setRecordingDuration(0);

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone permission notice:', err?.name || err?.message || err);
      setIsRecordingVoice(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setRecordingDuration(0);

      const isPermissionDenied =
        err?.name === 'NotAllowedError' ||
        err?.name === 'PermissionDeniedError' ||
        (err?.message && String(err.message).toLowerCase().includes('permission denied'));

      if (isPermissionDenied) {
        setVoiceError('تم رفض إذن المايكروفون في المتصفح. يمكنك السماح به بالنقر على رمز القفل 🔒 بجانب عنوان الموقع في Google Chrome.');
      } else {
        setVoiceError('تعذر الوصول إلى المايكروفون حالياً، يمكنك كتابة رسالتك في مربع الاستفسار.');
      }
      setTimeout(() => setVoiceError(null), 6000);
    }
  };

  // Stop voice recording and finish
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

  // Cancel voice recording without saving
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

  // Render markdown-like bold text, bullet points, and clean typography
  const renderFormattedText = (text: string, isCurrentStreaming: boolean) => {
    if (!text && isCurrentStreaming) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span className="w-1.5 h-1.5 bg-[#c59b5f] rounded-full animate-ping" />
          <span>المستشار عوني يكتب الإجابة...</span>
        </span>
      );
    }

    const lines = text.split('\n');
    return (
      <div className="space-y-1">
        {lines.map((line, idx) => {
          const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ');
          const content = isBullet ? line.trim().replace(/^[-•]\s*/, '') : line;

          const parts = content.split(/(\*\*.*?\*\*)/g);
          const renderedParts = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-[#153e4d]">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          if (isBullet) {
            return (
              <div key={idx} className="flex items-start gap-2 pr-1 my-1">
                <span className="text-[#c59b5f] font-black text-sm leading-tight">•</span>
                <div className="flex-1 text-slate-800">{renderedParts}</div>
              </div>
            );
          }

          if (!line.trim()) {
            return <div key={idx} className="h-1.5" />;
          }

          return (
            <p key={idx} className="text-slate-800 leading-relaxed font-normal">
              {renderedParts}
            </p>
          );
        })}
      </div>
    );
  };

  // Detect relevant quick links in Awni's replies for high interactivity
  const renderInteractiveChips = (text: string) => {
    const hasMarketplace = text.includes('سوق') || text.includes('منتجات') || text.includes('لبان') || text.includes('عسل') || text.includes('شراء') || text.includes('حلوى') || text.includes('خنجر');
    const hasFeasibility = text.includes('دراسة') || text.includes('جدوى') || text.includes('تكاليف') || text.includes('رأس مال') || text.includes('أرباح');
    const hasCourses = text.includes('دورة') || text.includes('ورش') || text.includes('تدريب');
    const hasIdeas = text.includes('فكرة') || text.includes('مشروع') || text.includes('ابتكار');
    const hasRiyada = text.includes('ريادة') || text.includes('سجل') || text.includes('ترخيص');

    return (
      <div className="pt-2.5 mt-2 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
        {/* Quick Save to Folders Shortcuts */}
        {hasFeasibility && (
          <button
            onClick={() => handleQuickSaveCurrent('feasibility')}
            className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="حفظ في دراسات الجدوى"
          >
            <Folder className="w-3 h-3 text-amber-600" />
            <span>حفظ بالجدوى 📊</span>
          </button>
        )}
        {hasIdeas && (
          <button
            onClick={() => handleQuickSaveCurrent('ideas')}
            className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/80 font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="حفظ في أفكار المشاريع"
          >
            <Lightbulb className="w-3 h-3 text-indigo-600" />
            <span>حفظ بالأفكار 💡</span>
          </button>
        )}
        {hasRiyada && (
          <button
            onClick={() => handleQuickSaveCurrent('riyada')}
            className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="حفظ في ملفات التأسيس"
          >
            <Building className="w-3 h-3 text-emerald-600" />
            <span>حفظ بالتأسيس 💼</span>
          </button>
        )}

        {hasFeasibility && (
          <button
            onClick={() => {
              onNavigate?.('ai-business-idea.html');
              setIsOpen(false);
            }}
            className="px-2.5 py-1 bg-[#153e4d]/10 hover:bg-[#153e4d]/20 text-[#153e4d] font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <TrendingUp className="w-3 h-3 text-[#c59b5f]" />
            <span>فتح دراسة الجدوى 📊</span>
          </button>
        )}
        {hasMarketplace && (
          <button
            onClick={() => {
              onNavigate?.('marketplace.html');
              setIsOpen(false);
            }}
            className="px-2.5 py-1 bg-[#c59b5f]/15 hover:bg-[#c59b5f]/25 text-[#735323] font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ShoppingBag className="w-3 h-3 text-[#c59b5f]" />
            <span>تصفح سوق المنتجات 🛍️</span>
          </button>
        )}
        {hasCourses && (
          <button
            onClick={() => {
              onNavigate?.('training-courses.html');
              setIsOpen(false);
            }}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Award className="w-3 h-3 text-[#1f5b70]" />
            <span>عرض الدورات التدريبية 🎓</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      className={
        isOpen && windowSize === 'fullscreen'
          ? 'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-2 sm:p-4 md:p-6 transition-all duration-300 font-sans'
          : isOpen
          ? 'fixed inset-x-2 bottom-3 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex items-end justify-center sm:block font-sans'
          : 'fixed bottom-5 right-4 sm:right-6 sm:bottom-6 z-40 font-sans'
      }
      dir="rtl"
    >
      {/* Expanded Main Chat Floating / Fullscreen Window */}
      {isOpen && (
        <div
          className={`bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-300 relative ${
            windowSize === 'fullscreen'
              ? 'w-full max-w-5xl h-[94vh] sm:h-[90vh] animate-in zoom-in-95'
              : windowSize === 'wide'
              ? 'w-[calc(100vw-20px)] sm:w-[680px] md:w-[720px] h-[82vh] sm:h-[680px] max-h-[88vh] animate-in slide-in-from-bottom-4 sm:zoom-in-95'
              : 'w-[calc(100vw-20px)] sm:w-[480px] md:w-[500px] h-[80vh] sm:h-[640px] max-h-[88vh] sm:max-h-[86vh] animate-in slide-in-from-bottom-4 sm:zoom-in-95'
          }`}
        >
          {/* Google Microphone Permission Modal with clean guidance */}
          {showMicPermissionModal && (
            <div className="absolute inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
              <div className="bg-white rounded-3xl max-w-xs sm:max-w-sm w-full p-5 sm:p-6 text-center space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
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
                    يطلب المستشار <strong>"عوني"</strong> الإذن باستخدام الميكروفون لتسجيل سؤالك وتحويله فورياً إلى نص للاستشارة.
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

          {/* Prestigious Executive Header */}
          <div className="bg-gradient-to-r from-[#122e3a] via-[#153e4d] to-[#1f5b70] text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-[#c59b5f]/30 shrink-0">
            <div className="flex items-center gap-3">
              {/* Bot Avatar */}
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#c59b5f] via-[#e9cca0] to-[#dfba83] p-0.5 shadow-md">
                  <div className="w-full h-full bg-[#122e3a] rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-[#e9cca0]" />
                  </div>
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-[#122e3a] rounded-full ${
                    isStreaming ? 'bg-[#c59b5f] animate-ping' : 'bg-emerald-500'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-white text-base tracking-wide">المستشار عوني | Awni</h3>
                  <span className="text-[10px] bg-[#c59b5f]/25 text-[#f5e3c7] border border-[#c59b5f]/40 px-2 py-0.5 rounded-full font-bold">
                    استشارة مباشرة 🇴🇲
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  كبير المستشارين الاقتصاديين والرياديين • متصل الآن
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">
              {/* Smart Archive and Folders Button */}
              <button
                onClick={() => setShowArchiveManager(true)}
                className="p-1.5 sm:px-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs text-slate-300 hover:text-white hover:bg-white/10"
                title="أرشيف ومجلدات دراسات الجدوى والأفكار"
              >
                <FolderOpen className="w-4 h-4 text-[#e9cca0]" />
                <span className="hidden sm:inline text-[11px] font-bold text-[#e9cca0]">الأرشيف والمجلدات</span>
              </button>

              {/* Quick Save current session if active messages exist */}
              {messages.length > 1 && (
                <button
                  onClick={() => handleQuickSaveCurrent()}
                  className="p-1.5 sm:px-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-[#e9cca0]"
                  title="حفظ وتصنيف الاستشارة الحالية"
                >
                  <Bookmark className="w-3.5 h-3.5 text-[#c59b5f]" />
                  <span className="hidden md:inline text-[10px] font-bold">حفظ</span>
                </button>
              )}

              {/* Font Settings Toggle */}
              <button
                onClick={() => setShowFontSettings(!showFontSettings)}
                className={`p-1.5 sm:px-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs ${
                  showFontSettings
                    ? 'bg-[#c59b5f] text-[#122e3a] font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title="تخصيص حجم ونوع الخط في المحادثة"
              >
                <Type className="w-4 h-4 text-[#c59b5f]" />
                <span className="hidden sm:inline text-[11px] font-bold">الخط</span>
              </button>

              {/* Reset Session History */}
              <button
                onClick={handleResetChat}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="بدء جلسة جديدة ومسح سجل المحادثة"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Window Dimensions Preset Controls (قياسي 480px / عريض 720px / كامل) */}
              <div className="hidden sm:flex items-center bg-white/10 rounded-xl p-0.5 border border-white/15 text-[10px]">
                <button
                  type="button"
                  onClick={() => changeWindowSize('standard')}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    windowSize === 'standard'
                      ? 'bg-[#c59b5f] text-[#122e3a] font-black shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="القياس العادي (480px)"
                >
                  قياسي
                </button>
                <button
                  type="button"
                  onClick={() => changeWindowSize('wide')}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    windowSize === 'wide'
                      ? 'bg-[#c59b5f] text-[#122e3a] font-black shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="القياس العريض المريح (720px)"
                >
                  عريض
                </button>
                <button
                  type="button"
                  onClick={() => changeWindowSize('fullscreen')}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    windowSize === 'fullscreen'
                      ? 'bg-[#c59b5f] text-[#122e3a] font-black shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="ملء الشاشة"
                >
                  كامل
                </button>
              </div>

              {/* Fullscreen / Minimize Toggle Button */}
              <button
                onClick={() => changeWindowSize(windowSize === 'fullscreen' ? 'standard' : 'fullscreen')}
                className={`p-1.5 sm:px-2 rounded-xl transition-colors cursor-pointer hidden sm:flex items-center gap-1 text-[11px] ${
                  windowSize === 'fullscreen'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title={windowSize === 'fullscreen' ? 'تصغير إلى نافذة منبثقة' : 'ملء الشاشة'}
              >
                {windowSize === 'fullscreen' ? (
                  <>
                    <Minimize2 className="w-4 h-4" />
                    <span className="text-[10px]">تصغير</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4" />
                    <span className="text-[10px]">ملء الشاشة</span>
                  </>
                )}
              </button>

              {/* Close Widget */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="إغلاق النافذة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Typography Customization Toolbar */}
          {showFontSettings && (
            <div className="bg-gradient-to-r from-slate-900 via-[#153e4d] to-[#122e3a] text-white p-3 sm:p-3.5 border-b border-[#c59b5f]/40 animate-in slide-in-from-top-2 duration-200 shadow-md shrink-0">
              <div className={isExpanded ? 'max-w-4xl mx-auto w-full space-y-3' : 'w-full space-y-3'}>
                {/* Header of font panel */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#e9cca0]">
                    <Type className="w-4 h-4 text-[#c59b5f]" />
                    <span>تخصيص قراءة النص وفقاعات المحادثة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        changeFontSize('base');
                        changeFontFamily('cairo');
                      }}
                      className="text-[10px] text-slate-300 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                      title="إعادة التعيين للوضع الافتراضي"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>الافتراضي</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFontSettings(false)}
                      className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                      title="إغلاق خيارات الخط"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Font Family Selection */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-300 block">
                      نوع الخط داخل الفقاعات (Font Family):
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {FONT_FAMILIES.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => changeFontFamily(f.id)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold text-right transition-all border flex items-center justify-between cursor-pointer ${
                            fontFamily === f.id
                              ? 'bg-[#c59b5f] text-[#122e3a] border-[#e9cca0] shadow-xs'
                              : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
                          }`}
                          style={{ fontFamily: f.fontFamilyCSS }}
                        >
                          <span>{f.name.split(' ')[0]}</span>
                          <span
                            className={`text-[9px] px-1 rounded ${
                              fontFamily === f.id
                                ? 'bg-[#122e3a]/25 text-[#122e3a] font-bold'
                                : 'bg-black/25 text-slate-300'
                            }`}
                          >
                            {f.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size Selection */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300">
                        حجم الخط (Font Size):
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const sizes: ChatFontSize[] = ['sm', 'base', 'lg', 'xl'];
                            const curIdx = sizes.indexOf(fontSize);
                            if (curIdx > 0) changeFontSize(sizes[curIdx - 1]);
                          }}
                          disabled={fontSize === 'sm'}
                          className="p-1 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white cursor-pointer transition-colors"
                          title="تصغير الخط"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const sizes: ChatFontSize[] = ['sm', 'base', 'lg', 'xl'];
                            const curIdx = sizes.indexOf(fontSize);
                            if (curIdx < sizes.length - 1) changeFontSize(sizes[curIdx + 1]);
                          }}
                          disabled={fontSize === 'xl'}
                          className="p-1 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white cursor-pointer transition-colors"
                          title="تكبير الخط"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {FONT_SIZES.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => changeFontSize(s.id)}
                          className={`py-1.5 px-1 rounded-xl text-[11px] font-bold text-center transition-all border cursor-pointer ${
                            fontSize === s.id
                              ? 'bg-[#c59b5f] text-[#122e3a] border-[#e9cca0] shadow-xs'
                              : 'bg-white/10 hover:bg-white/15 text-slate-200 border-white/10'
                          }`}
                        >
                          <div>{s.label}</div>
                          <div className={`text-[9px] ${fontSize === s.id ? 'text-[#122e3a]/80' : 'text-slate-400'}`}>
                            {s.sizePx}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Preview Bar */}
                <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 shrink-0">معاينة حية للفقاعة:</span>
                  <div
                    className="text-right truncate pr-2 text-[#f5e3c7]"
                    style={{
                      fontFamily:
                        fontFamily === 'cairo'
                          ? "'Cairo', sans-serif"
                          : fontFamily === 'tajawal'
                          ? "'Tajawal', sans-serif"
                          : fontFamily === 'amiri'
                          ? "'Amiri', serif"
                          : "'Almarai', sans-serif",
                      fontSize:
                        fontSize === 'sm'
                          ? '13px'
                          : fontSize === 'base'
                          ? '15px'
                          : fontSize === 'lg'
                          ? '17px'
                          : '19px',
                    }}
                  >
                    يا هلا والله بك في منصة مُنتجي 🇴🇲 - خط {FONT_FAMILIES.find((f) => f.id === fontFamily)?.name.split(' ')[0]} ({FONT_SIZES.find((s) => s.id === fontSize)?.label})
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Saved Conversation indicator if resumed */}
          {activeSavedConv && (
            <div className="bg-amber-50 px-3 sm:px-4 py-1.5 border-b border-amber-200/90 flex items-center justify-between text-[11px] text-amber-900 shrink-0">
              <div className={isExpanded ? 'max-w-4xl mx-auto w-full flex items-center justify-between' : 'w-full flex items-center justify-between'}>
                <div className="flex items-center gap-1.5 truncate">
                  <Folder className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span className="truncate">ملف مستأنف: <strong>{activeSavedConv.title}</strong></span>
                  <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full font-bold shrink-0">
                    {AWNI_CATEGORIES.find((c) => c.id === activeSavedConv.category)?.badge || 'مجلد مخصص'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSavedConv(null);
                    showToast('تم العودة للوضع العام المفتوح');
                  }}
                  className="text-amber-800 hover:text-amber-950 font-bold underline shrink-0 cursor-pointer text-[10px] mr-2"
                >
                  بدء موضوع جديد
                </button>
              </div>
            </div>
          )}

          {/* Quick Action Navigation Bar */}
          <div className="bg-[#f0f4f6] px-3 sm:px-4 py-2 border-b border-slate-200 shrink-0">
            <div className={isExpanded ? 'max-w-4xl mx-auto w-full flex items-center justify-between text-[11px] overflow-x-auto gap-2' : 'flex items-center justify-between text-[11px] overflow-x-auto gap-2'}>
              <div className="flex items-center gap-1.5 text-slate-600 font-semibold shrink-0">
                <Briefcase className="w-3.5 h-3.5 text-[#1f5b70]" />
                <span>جلسة ريادية نشطة ({messages.filter((m) => m.role === 'user').length} أسئلة)</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full font-bold mr-1">
                  <Zap className="w-3 h-3 text-emerald-600" />
                  <span>رد سريع ⚡</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Direct Archive Button */}
                <button
                  onClick={() => setShowArchiveManager(true)}
                  className="px-2.5 py-1 bg-[#153e4d] hover:bg-[#122e3a] text-[#e9cca0] font-bold rounded-lg border border-[#c59b5f]/40 transition-colors flex items-center gap-1 cursor-pointer"
                  title="تصفح مجلدات دراسات الجدوى والأفكار"
                >
                  <FolderOpen className="w-3 h-3 text-[#e9cca0]" />
                  <span>المجلدات</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate?.('ai-business-idea.html');
                    setIsOpen(false);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#153e4d] font-bold rounded-lg border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <TrendingUp className="w-3 h-3 text-[#c59b5f]" />
                  <span>دراسة جدوى</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate?.('marketplace.html');
                    setIsOpen(false);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#153e4d] font-bold rounded-lg border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ShoppingBag className="w-3 h-3 text-[#c59b5f]" />
                  <span>السوق الوطني</span>
                </button>
              </div>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-[#fbfcfd] to-[#f4f7f8]">
            <div className={isExpanded ? 'max-w-4xl mx-auto w-full space-y-4' : 'w-full space-y-4'}>
              {messages.map((msg, index) => {
                const isCurrentStreamingMsg =
                  isStreaming && msg.role === 'model' && index === messages.length - 1;
                const isSpeakingThis = speakingMessageId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 sm:gap-3.5 ${
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar Icon */}
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                        msg.role === 'user'
                          ? 'bg-[#153e4d] text-white'
                          : 'bg-gradient-to-tr from-[#1f5b70] to-[#153e4d] text-[#e9cca0] border border-[#c59b5f]/40'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-[#e9cca0]" />
                      )}
                    </div>

                    {/* Message Bubble with user selected Font Size and Family */}
                    <div
                      className={`rounded-2xl p-3.5 sm:p-4 shadow-xs relative transition-all duration-200 ${
                        isExpanded ? 'max-w-[80%]' : 'max-w-[86%]'
                      } ${
                        fontSize === 'sm'
                          ? 'text-[13px] leading-relaxed'
                          : fontSize === 'base'
                          ? 'text-[15px] leading-relaxed'
                          : fontSize === 'lg'
                          ? 'text-[17px] leading-relaxed'
                          : 'text-[19px] leading-loose'
                      } ${
                        msg.role === 'user'
                          ? 'bg-[#153e4d] text-white rounded-tr-xs'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                      }`}
                      style={{
                        fontFamily:
                          fontFamily === 'cairo'
                            ? "'Cairo', sans-serif"
                            : fontFamily === 'tajawal'
                            ? "'Tajawal', sans-serif"
                            : fontFamily === 'amiri'
                            ? "'Amiri', serif"
                            : "'Almarai', sans-serif",
                      }}
                    >
                      {msg.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      ) : (
                        <>
                          {renderFormattedText(msg.text, isCurrentStreamingMsg)}
                          {/* Interactive Chips if applicable */}
                          {msg.text && renderInteractiveChips(msg.text)}
                        </>
                      )}

                      {/* Message Footer with Timestamp, Copy, Voice Readout, and Like */}
                      <div
                        className={`flex items-center justify-between pt-1.5 mt-1.5 text-[10px] ${
                          msg.role === 'user'
                            ? 'text-slate-300 border-t border-white/10'
                            : 'text-slate-400 border-t border-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{msg.timestamp}</span>
                          {isSpeakingThis && (
                            <span className="text-[#c59b5f] font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#c59b5f] animate-ping" />
                              <span>عوني يتحدث...</span>
                            </span>
                          )}
                        </div>

                        {msg.role === 'model' && msg.text && (
                          <div className="flex items-center gap-1">
                            {/* Text-to-speech speaker button */}
                            <button
                              onClick={() => handleToggleSpeak(msg.text, msg.id)}
                              className={`p-1 rounded-md transition-colors cursor-pointer ${
                                isSpeakingThis
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                              }`}
                              title={isSpeakingThis ? 'إيقاف الصوت' : 'الاستماع لصوت عوني'}
                            >
                              {isSpeakingThis ? (
                                <VolumeX className="w-3.5 h-3.5 text-amber-700" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Like button */}
                            <button
                              onClick={() => handleLike(msg.id)}
                              className={`p-1 rounded-md transition-colors cursor-pointer ${
                                likedId === msg.id
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                              }`}
                              title="إجابة مفيدة"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>

                            {/* Copy button */}
                            <button
                              onClick={() => handleCopy(msg.text, msg.id)}
                              className="p-1 hover:bg-slate-100 rounded-md text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                              title="نسخ النص"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Instant typing pulse when waiting for response */}
              {isStreaming && (!messages[messages.length - 1]?.text || messages[messages.length - 1]?.text.length < 5) && (
                <div className="flex items-center gap-2 p-2.5 bg-amber-50/90 border border-amber-200/70 rounded-2xl text-xs text-amber-900 font-bold animate-pulse max-w-sm">
                  <Zap className="w-4 h-4 text-[#c59b5f] animate-bounce shrink-0" />
                  <span>عوني يجهز الإجابة فورياً...</span>
                </div>
              )}

              {/* Quick interactive topic pills */}
              {messages.length <= 3 && !isStreaming && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-500 block mb-2">
                    محاور استشارية سريعة مع عوني:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {quickSuggestions.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(item.query)}
                        className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#153e4d] hover:text-[#e9cca0] text-[#153e4d] text-[11px] font-semibold border border-slate-200 hover:border-[#153e4d] transition-all shadow-2xs cursor-pointer text-right flex items-center gap-1.5"
                      >
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input & Streaming Controls Bar */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
            <div className={isExpanded ? 'max-w-4xl mx-auto w-full' : 'w-full'}>
              {/* Active Voice Recording Indicator & Waveform */}
              {isRecordingVoice && (
                <div className="mb-2 p-3 bg-gradient-to-r from-emerald-50 via-amber-50 to-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                    </span>
                    <div className="text-xs font-black text-[#153e4d] flex items-center gap-1.5">
                      <span>عوني يستمع لصوتك عبر Google:</span>
                      <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-emerald-200 text-emerald-800 font-bold">
                        {formatRecordingTime(recordingDuration)}
                      </span>
                    </div>
                    {/* Wave bars animation */}
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
                      className="px-2.5 py-1 text-slate-600 hover:text-slate-900 text-[11px] font-bold rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="button"
                      onClick={stopVoiceRecording}
                      className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>إنهاء وتأكيد</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Live voice transcript preview pill */}
              {liveTranscriptPreview && isRecordingVoice && (
                <div className="mb-2 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-center gap-2">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold shrink-0">
                    كلامك المباشر:
                  </span>
                  <span className="line-clamp-1 font-medium">{liveTranscriptPreview}</span>
                </div>
              )}

              {voiceError && (
                <div className="mb-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 text-center font-medium leading-relaxed">
                  {voiceError}
                </div>
              )}

              {isTranscribingVoice && (
                <div className="mb-2 p-2 bg-[#153e4d]/10 border border-[#1f5b70]/20 rounded-xl text-xs text-[#153e4d] flex items-center justify-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#c59b5f] animate-ping" />
                  <span>جاري معالجة الصوت وتحويله إلى نص استشاري...</span>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder={isRecordingVoice ? 'عوني يستمع لصوتك الآن...' : 'اكتب استفسارك الريادي أو التجاري لعوني...'}
                  disabled={isStreaming}
                  className="flex-1 bg-slate-50 border border-slate-300 focus:border-[#1f5b70] focus:bg-white rounded-2xl px-4 py-2.5 text-xs sm:text-sm focus:outline-hidden transition-all text-right disabled:opacity-75"
                />

                {/* Voice button - connects to Google Speech Recognition with browser permissions */}
                <button
                  type="button"
                  onClick={handleMicButtonClick}
                  disabled={isStreaming || isTranscribingVoice}
                  className={`p-2.5 sm:p-3 rounded-2xl transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                    isRecordingVoice
                      ? 'bg-emerald-600 text-white animate-pulse shadow-md ring-2 ring-emerald-400'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  } disabled:opacity-40`}
                  title={isRecordingVoice ? 'إنهاء التسجيل الصوتي' : 'التحدث صوتياً مع عوني (محرك Google الصوتي)'}
                >
                  {isRecordingVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#153e4d]" />}
                </button>

                {isStreaming ? (
                  <button
                    type="button"
                    onClick={handleStopStreaming}
                    className="p-2.5 sm:p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl shadow-md transition-all flex items-center justify-center shrink-0 cursor-pointer"
                    title="إيقاف الرد"
                  >
                    <Square className="w-4 h-4 fill-white" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputPrompt.trim() || isStreaming}
                    className="p-2.5 sm:p-3 bg-gradient-to-r from-[#153e4d] to-[#1f5b70] hover:from-[#122e3a] hover:to-[#153e4d] text-[#e9cca0] rounded-2xl shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center shrink-0"
                    title="إرسال للمستشار عوني"
                  >
                    <Send className="w-4 h-4 rotate-180" />
                  </button>
                )}
              </form>

              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>المستشار الوطني المعتمد لمشاريع عُمان • استجابة فورية فائقة السرعة ⚡</span>
                </span>
                <span className="text-[#c59b5f] font-semibold">منصة مُنتجي 🇴🇲</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-80 bg-[#122e3a] text-[#e9cca0] border border-[#c59b5f] px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-3">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Awni Conversations & Folders Manager Modal */}
      <AwniConversationsManager
        isOpen={showArchiveManager}
        onClose={() => setShowArchiveManager(false)}
        currentMessages={messages}
        userId={user?.uid}
        onSelectConversation={handleSelectSavedConv}
      />

      {/* Floating Trigger Button with badge */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-gradient-to-r from-[#153e4d] via-[#1f5b70] to-[#122e3a] hover:from-[#122e3a] hover:to-[#153e4d] text-white p-3.5 sm:p-4 rounded-3xl shadow-2xl border-2 border-[#c59b5f]/50 hover:border-[#c59b5f] transition-all transform hover:scale-105 cursor-pointer flex items-center gap-3"
          title="تحدث مع المستشار عوني"
        >
          {/* Animated Glow Pill */}
          <div className="w-10 h-10 rounded-2xl bg-[#122e3a] border border-[#c59b5f]/50 flex items-center justify-center shadow-inner relative">
            <ShieldCheck className="w-6 h-6 text-[#e9cca0] group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <div className="text-right hidden sm:block pr-1">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm text-[#e9cca0]">استشر "عوني"</span>
              <span className="text-[9px] bg-[#c59b5f]/25 text-[#f5e3c7] px-1.5 py-0.2 rounded-full font-bold border border-[#c59b5f]/40">
                مباشر
              </span>
            </div>
            <p className="text-[11px] text-slate-300">مستشارك الريادي والاقتصادي</p>
          </div>

          {unreadBadge && (
            <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-white animate-bounce">
              نشط!
            </span>
          )}
        </button>
      )}
    </div>
  );
};
