import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, Sparkles, Copy, Check, Volume2, VolumeX, 
  Trash2, RefreshCw, AlertCircle, ArrowDown
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, Language } from '../types';

interface OrzuChatProps {
  initialPrompt?: string;
  language: Language;
}

const INITIAL_GREETING: Record<Language, string> = {
  ru: `Салом! Я ИИ-ассистент **Орзу** — твой персональный вундеркинд по легальной релокации в Европейский Союз.

Я детально знаю:
- **Законодательство ФРГ:** статьи AufenthG (§ 19e для FÖJ/BFD, § 16a для Ausbildung, § 20a для Chancenkarte, § 18g для EU Blue Card);
- **Проверку дипломов:** базу Anabin (статусы H+, H-), оценку ZAB и апостилирование;
- **Немецкие стандарты документов:** резюме Lebenslauf по DIN 5008 и мотивационные письма;
- **Визовые регламенты:** Visametric, VFS Global, блокированные счета Sperrkonto (€11,904/год).

Чем помочь тебе прямо сейчас? Задай любой вопрос или выбери быструю тему ниже!`,

  tg: `Салом! Ман ёвари зеҳни сунъии шумо **«Орзу»** ҳастам — машваратчии шахсии шумо оид ба муҳоҷирати қонунӣ ба Иттиҳоди Аврупо.

Ман оид ба масъалаҳои зерин машварат дода метавонам:
- **Барномаҳои волонтёрии FÖJ ва FSJ дар Олмон** (бо таъмини хобгоҳ ва пули кисавӣ);
- **Ausbildung** — таҳсили ройгони касбӣ бо гирифтани маош аз €900 то €1,400/моҳ;
- **Харитаи имкониятҳо (Chancenkarte)** ва ҳисоби холҳо;
- **EU Blue Card** барои барномасозон ва муҳандисон;
- Санҷиши диплом дар пойгоҳи расмии **Anabin**.

Саволи худро бинависед ё аз мавзӯъҳои зер интихоб кунед!`,

  en: `Hello! I am your AI assistant **Orzu** — your expert guide to legal relocation, dual studies, and career pathways in the European Union.

I specialize in:
- **German Residence Act (AufenthG):** § 19e (FÖJ/BFD), § 16a (Ausbildung), § 20a (Opportunity Card / Chancenkarte), § 18g (EU Blue Card);
- **Credential Evaluation:** Anabin database (H+ status), ZAB Statements of Comparability, and apostille verification;
- **DIN 5008 Standard:** German-style Lebenslauf CVs and persuasive cover letters (Anschreiben);
- **Embassy Protocols:** Visametric appointment strategies and blocked accounts (Sperrkonto).

How can I assist you on your European journey today?`,

  de: `Hallo! Ich bin dein KI-Assistent **Orzu** — dein persönlicher Experte für legale Einwanderung, duale Ausbildung, Studium und Fachkräfteprogramme in der Europäischen Union.

Ich unterstütze dich bei:
- **Aufenthaltsgesetz (AufenthG):** § 19e (Freiwilligendienste FÖJ/BFD), § 16a (Duale Ausbildung), § 20a (Chancenkarte), § 18g (EU Blue Card);
- **Anerkennung ausländischer Abschlüsse:** Anabin-Datenbank (Status H+, H-), ZAB-Zeugnisbewertung und Apostillen;
- **Bewerbungsstandards nach DIN 5008:** Tabellarischer Lebenslauf, überzeugendes Motivationsschreiben (Anschreiben);
- **Visumverfahren:** Termine bei Visametric/VFS Global, Nachweis der Lebenshaltungskosten & Sperrkonto (€11.904/Jahr).

Wie kann ich dir heute auf deinem Weg nach Europa helfen?`,
};

const SUGGESTED_PROMPTS: Record<Language, string[]> = {
  ru: [
    '🇩🇪 Как уехать на FÖJ/FSJ без свободного немецкого?',
    '🎯 Сколько баллов нужно для Chancenkarte и как их набрать?',
    '🎓 Как проверить диплом в базе Anabin (H+ / H-)?',
    '📄 Напиши структуру мотивационного письма для Ausbildung',
    '💳 Минимальный оклад для EU Blue Card в 2025/2026',
    '🇹🇯 Тоҷикӣ: Чӣ тавр ба барномаи Ausbildung дохил шудан мумкин?',
  ],
  tg: [
    '🇹🇯 Чӣ тавр ба барномаи волонтёрии FÖJ/FSJ дохил шудан мумкин?',
    '🎯 Харитаи имкониятҳо (Chancenkarte) чӣ гуна кор мекунад?',
    '🎓 Санҷиши диплом дар Anabin (H+ / H-)',
    '📄 Навиштани мактуби ҳавасмандӣ (Motivationsschreiben)',
    '💶 Ҳисоби маблағ барои Sperrkonto дар соли 2025/2026',
    '🇩🇪 Талаботи забон барои Ausbildung дар соҳаи IT ва ҳамширагӣ',
  ],
  en: [
    '🇩🇪 How to apply for FÖJ/FSJ volunteer programs with basic German?',
    '🎯 How does the German Opportunity Card (Chancenkarte) point system work?',
    '🎓 Step-by-step guide to Anabin university degree recognition (H+ / H-)',
    '📄 Structure of a German standard cover letter (Anschreiben DIN 5008)',
    '💳 Minimum salary requirements for EU Blue Card in Germany',
    '🏦 Blocked account (Sperrkonto) proof of financial funds',
  ],
  de: [
    '🇩🇪 Wie bewerbe ich mich für einen Freiwilligendienst (FÖJ/FSJ/BFD)?',
    '🎯 Chancenkarte (§ 20a AufenthG): Punkteberechnung und Voraussetzungen',
    '🎓 Anerkennung ausländischer Bildungsabschlüsse via Anabin & ZAB',
    '📄 Aufbau eines DIN 5008 konformen Anschreibens für Ausbildung',
    '💳 Mindestgehalt für die Blaue Karte EU in Engpassberufen',
    '🏦 Sperrkonto-Voraussetzungen für das Visumverfahren',
  ],
};

export const OrzuChat: React.FC<OrzuChatProps> = ({ initialPrompt, language }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('eu_navigator_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'msg-init',
        sender: 'bot',
        text: INITIAL_GREETING[language] || INITIAL_GREETING.ru,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'knowledge_engine',
      },
    ];
  });

  const [inputVal, setInputVal] = useState<string>(initialPrompt || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speechActive, setSpeechActive] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Sync initialPrompt if provided externally
  useEffect(() => {
    if (initialPrompt) {
      setInputVal(initialPrompt);
    }
  }, [initialPrompt]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('eu_navigator_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customText?: string) => {
    const query = (customText || inputVal).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputVal('');
    setIsLoading(true);

    try {
      const apiPayload = newHistory.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiPayload,
          language,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const botResponse: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Информация принята. Чем еще помочь?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
      };

      setMessages((prev) => [...prev, botResponse]);

      // Read out aloud if speech was enabled
      if (speechActive && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const cleanText = (data.reply || '').replace(/[#*`_]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 300));
        utterance.lang = language === 'en' ? 'en-US' : language === 'de' ? 'de-DE' : 'ru-RU';
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error('Failed to communicate with Orzu server:', err);
      const fallbackMsgs: Record<Language, string> = {
        ru: `**Орзу:** Я зафиксировал ваш вопрос: "*${query}*".\n\nПо официальным миграционным протоколам ЕС рекомендую в первую очередь проверить соответствие диплома в системе **Anabin** и подготовить резюме стандарта **DIN 5008**. Попробуйте повторить запрос или выбрать тему из быстрых подсказок!`,
        tg: `**Орзу:** Саволи шуморо қабул кардам: "*${query}*".\n\nАз рӯи қоидаҳои расмии Иттиҳоди Аврупо тавсия медиҳам, ки пеш аз ҳама дипломи худро дар пойгоҳи **Anabin** санҷед ва резюмеро аз рӯи стандарти **DIN 5008** омода кунед. Саволро дубора бинависед ё аз мавзӯъҳои омода интихоб кунед!`,
        en: `**Orzu:** I noted your query: "*${query}*".\n\nAccording to official EU migration regulations, I recommend first checking your degree recognition in the **Anabin** database and formatting your CV to **DIN 5008** standards. Please try again or select a suggested topic below!`,
        de: `**Orzu:** Ich habe deine Frage erfasst: "*${query}*".\n\nGemäß den offiziellen EU-Einwanderungsrichtlinien empfehle ich zunächst die Überprüfung deines Abschlusses in der **Anabin**-Datenbank sowie einen Lebenslauf nach **DIN 5008**. Bitte wiederhole die Anfrage oder wähle eines der vorbereiteten Themen aus!`,
      };
      const fallbackResponse: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: fallbackMsgs[language] || fallbackMsgs.ru,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'knowledge_engine_fallback',
      };
      setMessages((prev) => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    const confirmMsg = {
      ru: 'Очистить историю диалога с Орзу?',
      tg: 'Таърихи сӯҳбат бо Орзу тоза карда шавад?',
      en: 'Clear chat history with Orzu?',
      de: 'Chatverlauf mit Orzu wirklich löschen?',
    }[language];

    if (window.confirm(confirmMsg)) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setMessages([
        {
          id: 'msg-init-reset',
          sender: 'bot',
          text: INITIAL_GREETING[language] || INITIAL_GREETING.ru,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'knowledge_engine',
        },
      ]);
    }
  };

  const toggleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (speechActive) {
        window.speechSynthesis.cancel();
        setSpeechActive(false);
      } else {
        setSpeechActive(true);
      }
    }
  };

  const chatUiText = {
    ru: {
      subtitle: 'Вундеркинд-Консультант: Поиск программ, параграфы AufenthG, Lebenslauf & Sperrkonto',
      topics: 'Темы:',
      analyzing: 'Орзу анализирует визовые регламенты ЕС...',
      placeholder: 'Спроси Орзу о визах, Chancenkarte, FÖJ, Anabin или формулировках мотивационных писем...',
      send: 'Отправить',
    },
    tg: {
      subtitle: 'Машваратчии доно: Барномаҳои Аврупо, қонунҳои AufenthG, Lebenslauf ва Sperrkonto',
      topics: 'Мавзӯъҳо:',
      analyzing: 'Орзу санадҳои муҳоҷирати ИА-ро таҳлил мекунад...',
      placeholder: 'Аз Орзу дар бораи визаҳо, Chancenkarte, Ausbildung, FÖJ ё Anabin пурсед...',
      send: 'Фиристодан',
    },
    en: {
      subtitle: 'Expert AI Advisor: EU programs, AufenthG articles, DIN 5008 CV & Sperrkonto',
      topics: 'Topics:',
      analyzing: 'Orzu is analyzing EU immigration regulations...',
      placeholder: 'Ask Orzu about EU visas, Chancenkarte, Ausbildung, FÖJ, Anabin or cover letters...',
      send: 'Send',
    },
    de: {
      subtitle: 'KI-Berater: AufenthG-Paragraphen, Anerkennung, DIN 5008 Lebenslauf & Sperrkonto',
      topics: 'Themen:',
      analyzing: 'Orzu analysiert die EU-Aufenthaltsbestimmungen...',
      placeholder: 'Frage Orzu nach Visa, Chancenkarte, Ausbildung, FÖJ, Anabin oder Anschreiben...',
      send: 'Senden',
    },
  }[language];

  return (
    <div className="h-[calc(100vh-10rem)] min-h-[580px] flex flex-col bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
      
      {/* BOT HEADER */}
      <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Орзу (Orzu AI)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                EU Specialist
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {chatUiText.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio read-aloud toggle */}
          <button
            onClick={toggleSpeech}
            className={`p-2 rounded-xl border text-xs font-semibold transition ${
              speechActive
                ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={speechActive ? 'Голосовое озвучивание включено' : 'Включить озвучивание ответов'}
          >
            {speechActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Clear history */}
          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition"
            title="Очистить чат"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CHAT MESSAGES SCROLL AREA */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-[13px] leading-relaxed relative group shadow-md ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-800/95 border border-slate-700/60 text-slate-200 rounded-tl-none space-y-2'
              }`}
            >
              {msg.sender === 'bot' ? (
                <div className="markdown-body space-y-2">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}

              {/* Message metadata & actions */}
              <div
                className={`flex items-center justify-between gap-4 pt-1.5 mt-1 border-t text-[10px] ${
                  msg.sender === 'user'
                    ? 'border-blue-500/40 text-blue-200'
                    : 'border-slate-700/60 text-slate-400'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.sender === 'bot' && (
                  <div className="flex items-center gap-2">
                    {msg.source && (
                      <span className="font-mono text-[9px] opacity-70">
                        {msg.source === 'gemini_api' ? 'Gemini 3.8 Flash' : 'Expert Knowledge'}
                      </span>
                    )}
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-white transition cursor-pointer"
                      title="Скопировать ответ"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-800/90 border border-slate-700/60 p-4 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[11px] text-slate-300">{chatUiText.analyzing}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* SUGGESTED PILLS */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 overflow-x-auto custom-scrollbar flex items-center gap-2 whitespace-nowrap">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3 text-cyan-400" /> {chatUiText.topics}
        </span>
        {(SUGGESTED_PROMPTS[language] || SUGGESTED_PROMPTS.ru).map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-[11px] transition cursor-pointer shrink-0 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* CHAT INPUT FORM */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isLoading}
            placeholder={chatUiText.placeholder}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer shrink-0"
          >
            <span>{chatUiText.send}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
