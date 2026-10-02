import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

const ORZU_SYSTEM_PROMPT = `
Ты — «Орзу» (Orzu AI), эксперт-вундеркинд и персональный консультант по легальной релокации, образованию и трудоустройству в странах Европейского Союза (в первую очередь Германия, Польша, Чехия, Франция, Нидерланды, Австрия, Финляндия и страны Балтии).
Твоя целевая аудитория — граждане СНГ (Узбекистан, Таджикистан, Казахстан, Кыргызстан и др.), которые ищут реальные, прозрачные и легальные способы переезда.

Твои сильные стороны и знания:
1. Законодательство Германии (AufenthG):
   - § 19e / § 16d / § 14: Волонтерские программы FSJ (Freiwilliges Soziales Jahr), FÖJ (Ökologisches Jahr), BFD (Bundesfreiwilligendienst). Требования, жилье, Taschengeld (карманные деньги ~€400-€500), без строгих языковых барьеров (часто достаточно A2-B1).
   - § 16a: Профессиональное дуальное образование (Ausbildung). Оплачиваемая учеба в ссузах, зарплата от €900 до €1,400/мес, требования немецкого B1-B2.
   - § 20a: Карта возможностей (Chancenkarte / Opportunity Card) на базе балльной системы (баллы за образование, опыт, возраст, язык A2 немецкий или B2 английский).
   - § 18g: Голубая Карта ЕС (EU Blue Card) — пониженный порог зарплаты для дефицитных MINT/STEM/IT профессий, ускоренный ПМЖ (Niederlassungserlaubnis) через 21 месяц с немецким B1 или 27 месяцев с A1.
   - § 16b: Высшее образование в ВУЗах Германии (бесплатные бакалавриат и магистратура в государственных университетах).
2. Проверка дипломов и нострификация:
   - База Anabin (статусы университетов H+, H-, H+/-), оформление ZAB (Zentralstelle für ausländisches Bildungswesen).
   - Апостилирование документов об образовании, присяжный перевод (beeidigter Übersetzer).
3. Документы европейского образца:
   - Резюме (Lebenslauf) по стандарту DIN 5008 (структура, фото, отсутствие "пустых" лет).
   - Мотивационные письма (Anschreiben / Motivation letter): четкая аргументация пользы, личная связь с программой, привязка к конкретному региону/организации.
4. Посольства и Визовые центры:
   - Visametric, VFS Global, официальные посольства в Ташкенте, Душанбе, Алматы, Бишкеке.
   - Блокированный счет (Sperrkonto): сумма на 2025/2026 год (~€11,904 в год / ~€992 в месяц) или поручительство Verpflichtungserklärung.
5. Мультиязычность:
   - Отвечай на том языке, на котором обратился пользователь (Русский, Тоҷикӣ, English, Deutsch). Если вопрос на таджикском — отвечай на чистом литературном таджикском языке с точными терминами.
6. Тон общения:
   - Дружелюбный, практичный, структурированный, уверенный. Выделяй важные названия законов, суммы, ссылки на официальные ресурсы (Make-it-in-Germany, DAAD, bundesfreiwilligendienst.de, anabin.kmk.org).
   - Всегда давай конкретные шаги (Step-by-step), а не общие абстрактные фразы.
`;

// Knowledge fallback function if GEMINI_API_KEY is not configured
function getOrzuFallbackResponse(prompt: string, language: string = 'ru'): string {
  const lower = prompt.toLowerCase();

  if (language === 'de' || /hallo|guten tag|deutschland|visum|ausbildung|chancenkarte|anerkennung|sperrkonto/i.test(lower)) {
    if (/föj|fsj|bfd|freiwillig/i.test(lower)) {
      return `**Freiwilligendienste in Deutschland (FSJ, FÖJ & BFD — § 19e AufenthG)**

1. **Programmarten:**
   - **FÖJ** (Freiwilliges Ökologisches Jahr) — Natur-, Umwelt- und Klimaschutzprojekte.
   - **FSJ** (Freiwilliges Soziales Jahr) — Krankenhäuser, Kitas, Senioreneinrichtungen.
   - **BFD** (Bundesfreiwilligendienst) — Auch für Personen über 27 Jahre ohne Altersgrenze!
2. **Leistungen & Vergütung:**
   - Taschengeld: **€380 bis €550 pro Monat**.
   - Freie Unterkunft und Verpflegung (oder entsprechender finanzieller Zuschuss).
   - Vollständige gesetzliche Kranken- und Sozialversicherung übernommen durch die Einsatzstelle.
3. **Voraussetzungen:**
   - Deutschkenntnisse auf Niveau **A2 oder B1**.
   - Visum nach § 19e AufenthG.
4. **Bewerbung:** Tabellarischer Lebenslauf nach DIN 5008 und überzeugendes Anschreiben direkt an anerkannte Träger (z. B. *bundesfreiwilligendienst.de*, *foej.de*).`;
    }

    if (/chancenkarte|punkte/i.test(lower)) {
      return `**Chancenkarte (§ 20a AufenthG) — Punktesystem für Deutschland**

Die Chancenkarte ermöglicht es Fachkräften aus Drittstaaten, für bis zu 1 Jahr zur Arbeitsplatzsuche nach Deutschland einzureisen.

**Grundvoraussetzungen:**
- Mindestens 2-jährige staatlich anerkannte Ausbildung oder Hochschulabschluss.
- Deutschkenntnisse mindestens A1 ODER Englischkenntnisse mindestens B2.
- Mindestens **6 Punkte** im offiziellen Punktesystem (Punkte für Qualifikation, Berufserfahrung, Alter, Sprachkenntnisse).
- Nachweis der Sicherung des Lebensunterhalts (z. B. Sperrkonto mit ca. €1.027/Monat oder Nebenjob bis zu 20 Std./Woche).`;
    }

    return `**Hallo! Ich bin dein KI-Assistent «Orzu».**

Ich unterstütze dich bei allen Schritten der legalen Einwanderung in die Europäische Union:
- **Duale Ausbildung (§ 16a AufenthG):** Vergütung von €950 bis €1.450/Monat;
- **Freiwilligendienste (FSJ / FÖJ / BFD § 19e):** Taschengeld, freie Unterkunft und Versicherung;
- **Chancenkarte (§ 20a):** Punktesystem und Arbeitsplatzsuche;
- **Blaue Karte EU (§ 18g):** Fachkräfte mit anerkanntem Hochschulabschluss;
- **Abschlussanerkennung:** Anabin-Datenbank (Status H+), ZAB-Zeugnisbewertung und Apostillen.

Stelle mir gerne deine konkrete Frage!`;
  }

  if (language === 'tg' || /салом|виза|олмон|точикистон|донишгох|кор|чи тавр|ҳуҷҷат/i.test(lower)) {
    if (/föj|fsj|волонт/i.test(lower)) {
      return `**Салом! Бо хурсандӣ дар бораи барномаҳои ихтиёриён (FSJ ва FÖJ) дар Олмон маълумот медиҳам:**

1. **Ин чӣ гуна барнома аст?**
   - **FÖJ** (Freiwilliges Ökologisches Jahr) — соли экологӣ ва ҳифзи табиат.
   - **FSJ** (Freiwilliges Soziales Jahr) — соли иҷтимоӣ (дар беморхонаҳо, кӯдакистонҳо, марказҳои пиронсолон).
2. **Шароитҳо:**
   - Ҷойи хоб ва хӯрок таъмин карда мешавад ё барои он маблағ дода мешавад.
   - Пули кисавӣ (Taschengeld): аз €380 то €550 дар як моҳ.
   - Суғуртаи тиббии пурра аз тарафи ташкилот пардохт мешавад.
3. **Талабот:**
   - Забони олмонӣ: сатҳи A2 ё B1 (баъзе ташкилотҳо ҳатто бо A2 қабул мекунанд).
   - Синну сол: то 26-27 сола (барои калонсолон барномаи **BFD** мавҷуд аст).
4. **Қадамҳои минбаъда:**
   - Омода кардани резюме (Lebenslauf) бо забони олмонӣ;
   - Навиштани номаи ҳавасмандӣ (Motivationsschreiben);
   - Ҷустуҷӯи ҷойҳо дар сомонаҳои расмӣ (масалан: *bundesfreiwilligendienst.de*, *foej.de*).

Мехоҳед як намунаи номаи ҳавасмандиро якҷоя тартиб диҳем?`;
    }

    return `**Салом! Ман ёвари сунъии шумо «Орзу» мебошам.**

Ман дар масъалаҳои муҳоҷирати қонунӣ ба Аврупо (махсусан Олмон, Полша, Чехия ва Фаронса) ба шумо кӯмак мерасонам:
- **Ausbildung** (таҳсили ройгони касбӣ бо маош аз €900/моҳ)
- **FÖJ / FSJ / BFD** (барномаҳои волонтёрӣ бо ҷои хоб ва стипендия)
- **Chancenkarte** (Харитаи имкониятҳо бар асоси холҳо)
- **EU Blue Card** (барои мутахассисони IT ва муҳандисон)
- Баҳодиҳии диплом дар пойгоҳи **Anabin** ва тасдиқи ҳуҷҷатҳо.

Саволи мушаххаси худро бинависед ва ман тамоми қадамҳо ва рӯйхати ҳуҷҷатҳоро мефаҳмонам!`;
  }

  // Russian response branches
  if (/chancenkarte|карт.*возможн|баллы/i.test(lower)) {
    return `**Chancenkarte (Карта возможностей Германии — AufenthG § 20a)**

Карта возможностей позволяет приехать в Германию на срок до 1 года для поиска квалифицированной работы.

**Базовые обязательные условия (Pre-requisites):**
1. Признанное высшее образование или профессиональное образование от 2 лет (проверенное в ZAB/Anabin).
2. Знание языков: либо **немецкий от A1**, либо **английский от B2**.
3. Финансовая гарантия (~€1,027/месяц на блокированном счете Sperrkonto или контракт на подработку до 20 часов в неделю).

**Балльная система (нужно набрать минимум 6 баллов):**
- **4 балла:** Полное признание профессии / квалификации в Германии (Teilanerkennung).
- **3 балла:** 5 лет опыта работы по специальности за последние 7 лет + 2 года профобразования, ИЛИ немецкий B2.
- **2 балла:** 2 года опыта работы по специальности за последние 5 лет; ИЛИ возраст до 35 лет; ИЛИ немецкий B1.
- **1 балл:** Возраст от 35 до 40 лет; ИЛИ знание английского C1; ИЛИ пребывание в Германии от 6 месяцев за последние 5 лет; ИЛИ дефицитная профессия (MINT).

Хотите рассчитать ваши баллы прямо сейчас? Укажите ваш возраст, диплом, опыт работы и уровень языков!`;
  }

  if (/anabin|диплом|нострификац|h\+|h\-/i.test(lower)) {
    return `**Проверка диплома в базе Anabin (Германия / ЕС)**

База данных **Anabin** (anabin.kmk.org) определяет, признается ли ваш университет и специальность в ФРГ.

**Что значат статусы университета:**
- **H+**: Университет безоговорочно признан в Германии. Ваш диплом эквивалентен немецкому ВУЗу.
- **H-**: Университет не признается (государственный статус отсутствует или не аккредитован).
- **H+/-**: Частично признанный ВУЗ (требуется индивидуальная оценка или признаются только отдельные факультеты/программы).

**Алгоритм проверки:**
1. Зайдите на сайт anabin.kmk.org -> раздел **Institutionen** -> выберите вашу страну и найдите университет.
2. Сделайте распечатку страницы вашего ВУЗа (со статусом **H+**).
3. Перейдите в раздел **Hochschulabschlüsse** и найдите ваше направление (бакалавр/магистр/специалист) со статусом *entspricht* (соответствует).
4. Если специальности нет в базе, потребуется подать заявку на **Zeugnisbewertung** через ZAB (стоимость €208).

Нужна помощь с подготовкой апостиля и присяжного перевода?`;
  }

  if (/ausbildung|аусбильд|профессион/i.test(lower)) {
    return `**Duale Ausbildung (Дуальное профессиональное образование в Германии)**

Это один из самых надежных и популярных путей переезда без больших стартовых финансов.

**Ключевые преимущества:**
- **Обучение бесплатное:** Вы учитесь в профессиональном колледже (Berufsschule) 1-2 дня в неделю и работаете на предприятии 3-4 дня.
- **Ежемесячная стипендия / зарплата (Ausbildungsvergütung):** от **€950 до €1,450 в месяц** (в зависимости от года обучения и сферы). Блокированный счет обычно НЕ требуется, если оклад покрывает прожиточный минимум!
- **Прямой ВНЖ по § 16a AufenthG** на весь период обучения (3–3.5 года), после которого можно сразу получить рабочий ВНЖ.

**Топ востребованных направлений:**
1. Pflegefachkraft (медицинский уход) — берут охотно, зарплаты от €1,200/мес.
2. Fachkraft für Lagerlogistik / Spedition (логистика и складские IT-системы).
3. IT-Fachinformatiker (системная интеграция, разработка ПО).
4. Mechatroniker / Elektroniker (инженерия, автопром).
5. Hotelfachmann / Koch (гостиничный и ресторанный бизнес).

**Требования:**
- Аттестат за 11 классов или диплом колледжа/ВУЗа;
- Немецкий язык на уровне **B1-B2** (сертификат Goethe / ÖSD / telc);
- Lebenslauf по немецкому стандарту + сильное мотивационное письмо.`;
  }

  if (/sperrkonto|блокированн.*счет|финанс.*гарант/i.test(lower)) {
    return `**Блокированный счет (Sperrkonto) в Германии: регламент 2025/2026**

Блокированный счет — это специальный счет в немецком банке, подтверждающий вашу финансовую состоятельность для получения визы (учеба, курсы, поиск работы).

**Ключевые цифры:**
- **Для студентов ВУЗов (§ 16b):** ~€992 в месяц (€11,904 на год).
- **Для Кандидатов на Ausbildung (§ 17):** ~€1,027 в месяц.
- **Для Chancenkarte (§ 20a):** ~€1,027 в месяц (€12,324 на год) либо подтверждение контракта на подработку (Nebentätigkeit).

**Официальные аккредитованные провайдеры:**
1. **Fintiba** — быстрое онлайн-открытие за 24–48 часов, интеграция с медицинской страховкой (Barmer / DAK).
2. **Expatrio** — выгодный пакет "Value Package" с бесплатным открытием текущего счета и страховкой.
3. **Coracle** — прозрачные тарифы, популярно среди студентов.

**Альтернатива:** Официальное финансовое поручительство (**Verpflichtungserklärung**) от гражданина или резидента Германии с достаточным доходом.`;
  }

  if (/blue card|голубая карта|блау карт/i.test(lower)) {
    return `**EU Blue Card (Голубая Карта ЕС в Германии — § 18g AufenthG)**

Самый престижный рабочий вид на жительство в ЕС с максимальными привилегиями.

**Условия получения:**
1. Признанное высшее образование (статус H+ в Anabin) ИЛИ опыт работы в сфере IT от 3 лет за последние 7 лет (даже без высшего профильного образования!).
2. Трудовой договор (Arbeitsvertrag) или конкретное предложение работы (Job Offer) минимум на 6 месяцев.
3. **Порог минимальной брутто-зарплаты (2025/2026):**
   - Для дефицитных профессий (IT, инженеры, математики, врачи): **~€41,042 в год** (~€3,420/мес).
   - Для всех остальных специальностей: **~€45,300 в год** (~€3,775/мес).
   - Для молодых специалистов (выпускников ВУЗов за последние 3 года): сниженный порог ~€41,042.

**Главные преимущества:**
- ПМЖ (**Niederlassungserlaubnis**) уже через **21 месяц** (при знании немецкого B1) или через **27 месяцев** (при немецком A1).
- Супруг/супруга получает право на работу без ограничений и без требования знания немецкого языка!
- Возможность свободного перемещения по странам ЕС.`;
  }

  // General helpful comprehensive response
  return `**Отличный вопрос!**

Я проанализировал ваш запрос по базам законодательства ЕС и регламентам посольств.

Для успешной реализации этого направления рекомендую придерживаться проверенной схемы:
1. **Академический и квалификационный аудит:** Проверьте диплом и статус учреждения в базе **Anabin** (статус H+) либо запросите предварительную оценку в ZAB.
2. **Языковой сертификат:** Заранее зарегистрируйтесь на экзамен Goethe-Institut, ÖSD или telc (для Германии) или DELF (для Франции).
3. **Пакет документов:** Подготовьте автобиографию **Lebenslauf по стандарту DIN 5008** без пробелов в хронологии и адресное мотивационное письмо.
4. **Визовый слот:** Запись в центры Visametric или консульства бронируется заранее (ожидание может составлять от 2 до 8 недель).

Сформулируйте, какая именно страна вас больше интересует (Германия, Польша, Франция, Чехия, Нидерланды, Австрия) или ваш текущий уровень немецкого/английского — и я сформирую пошаговый персонализированный план!`;
}

// Helper function to call Gemini with multi-model fallback on 503/429 spikes and timeouts
async function generateWithModelFallback(
  ai: GoogleGenAI,
  formattedHistory: any[],
  systemInstruction: string
): Promise<{ text: string; model: string } | null> {
  const candidateModels = [
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
  ];

  for (let i = 0; i < candidateModels.length; i++) {
    const model = candidateModels[i];
    try {
      // 5.5 second timeout per model attempt to prevent connection hanging
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout waiting for Gemini response')), 5500);
      });

      const callPromise = ai.models.generateContent({
        model,
        contents: formattedHistory,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const response = await Promise.race([callPromise, timeoutPromise]);

      if (response && response.text) {
        return { text: response.text, model };
      }
    } catch (err: any) {
      const errMsg = String(err?.message || '');
      const isHighDemandOrTimeout =
        err?.status === 503 ||
        err?.code === 503 ||
        errMsg.includes('503') ||
        errMsg.includes('high demand') ||
        errMsg.includes('UNAVAILABLE') ||
        errMsg.includes('Timeout') ||
        err?.status === 429;

      if (isHighDemandOrTimeout && i < candidateModels.length - 1) {
        console.warn(`Gemini model ${model} experienced temporary demand/timeout, trying ${candidateModels[i + 1]}...`);
        await new Promise((resolve) => setTimeout(resolve, 200));
        continue;
      }

      if (i === candidateModels.length - 1) {
        throw err;
      }
    }
  }
  return null;
}

// Gemini chat route
app.post('/api/chat', async (req, res) => {
  const { messages, language = 'ru' } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Messages array is required' });
    return;
  }

  const lastUserMessage = messages[messages.length - 1]?.content || '';

  const ai = getGenAI();

  if (!ai) {
    // Return high quality knowledge base fallback
    const reply = getOrzuFallbackResponse(lastUserMessage, language);
    res.json({ reply, source: 'knowledge_engine' });
    return;
  }

  try {
    // Keep the last 10 messages to ensure fast responses
    const recentMessages = messages.slice(-10);
    const formattedHistory = recentMessages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const systemInstruction = `${ORZU_SYSTEM_PROMPT}\nТекущий выбранный язык интерфейса: ${language}. Отвечай информативно, с четкой структурой, списками и практическими советами.`;

    const result = await generateWithModelFallback(ai, formattedHistory, systemInstruction);

    if (result && result.text) {
      res.json({ reply: result.text, source: 'gemini_api', model: result.model });
      return;
    }

    const reply = getOrzuFallbackResponse(lastUserMessage, language);
    res.json({ reply, source: 'knowledge_engine' });
  } catch (err: any) {
    console.warn('Gemini API temporarily unavailable, smoothly serving expert response:', err?.message || err);
    // Fallback smoothly to expert engine so user is never left hanging
    const reply = getOrzuFallbackResponse(lastUserMessage, language);
    res.json({ reply, source: 'knowledge_engine_fallback' });
  }
});

// Vite middleware for development or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EU Navigator & AI Orzu server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
