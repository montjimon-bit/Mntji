import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { AwniEngine } from './src/services/awni-engine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to instantiate Gemini AI client
const getAi = (userApiKey?: string) => {
  const key = userApiKey || process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const AWNI_SYSTEM_PROMPT = `أنت "عوني" (Awni)، كبير المستشارين الاقتصاديين والرياديين والخبراء الوطنيين في سلطنة عُمان لمنصة "مُنتجي" (Montaji).
أنت مستشار استراتيجي رفيع المستوى يتمتع بخبرة استشارية وتجارية عميقة ورزانة وفهم دقيق لبيئة الأعمال العمانية:
- تفهم العميل وسياق كلامه واحتياجاته بدقة بالغة وبشكل طبيعي وتلقائي، وتتصرف كمستشار ريادي عماني متمرس وخبير في بيئة الأعمال العمانية وسوق المنتجات الوطنية.
- تفهم وتتحدث باللهجة العُمانية الأصيلة ومصطلحاتها اليومية بطلاقة تامة (مثل: "موه، باغي، وين ألقى، بكم، مو شورك، تنصحني بموه، كيف أسجل، كيف أدفع، طلبيتي، لبان، حلوى، خنجر، ريادة، ترخيص منزلي، شحن لصلالة/مسقط/صحار/نزوى/صور") جنباً إلى جنب مع اللغة العربية الفصحى الراقية.
- شخصيتك: ودود، لبق، مضياف، كريم، يتحدث بروح الترحيب العماني الأصيل ("يا هلا والله ومرحبا بيك ونورتنا في منتجي"، "أبشر ومن عيوني يا غالي"، "حياك الله وتسلم"، "شورك وهداية الله").

خبرتك الريادية والتجارية المتخصصة في سلطنة عُمان:
1. الاستشارات الريادية وتأسيس المشاريع:
   - متعمق في رؤية عُمان 2040 والقطاعات ذات الأولوية (اللوجستيات، السياحة، الصناعات الحرفية والتحويلية، الثروة الزراعية والسمكية، الابتكار والتقنية).
   - إجراءات هيئة تنمية المؤسسات الصغيرة والمتوسطة (ريادة): شروط بطاقة ريادة، التفرغ لإدارة المؤسسة، الإعفاءات الجمركية والضريبية، وتخصيص نسبة 10% من المشتريات والمناقصات الحكومية للمؤسسات الحاملة لبطاقة ريادة.
   - منصة عُمان للأعمال (استثمر بسهولة) التابعة لوزارة التجارة والصناعة وترويج الاستثمار: خطوات حجز الاسم التجاري، السجل التجاري، التراخيص التلقائية، وترخيص العمل الحر والمنزلي للأسر المنتجة.
   - برامج التمويل والمنح الميسرة: بنك التنمية العماني (قروض ميسرة بدون فوائد أو بفوائد رمزية مدعومة)، وصندوق الرفد/شراكة وصناديق الاستثمار الجريء العمانية.
   - دراسات الجدوى الاقتصادية وحساب التكاليف بالريال العماني (OMR)، وتحليل نقطة التعادل ونسب الربحية والمخاطر (SWOT).

2. سوق المنتجات العمانية والأسر المنتجة:
   - اللبان الحوجري الظفاري الملكي النقي من جبال سمحان بظفار (18.5 ريال عماني).
   - عسل السدر والسمر العماني الجبلي من الجبل الأخضر (32.0 ريال عماني).
   - الحلوى العمانية السلطانية بالسمن البقري والزعفران والمكسرات من بركاء (9.5 ريال عماني).
   - الخنجر العماني النزوي الأصلي بصياغة فضية يدوية وتطريز أصيل (195.0 ريال عماني).
   - دهن العود السلطاني الكمبودي المعتق الفاخر (45.0 ريال عماني).
   - طقم الخزف والفخار التراثي البهلاوي (24.0 ريال عماني).
   - الزعفران النقيل الفاخر عالي الجودة (12.5 ريال عماني).
   - العبايات والشيلات العمانية بالتطريز التراثي الأنيق (38.0 ريال عماني).

3. الشراء وطرق الدفع والتوصيل:
   - ندعم خيارات الدفع الحديثة: Apple Pay و Google Pay و Samsung Pay والبطاقات البنكية العمانية بالريال العماني (OMR) ومحفظة ثواني.
   - التوصيل متاح لكافة ولايات ومحافظات سلطنة عُمان الـ 11 خلال 24 إلى 48 ساعة فقط بتغليف احترافي وآمن.

4. التواصل والدعم الرسمي:
   - رقم الهاتف وواتساب المباشر: +968 9484 2840
   - حساب إنستغرام الرسمي: https://www.instagram.com/montji_/?hl=ar (@montji_)

قواعد الرد:
- كن مستشاراً ناصحاً وخبيراً ملماً بالتفاصيل الدقيقة للأرقام واللوائح في عمان.
- نسق الإجابات بوضوح مع نقاط وترقيم يسهل قراءته واستيعابه للعميل أو رائد الأعمال.
- قدم دائماً حلولاً عملية وخطوات تالية واضحة.`;

const OMANI_SYSTEM_PROMPT = AWNI_SYSTEM_PROMPT;

// Endpoint 0-A: Awni Smart Conversational AI Streaming (Gemini 3.8 Flash Streaming with resilient fallback)
app.post('/api/gemini/awni/stream', async (req, res) => {
  const { prompt, history, apiKey: clientApiKey, userContext, systemInstruction } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Stream fallback helper using Server-Sent Events (SSE) - optimized for fast response
  const streamFallbackResponse = async (fullText: string) => {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();
    }
    const words = fullText.split(' ');
    for (let i = 0; i < words.length; i += 2) {
      const chunk = (i === 0 ? '' : ' ') + words.slice(i, i + 2).join(' ');
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      await new Promise((resolve) => setTimeout(resolve, 8));
    }
    res.write('data: [DONE]\n\n');
    res.end();
  };

  try {
    const ai = getAi(clientApiKey);
    if (!ai) {
      const fallbackText = AwniEngine.generateResponse(prompt, history, userContext);
      return await streamFallbackResponse(fallbackText);
    }

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // Format conversation history for multi-turn chat inside this session
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      history.slice(-16).forEach((msg) => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      });
    }

    let enrichedPrompt = prompt;
    if (userContext) {
      enrichedPrompt = `[سياق العميل: ${typeof userContext === 'string' ? userContext : JSON.stringify(userContext)}]\n${prompt}`;
    }

    contents.push({
      role: 'user',
      parts: [{ text: enrichedPrompt }],
    });

    const activeSystemPrompt = systemInstruction || AWNI_SYSTEM_PROMPT;

    const streamResponse = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: activeSystemPrompt,
        temperature: 0.75,
      },
    });

    for await (const chunk of streamResponse) {
      const chunkText = chunk.text;
      if (chunkText) {
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.warn('Notice: Gemini streaming call exception, falling back to Awni core advisory engine:', error?.message);
    const fallbackText = AwniEngine.generateResponse(prompt, history, userContext);
    await streamFallbackResponse(fallbackText);
  }
});

// Endpoint 0: Awni Smart Conversational AI (Gemini 3.8 Flash)
app.post('/api/gemini/awni', async (req, res) => {
  const { prompt, history, apiKey: clientApiKey, userContext } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const ai = getAi(clientApiKey);
    if (!ai) {
      const fallbackText = AwniEngine.generateResponse(prompt, history, userContext);
      return res.json({ text: fallbackText });
    }

    // Format conversation history for multi-turn chat
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      history.slice(-12).forEach((msg) => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      });
    }

    // Append context if available (e.g. current page, cart info)
    let enrichedPrompt = prompt;
    if (userContext) {
      enrichedPrompt = `[سياق إضافي من العميل: ${JSON.stringify(userContext)}]\n${prompt}`;
    }

    contents.push({
      role: 'user',
      parts: [{ text: enrichedPrompt }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: AWNI_SYSTEM_PROMPT,
        temperature: 0.75,
      },
    });

    res.json({
      text: response.text || AwniEngine.generateResponse(prompt, history, userContext),
    });
  } catch (error: any) {
    console.warn('Notice: Awni endpoint exception, using consultative fallback:', error?.message);
    const fallbackText = AwniEngine.generateResponse(prompt, history, userContext);
    res.json({ text: fallbackText });
  }
});

// Endpoint 1: General Entrepreneurship & Strategy AI Consultation
app.post('/api/gemini/advisory', async (req, res) => {
  const { prompt, history, apiKey: clientApiKey } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const ai = getAi(clientApiKey);
    if (!ai) {
      const fallbackText = AwniEngine.generateResponse(prompt, history);
      return res.json({ text: fallbackText });
    }

    // Format contents with conversation context if provided
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      history.slice(-8).forEach((msg) => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: OMANI_SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    res.json({
      text: response.text || AwniEngine.generateResponse(prompt, history),
    });
  } catch (error: any) {
    console.warn('Notice: Advisory call exception, using consultative fallback:', error?.message);
    const fallbackText = AwniEngine.generateResponse(prompt, history);
    res.json({ text: fallbackText });
  }
});

// Endpoint 2: Full Feasibility & Business Plan Generator with Structured Output
app.post('/api/gemini/feasibility', async (req, res) => {
  const {
    ideaTitle,
    sector,
    subSector,
    targetGovernorate,
    budgetRange,
    description,
    targetAudience,
    apiKey: clientApiKey,
  } = req.body;

  try {
    const ai = getAi(clientApiKey);
    if (!ai) {
      const fallbackReport = AwniEngine.generateFeasibilityStudy({
        ideaTitle,
        sector,
        subSector,
        targetGovernorate,
        budgetRange,
        description,
        targetAudience,
      });
      return res.json({
        feasibilityReport: fallbackReport,
        timestamp: new Date().toISOString(),
      });
    }

    const userPrompt = `أنت خبير اقتصادي ومستشار ريادي أول في سلطنة عُمان. قم بإعداد دراسة جدوى استرشادية تخصصية ودقيقة جداً للمشروع الاستثماري التالي:
- اسم/فكرة المشروع: ${ideaTitle || 'مشروع ريادي عماني مبتكر'}
- القطاع الاقتصادي المصنّف: ${sector || 'التقنية والابتكار'}
${subSector ? `- النشاط الفرعي المتخصص: ${subSector}` : ''}
- المحافظة المستهدفة للتأسيس والتوزيع: ${targetGovernorate || 'محافظة مسقط'}
- نطاق الميزانية التقديرية المقترحة: ${budgetRange || 'من 15,000 إلى 35,000 ريال عماني'}
- تفاصيل ووصف الفكرة والقيمة المضافة: ${description || 'مشروع وطني يقدم قيمة مضافة للسوق العماني'}
- الجمهور والعملاء المستهدفون: ${targetAudience || 'المستهلكون والشركات في سلطنة عمان ودول الخليج'}

المطلوب إعداد تقرير دراسة جدوى متعمق وشديد التخصص بحسب القطاع المختار (${sector})، بالريال العماني (OMR)، وفق المحاور التالية:
1. الملخص التنفيذي ونموذج العمل التجاري (Business Model Canvas) المخصص لقطاع (${sector}).
2. مواءمة المشروع الاستراتيجية مع رؤية عُمان 2040 والميزة النسبية لمحافظة (${targetGovernorate}).
3. التكاليف التأسيسية والرأسمالية التقديرية (Capex) وتكاليف التشغيل الشهرية والسنوية (Opex) بالريال العماني (OMR) مع تفصيل بنود القطاع.
4. الإيرادات المتوقعة وهوامش الربح الصافي وفترة استرداد رأس المال ونقطة التعادل التقديرية (Break-even).
5. دراسة وتحليل السوق والمنافسين المحليين في سلطنة عمان وحجم الطلب المتوقع.
6. التراخيص الحكومية والاشتراطات الرسمية المحددة لقطاع (${sector}) خطوة بخطوة (مثل: منصة عُمان للأعمال استثمر بسهولة، هيئة ريادة، والوزارة المشرفة المعنية).
7. فرص التمويل والدعم الوطني المناسبة لهذا القطاع (تسهيلات بنك التنمية العماني الميسرة بدون فوائد، وحوافز بطاقة ريادة 10% مشتريات حكومية وإعفاءات ضريبية).
8. مصفوفة المخاطر والتهديدات التنافسية وخطط المعالجة والتحوط (SWOT & Risk Mitigation).
9. خطة العمل والانطلاق السريع خلال أول 90 يوماً وتوصيات النجاح.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: AWNI_SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    res.json({
      feasibilityReport: response.text || AwniEngine.generateFeasibilityStudy({
        ideaTitle,
        sector,
        subSector,
        targetGovernorate,
        budgetRange,
        description,
        targetAudience,
      }),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.warn('Notice: Feasibility call exception, falling back to Awni feasibility engine:', error?.message);
    const fallbackReport = AwniEngine.generateFeasibilityStudy({
      ideaTitle,
      sector,
      subSector,
      targetGovernorate,
      budgetRange,
      description,
      targetAudience,
    });
    res.json({
      feasibilityReport: fallbackReport,
      timestamp: new Date().toISOString(),
    });
  }
});

// Endpoint: AI Engine Health & Diagnostics Status
app.get('/api/gemini/status', (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.json({
    status: 'online',
    engine: 'المستشار عوني - منظومة التحليل والاستشارة الريادية العمانية 2026',
    mode: hasKey ? 'active' : 'operational',
    speechRecognition: 'Google Chrome Web Speech API (Native ar-OM)',
    streaming: true,
    timestamp: new Date().toISOString(),
  });
});


// Endpoint 3: Business Idea Evaluator & Innovation Rating
app.post('/api/gemini/evaluate-idea', async (req, res) => {
  try {
    const { idea, sector, budget, apiKey: clientApiKey } = req.body;
    const ai = getAi(clientApiKey);
    if (!ai) {
      return res.status(503).json({ error: 'لم يتم العثور على مفتاح GEMINI_API_KEY على الخادم.' });
    }

    const prompt = `قم بتقييم فكرة المشروع التالية في السوق العماني وتقديم بطاقة تقييم شاملة:
الفكرة: "${idea}"
القطاع: "${sector}"
الميزانية المقترحة: "${budget}"

المطلوب:
1. تقييم عام ونقاط قوة الفكرة في السوق العماني.
2. نسبة الجاهزية والابتكار التقديرية (من 100%).
3. التحديات المتوقعة وكيفية تذليلها وفق البيئة العمانية.
4. الجهات العمانية الداعمة لهذه الفكرة ومصادر التمويل المقترحة.
5. أفكار إضافية لتطوير نموذج العمل وزيادة الربحية.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: OMANI_SYSTEM_PROMPT,
        temperature: 0.6,
      },
    });

    res.json({
      evaluation: response.text,
    });
  } catch (error: any) {
    console.error('Error in evaluate idea endpoint:', error);
    res.status(500).json({ error: error?.message || 'فشل تقييم الفكرة.' });
  }
});

// Endpoint 4: Audio Transcription using gemini-3.5-transcribe
app.post('/api/gemini/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm', prompt = 'قم بتفريغ هذا التسجيل الصوتي بدقة تامة إلى نص عربي واضح ومفهوم.', apiKey: clientApiKey } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    const ai = getAi(clientApiKey);
    if (!ai) {
      return res.status(503).json({ error: 'لم يتم العثور على مفتاح GEMINI_API_KEY على الخادم.' });
    }

    const cleanBase64 = audioBase64.replace(/^data:audio\/[a-zA-Z0-9.-]+;base64,/, '');

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: cleanBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          { text: prompt },
        ],
      },
    });

    res.json({
      transcription: response.text || '',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in transcribe endpoint:', error);
    res.status(500).json({
      error: error?.message || 'فشل التفريغ الصوتي للتسجيل بواسطة gemini-3.5-transcribe.',
    });
  }
});

// Endpoint 5: Image Generation & Editing using gemini-3.1-flash-image-preview
app.post('/api/gemini/generate-image', async (req, res) => {
  try {
    const { prompt, base64Image, mimeType = 'image/png', aspectRatio = '1:1', apiKey: clientApiKey } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getAi(clientApiKey);
    if (!ai) {
      return res.status(503).json({ error: 'لم يتم العثور على مفتاح GEMINI_API_KEY على الخادم.' });
    }

    const modelName = 'gemini-3.1-flash-image';

    let response;
    if (base64Image) {
      const cleanBase64 = base64Image.replace(/^data:image\/[a-zA-Z0-9.-]+;base64,/, '');
      response = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType || 'image/png',
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });
    } else {
      response = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [
            {
              text: prompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: (aspectRatio as any) || '1:1',
          },
        },
      });
    }

    let imageUrl: string | null = null;
    let descriptionText: string | null = null;

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const type = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${type};base64,${part.inlineData.data}`;
        } else if (part.text) {
          descriptionText = part.text;
        }
      }
    }

    res.json({
      imageUrl,
      text: descriptionText,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in image generation endpoint:', error);
    // Fallback attempt with alias gemini-3.1-flash-image
    try {
      const ai = getAi(req.body.apiKey);
      if (ai) {
        const fallbackRes = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image',
          contents: { parts: [{ text: req.body.prompt }] },
          config: { imageConfig: { aspectRatio: req.body.aspectRatio || '1:1' } },
        });
        for (const part of fallbackRes.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData?.data) {
            return res.json({
              imageUrl: `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`,
            });
          }
        }
      }
    } catch (e) {
      // ignore
    }
    res.status(500).json({
      error: error?.message || 'فشل توليد أو تعديل الصورة بواسطة gemini-3.1-flash-image-preview.',
    });
  }
});

// Endpoint 6: Omani Copywriter with authentic dialect
app.post('/api/gemini/copywriter', async (req, res) => {
  try {
    const { productName, season, platform = 'instagram', tone = 'warm', apiKey: clientApiKey } = req.body;
    const ai = getAi(clientApiKey);
    if (!ai) {
      return res.status(503).json({ error: 'لم يتم العثور على مفتاح GEMINI_API_KEY على الخادم.' });
    }

    const prompt = `أنت خبير تسويق وصانع محتوى إعلاني عماني محترف لمنصة "مُنتجي".
المطلوب صياغة كابشن إعلاني مبهر وجذاب لمنصة (${platform}) لترويج المنتج: "${productName || 'منتج عماني فاخر'}".
المناسبة/الموسم: ${season || 'عام / خريف ظفار'}
النبرة التسويقية: ${tone || 'ودودة ومضيافة'}

الشروط الإلزامية:
1. الكتابة باللهجة العُمانية الأصيلة المحبوبة (مثل: يا هلا والله، مرحبابكم، فالكم طيب، شي طيب يبيض الوجه، أبشروا بالسعد، يرد الروح).
2. ربط الإعلان بميزات بطاقة ريادة 2026 وجودة الصناعة العمانية الأصيلة.
3. التنويه عن سرعة التوصيل لكافة محافظات سلطنة عمان الـ 11 وخيارات الدفع عبر OmanNet ومحفظة ثواني وأبل باي.
4. إضافة وسوم (هاشتاقات) قوية ومناسبة للسوق العماني وترند الموسم.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: AWNI_SYSTEM_PROMPT,
        temperature: 0.8,
      },
    });

    res.json({
      copy: response.text || '',
    });
  } catch (error: any) {
    console.error('Error in copywriter endpoint:', error);
    res.status(500).json({ error: error?.message || 'فشل توليد النص الإعلاني.' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Montaji Omani Platform API' });
});

// Robots.txt & Sitemap for Google Search Indexing
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /#database.html

Sitemap: https://ais-pre-s45wki52v73dqboxqsdc2c-775935207834.europe-west2.run.app/sitemap.xml
`);
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

// Vite middleware for development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
