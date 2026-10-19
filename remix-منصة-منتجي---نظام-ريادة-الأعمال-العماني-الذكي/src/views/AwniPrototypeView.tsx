import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Send, RefreshCw, ArrowRight } from 'lucide-react';
import { AiService } from '../services/ai-service';

export const AwniPrototypeView: React.FC = () => {
  const [botState, setBotState] = useState<'idle' | 'listening' | 'thinking' | 'speaking' | 'happy'>('idle');
  const [isBlinking, setIsBlinking] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [lastResponse, setLastResponse] = useState(
    'يا هلا والله ومرحبا بيك! أنا "عوني"، رفيقك ومستشارك في منصة مُنتجي. جرب تسألني "من أنتم؟" أو اسألني عن دراسات الجدوى وبطاقة ريادة!'
  );
  const [isRecording, setIsRecording] = useState(false);

  const recognitionRef = useRef<any>(null);

  // دورة الرمش التلقائي كل 3.5 ثانية
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3600);
    return () => clearInterval(blinkInterval);
  }, []);

  // تشغيل النطق الصوتي للرد
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*_#`~>-]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ar-SA';
    utterance.rate = 1.05;

    utterance.onstart = () => setBotState('speaking');
    utterance.onend = () => setBotState('happy');
    utterance.onerror = () => setBotState('idle');

    window.speechSynthesis.speak(utterance);
  };

  // إرسال السؤال إلى عوني ومعالجة الرد
  const handleAsk = async (queryText?: string) => {
    const text = (queryText || inputPrompt).trim();
    if (!text) return;

    setInputPrompt('');
    setBotState('thinking');

    try {
      const response = await AiService.askAwni(text, []);
      setLastResponse(response);
      speakText(response);
    } catch {
      const fallback = 'يا هلا بيك! أنا عوني المستشار الذكي لمنصة مُنتجي، حاضر لمساعدتك في كل ما يخص المشاريع العمانية ودراسات الجدوى.';
      setLastResponse(fallback);
      speakText(fallback);
    }
  };

  // التحكم في المايكروفون والاستماع المباشر
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('التعرف الصوتي غير مدعوم في هذا المتصفح، يُرجى استخدام متصفح Chrome.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      setBotState('idle');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-OM';
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsRecording(true);
      setBotState('listening');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputPrompt(transcript);
      setIsRecording(false);
      handleAsk(transcript);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setBotState('idle');
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (botState === 'listening') setBotState('idle');
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const screenColor = '#2a768e'; // الدرجة البترولية المعتمدة للمنصة

  return (
    <div className="min-h-screen bg-[#09151c] text-white flex flex-col items-center justify-between p-6 select-none" dir="rtl">
      {/* رأس الصفحة التجريبية */}
      <div className="w-full max-w-xl flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#d4ab71]" />
          <h2 className="font-black text-sm text-[#ebd0a3]">بروتوتايب: الوجه التفاعلي للمستشار "عوني"</h2>
        </div>
        <span className="text-[11px] bg-[#2a768e]/20 border border-[#2a768e]/50 px-2.5 py-0.5 rounded-full text-cyan-300 font-bold">
          الحالة: {botState === 'listening' ? 'يستمع 🎙️' : botState === 'speaking' ? 'يتكلم 🔊' : botState === 'thinking' ? 'يفكر ⚡' : 'جاهز'}
        </span>
      </div>

      {/* منطقة الروبوت التفاعلي في المنتصف */}
      <div className="my-auto relative flex flex-col items-center">
        {/* التوهج الخلفي (Ambient Glow) */}
        <div
          className="absolute w-72 h-72 rounded-full blur-3xl opacity-35 transition-all duration-700 pointer-events-none animate-pulse"
          style={{ backgroundColor: screenColor }}
        />

        {/* مجسم الروبوت */}
        <div className="relative inline-flex items-center justify-center">
          {/* اليد اليسرى */}
          <div
            className="absolute -left-12 w-10 h-16 bg-gradient-to-br from-white via-slate-100 to-slate-300 rounded-full shadow-2xl border border-white/60 transition-transform duration-500"
            style={{
              transform: botState === 'speaking' || botState === 'happy' ? 'translateY(-14px) rotate(-20deg)' : 'translateY(6px) rotate(-6deg)',
            }}
          />

          {/* اليد اليمنى */}
          <div
            className="absolute -right-12 w-10 h-16 bg-gradient-to-bl from-white via-slate-100 to-slate-300 rounded-full shadow-2xl border border-white/60 transition-transform duration-500"
            style={{
              transform: botState === 'speaking' || botState === 'happy' ? 'translateY(-14px) rotate(20deg)' : 'translateY(6px) rotate(6deg)',
            }}
          />

          {/* الرأس الطافي */}
          <div
            className="relative w-52 h-44 bg-gradient-to-b from-white via-slate-100 to-slate-200 rounded-[50px] p-3 shadow-[0_0_50px_rgba(42,118,142,0.5)] border-2 border-white/90 transition-all duration-300"
            style={{ animation: 'floating 3.2s ease-in-out infinite' }}
          >
            {/* الأذنان */}
            <div className="absolute -top-4 left-6 w-7 h-9 bg-white border border-slate-200 rounded-t-full rotate-[-25deg]" />
            <div className="absolute -top-4 right-6 w-7 h-9 bg-white border border-slate-200 rounded-t-full rotate-[25deg]" />

            {/* الشاشة الداخلية */}
            <div className="w-full h-full bg-[#081217] rounded-[40px] border border-slate-700/80 shadow-inner flex flex-col items-center justify-center p-3 relative overflow-hidden">
              <div className="absolute top-1 left-5 right-5 h-7 bg-gradient-to-b from-white/15 to-transparent rounded-full pointer-events-none" />

              {/* العينان التفاعليتان */}
              <div className="flex items-center justify-center gap-9 mb-3">
                <div
                  className="transition-all duration-150"
                  style={{
                    width: botState === 'listening' ? 26 : 20,
                    height: isBlinking ? 3 : botState === 'happy' ? 10 : 26,
                    backgroundColor: isBlinking ? 'transparent' : screenColor,
                    borderRadius: botState === 'happy' ? '14px 14px 0 0' : '10px',
                    borderTop: isBlinking ? `3px solid ${screenColor}` : 'none',
                    boxShadow: `0 0 16px ${screenColor}`,
                  }}
                />
                <div
                  className="transition-all duration-150"
                  style={{
                    width: botState === 'listening' ? 26 : 20,
                    height: isBlinking ? 3 : botState === 'happy' ? 10 : 26,
                    backgroundColor: isBlinking ? 'transparent' : screenColor,
                    borderRadius: botState === 'happy' ? '14px 14px 0 0' : '10px',
                    borderTop: isBlinking ? `3px solid ${screenColor}` : 'none',
                    boxShadow: `0 0 16px ${screenColor}`,
                  }}
                />
              </div>

              {/* الفم الرقمي وحركة الكلام */}
              <div className="flex items-center justify-center gap-1 h-5">
                {botState === 'speaking' ? (
                  [30, 80, 100, 60, 90, 40].map((h, i) => (
                    <span
                      key={i}
                      className="w-1.5 rounded-full animate-pulse"
                      style={{
                        height: `${h}%`,
                        backgroundColor: screenColor,
                        boxShadow: `0 0 8px ${screenColor}`,
                        animationDuration: `${0.25 + (i % 3) * 0.12}s`,
                      }}
                    />
                  ))
                ) : botState === 'thinking' ? (
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: screenColor }} />
                    <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:0.15s]" style={{ backgroundColor: screenColor }} />
                    <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:0.3s]" style={{ backgroundColor: screenColor }} />
                  </div>
                ) : (
                  <div className="w-8 h-1.5 rounded-full opacity-80" style={{ backgroundColor: screenColor, boxShadow: `0 0 8px ${screenColor}` }} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* صندوق إجابة الروبوت الحالية شفهياً ومكتوبة */}
        <div className="mt-8 max-w-lg bg-[#0e1d26] border border-slate-700/80 rounded-2xl p-4 text-xs leading-relaxed text-slate-200 text-center shadow-lg">
          <p>{lastResponse}</p>
        </div>
      </div>

      {/* شريط التحكم السفلي والمايكروفون */}
      <div className="w-full max-w-xl space-y-3">
        {/* أزرار سريعة للتجربة */}
        <div className="flex items-center justify-center gap-2 text-xs">
          <button
            onClick={() => handleAsk('من أنتم؟')}
            className="px-3 py-1.5 bg-[#162a36] hover:bg-[#1b4d5e] border border-slate-700 rounded-xl transition text-slate-300"
          >
            سؤال: من أنتم؟
          </button>
          <button
            onClick={() => handleAsk('ما هي خدمات منصة منتجي؟')}
            className="px-3 py-1.5 bg-[#162a36] hover:bg-[#1b4d5e] border border-slate-700 rounded-xl transition text-slate-300"
          >
            سؤال: ما هي خدماتكم؟
          </button>
          <button
            onClick={() => handleAsk('كيف أحصل على بطاقة ريادة 2026؟')}
            className="px-3 py-1.5 bg-[#162a36] hover:bg-[#1b4d5e] border border-slate-700 rounded-xl transition text-slate-300"
          >
            سؤال: بطاقة ريادة؟
          </button>
        </div>

        {/* خانة الإدخال وزر الصوت */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3.5 rounded-2xl font-bold flex items-center justify-center transition shadow-lg ${
              isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-[#2a768e] text-white hover:bg-[#1b4d5e]'
            }`}
            title="تحدث مع عوني صوتياً"
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="تحدث أو اكتب سؤالك لعوني هنا..."
            className="flex-1 bg-[#0e1d26] border border-slate-700 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2a768e]"
          />

          <button
            type="button"
            onClick={() => handleAsk()}
            className="p-3.5 bg-[#d4ab71] text-slate-950 font-bold rounded-2xl hover:bg-[#ebd0a3] transition"
          >
            <Send className="w-5 h-5 rotate-180" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};