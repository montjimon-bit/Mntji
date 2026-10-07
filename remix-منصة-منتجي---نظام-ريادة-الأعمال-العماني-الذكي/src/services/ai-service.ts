/**
 * ai-service.ts - Real AI Integration Service for Montaji Platform
 * Connects to the server-side Gemini 3.8 Flash proxy endpoints with full fallback handling
 */

import { AwniEngine } from './awni-engine';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface FeasibilityInput {
  ideaTitle: string;
  sector: string;
  subSector?: string;
  targetGovernorate: string;
  budgetRange: string;
  description: string;
  targetAudience: string;
}

export class AiService {
  private static STORAGE_KEY = 'montaji_gemini_key';

  public static getCustomApiKey(): string {
    try {
      return localStorage.getItem(this.STORAGE_KEY) || '';
    } catch {
      return '';
    }
  }

  public static setCustomApiKey(key: string): void {
    try {
      if (key && key.trim()) {
        localStorage.setItem(this.STORAGE_KEY, key.trim());
      } else {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save API key in storage', e);
    }
  }

  /**
   * Send conversational query to Awni (عوني) AI Chatbot
   */
  public static async askAwni(
    prompt: string,
    history: { role: 'user' | 'model'; text: string }[] = [],
    userContext?: any,
    apiKey?: string
  ): Promise<string> {
    const customKey = apiKey || this.getCustomApiKey();
    try {
      const response = await fetch('/api/gemini/awni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          history,
          apiKey: customKey || undefined,
          userContext,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          return data.text;
        }
      }

      // If backend returned error JSON, check message
      const errorData = await response.json().catch(() => ({}));
      if (errorData.error && !errorData.error.includes('GEMINI_API_KEY')) {
        throw new Error(errorData.error);
      }
      
      // If no key is set yet or service returned 503, fallback to our rich local conversational intelligence
      return this.generateAwniLocalFallback(prompt, history);
    } catch (error: any) {
      console.warn('Awni AI falling back to smart local conversation engine:', error?.message);
      return this.generateAwniLocalFallback(prompt, history);
    }
  }

  /**
   * Send conversational streaming query to Awni (عوني) AI Chatbot
   * Streams responses chunk-by-chunk using Server-Sent Events (SSE)
   */
  public static async askAwniStream({
    prompt,
    history = [],
    apiKey,
    userContext,
    systemInstruction,
    onChunk,
    signal,
  }: {
    prompt: string;
    history?: { role: 'user' | 'model'; text: string }[];
    apiKey?: string;
    userContext?: any;
    systemInstruction?: string;
    onChunk: (accumulatedText: string, latestChunk: string) => void;
    signal?: AbortSignal;
  }): Promise<string> {
    const activeKey = apiKey || this.getCustomApiKey();
    let accumulated = '';

    try {
      const response = await fetch('/api/gemini/awni/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          history,
          apiKey: activeKey || undefined,
          userContext,
          systemInstruction,
        }),
        signal,
      });

      if (!response.ok || !response.body) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `خطأ في الاتصال بالخدمة (${response.status})`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const dataStr = trimmed.replace(/^data:\s*/, '');
          if (dataStr === '[DONE]') {
            return accumulated;
          }

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.text) {
              accumulated += parsed.text;
              onChunk(accumulated, parsed.text);
            }
          } catch {
            // Ignore parse errors on partial chunks
          }
        }
      }

      return accumulated;
    } catch (error: any) {
      if (signal?.aborted) {
        return accumulated;
      }
      console.warn('Awni streaming failed or intercepted, falling back to simulated stream:', error);

      // Fallback: simulate fast, responsive streaming from local conversational intelligence
      const fullFallbackText = this.generateAwniLocalFallback(prompt, history);
      accumulated = '';
      const words = fullFallbackText.split(' ');
      for (let i = 0; i < words.length; i += 2) {
        if (signal?.aborted) break;
        const piece = (i === 0 ? '' : ' ') + words.slice(i, i + 2).join(' ');
        accumulated += piece;
        onChunk(accumulated, piece);
        await new Promise((res) => setTimeout(res, 8));
      }
      return accumulated;
    }
  }

  /**
   * High-intelligence contextual fallback in Omani tone powered by AwniEngine
   */
  private static generateAwniLocalFallback(
    prompt: string,
    history: { role: 'user' | 'model'; text: string }[] = []
  ): string {
    return AwniEngine.generateResponse(prompt, history);
  }

  /**
   * Send consultation query to Gemini AI
   */
  public static async askConsultation(
    prompt: string,
    history: { role: 'user' | 'model'; text: string }[] = []
  ): Promise<string> {
    const customKey = this.getCustomApiKey();
    try {
      const response = await fetch('/api/gemini/advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          history,
          apiKey: customKey || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `خطأ في الاتصال بالخدمة (${response.status})`);
      }

      const data = await response.json();
      return data.text || AwniEngine.generateResponse(prompt, history);
    } catch (error: any) {
      console.warn('Notice: Advisory client fallback:', error?.message);
      return AwniEngine.generateResponse(prompt, history);
    }
  }

  /**
   * Generate complete Feasibility Study & Business Plan
   */
  public static async generateFeasibilityStudy(input: FeasibilityInput): Promise<string> {
    const customKey = this.getCustomApiKey();
    try {
      const response = await fetch('/api/gemini/feasibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...input,
          apiKey: customKey || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.feasibilityReport) {
          return data.feasibilityReport;
        }
      }

      return AwniEngine.generateFeasibilityStudy(input);
    } catch (error: any) {
      console.warn('Falling back to Awni feasibility intelligence:', error);
      return AwniEngine.generateFeasibilityStudy(input);
    }
  }

  /**
   * Generate sector-specialized feasibility study fallback tailored for Oman
   */
  private static generateSectorFeasibilityFallback(input: FeasibilityInput): string {
    return AwniEngine.generateFeasibilityStudy(input);
  }

  /**
   * Evaluate Idea & Innovation Score
   */
  public static async evaluateIdea(idea: string, sector: string, budget: string): Promise<string> {
    const customKey = this.getCustomApiKey();
    try {
      const response = await fetch('/api/gemini/evaluate-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          sector,
          budget,
          apiKey: customKey || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `خطأ في تقييم الفكرة (${response.status})`);
      }

      const data = await response.json();
      return data.evaluation || '';
    } catch (error: any) {
      console.error('Idea Evaluation Error:', error);
      throw error;
    }
  }

  /**
   * Transcribe Audio using Gemini 3.5 Transcribe
   */
  public static async transcribeAudio({
    audioBase64,
    mimeType = 'audio/webm',
    prompt,
  }: {
    audioBase64: string;
    mimeType?: string;
    prompt?: string;
  }): Promise<string> {
    const customKey = this.getCustomApiKey();
    try {
      const response = await fetch('/api/gemini/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64,
          mimeType,
          prompt,
          apiKey: customKey || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `خطأ في التفريغ الصوتي (${response.status})`);
      }

      const data = await response.json();
      return data.transcription || '';
    } catch (error: any) {
      console.error('Audio Transcription Error:', error);
      throw error;
    }
  }

  /**
   * Create or Edit Image using Gemini 3.1 Flash Image Preview
   */
  public static async generateOrEditImage({
    prompt,
    base64Image,
    mimeType,
    aspectRatio = '1:1',
  }: {
    prompt: string;
    base64Image?: string;
    mimeType?: string;
    aspectRatio?: string;
  }): Promise<{ imageUrl: string | null; text: string | null }> {
    const customKey = this.getCustomApiKey();
    try {
      const response = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          base64Image,
          mimeType,
          aspectRatio,
          apiKey: customKey || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `خطأ في معالجة الصورة (${response.status})`);
      }

      const data = await response.json();
      return {
        imageUrl: data.imageUrl || null,
        text: data.text || null,
      };
    } catch (error: any) {
      console.error('Image Generation/Editing Error:', error);
      throw error;
    }
  }
}
import { GoogleGenAI } from "@google/genai";

// دالة تحليل مجسم الهولوجرام
export async function generateHologramConcept(imageBase64: string, participantName: string) {
  try {
    // جلب المفتاح من ملف البيئة
    const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
    const ai = new GoogleGenAI({ apiKey });

    // تنظيف ترميز الصورة
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `
    حلل هذا المجسم الأولي واقترح منتجاً مبتكراً ابتكره المشارك "${participantName}".
    يجب أن ترجع النتيجة بتنسيق JSON حصراً يحتوي على:
    {
      "productName": "اسم المنتج التجاري",
      "slogan": "شعار تسويقي ملهم",
      "suggestedPrice": "السعر المقترح بريال عماني (مثال: 7.500 ر.ع)",
      "imagePrompt": "A 3D futuristic render of [Product Name], isolated product shot, glowing neon science aesthetics, centered, on a solid pitch-black background (#000000), no shadows, no floor"
    }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: cleanBase64,
                mimeType: "image/jpeg",
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    return { success: true, data: parsedData };
  } catch (error) {
    console.error("Hologram AI generation error:", error);
    return { success: false, error: "تعذر تحليل المجسم بواسطة الذكاء الاصطناعي" };
  }
}

