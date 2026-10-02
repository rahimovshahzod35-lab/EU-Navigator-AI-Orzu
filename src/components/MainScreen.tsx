import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, Bot, Globe, CheckCircle2, 
  HelpCircle, Compass, ShieldCheck, Zap
} from 'lucide-react';
import { COUNTRIES, PROGRAMS } from '../data/programsData';
import { CountryInfo, Language } from '../types';
import { ProgramsChart } from './ProgramsChart';

interface MainScreenProps {
  onNavigateToShowcase: (filterCategory?: string, filterCountry?: string) => void;
  onNavigateToOrzu: (prefillPrompt?: string) => void;
  onNavigateToRoadmap: () => void;
  language: Language;
}

export const MainScreen: React.FC<MainScreenProps> = ({
  onNavigateToShowcase,
  onNavigateToOrzu,
  onNavigateToRoadmap,
  language,
}) => {
  const [selectedCountryModal, setSelectedCountryModal] = useState<CountryInfo | null>(null);

  // Profile Matcher States
  const [userEducation, setUserEducation] = useState<string>('school');
  const [userLanguage, setUserLanguage] = useState<string>('german_basic');
  const [userFinance, setUserFinance] = useState<string>('earn_immediate');
  const [matcherResult, setMatcherResult] = useState<string | null>(null);

  const t = {
    ru: {
      tag: 'Единый портал релокации в ЕС',
      heroTitle: 'Твой путь в Европу: от мечты до легального статуса',
      heroDesc: 'Полный каталог учебных, волонтерских и профессиональных программ в Германии, Польше, Чехии, Франции, Нидерландах, Австрии, Финляндии и странах Балтии.',
      exploreBtn: 'Исследовать программы',
      aiConsultBtn: 'Консультация с ИИ «Орзу»',
      countriesTitle: 'Популярные направления ЕС',
      countriesDesc: 'Проверенные пути иммиграции с гарантированным юридическим статусом',
      viewTracks: 'Смотреть треки',
      matcherTitle: 'Экспресс-подбор персонального трека релокации',
      matcherDesc: 'Укажите свои исходные данные — алгоритм подберет идеальную программу без скрытых комиссий',
      eduLabel: 'Ваше образование:',
      langLabel: 'Уровень языков:',
      finLabel: 'Финансовая цель:',
      matchBtn: 'Подобрать программу',
      close: 'Закрыть',
      askOrzuAboutCountry: 'Спросить Орзу об этой стране',
      stat1: '€950 – €1,450',
      stat1Label: 'Зарплата на Ausbildung в месяц',
      stat2: '21 месяц',
      stat2Label: 'До ПМЖ по EU Blue Card',
      stat3: '€0',
      stat3Label: 'Стоимость обучения в ВУЗах Чехии и ФРГ',
      stat4: '100% Легально',
      stat4Label: 'Официальные статьи AufenthG',
    },
    tg: {
      tag: 'Портали ягонаи муҳоҷират ба Иттиҳоди Аврупо',
      heroTitle: 'Роҳи ту ба Аврупо: аз орзу то мақоми қонунӣ',
      heroDesc: 'Маълумоти пурра оид ба барномаҳои таҳсил, ихтиёриён (FÖJ/FSJ) ва касбӣ дар Олмон, Полша, Чехия, Фаронса ва дигар кишварҳои ИА.',
      exploreBtn: 'Дидани барномаҳо',
      aiConsultBtn: 'Машварат бо ИИ «Орзу»',
      countriesTitle: 'Кишварҳои асосии ИА',
      countriesDesc: 'Роҳҳои санҷидашудаи муҳоҷирати қонунӣ',
      viewTracks: 'Дидани роҳҳо',
      matcherTitle: 'Интихоби фаврии барномаи мувофиқ',
      matcherDesc: 'Маълумоти худро интихоб кунед — мо беҳтарин роҳро нишон медиҳем',
      eduLabel: 'Маълумоти шумо:',
      langLabel: 'Сатҳи забон:',
      finLabel: 'Мақсади молиявӣ:',
      matchBtn: 'Интихоби барнома',
      close: 'Пӯшидан',
      askOrzuAboutCountry: 'Аз Орзу дар бораи ин кишвар пурсед',
      stat1: '€950 – €1,450',
      stat1Label: 'Маоши моҳонаи Ausbildung',
      stat2: '21 моҳ',
      stat2Label: 'Барои гирифтани иқомати доимӣ (ПМЖ)',
      stat3: '€0',
      stat3Label: 'Таҳсили ройгон дар донишгоҳҳои Чехия ва Олмон',
      stat4: '100% Қонунӣ',
      stat4Label: 'Бар асоси моддаҳои AufenthG',
    },
    en: {
      tag: 'Unified EU Relocation Portal',
      heroTitle: 'Your Pathway to Europe: From Aspiration to Legal Residence',
      heroDesc: 'Comprehensive directory of study, volunteer, and professional migration programs in Germany, Poland, Czechia, France, the Netherlands, Austria, and the Baltics.',
      exploreBtn: 'Explore Programs',
      aiConsultBtn: 'Consult with AI "Orzu"',
      countriesTitle: 'Popular EU Destinations',
      countriesDesc: 'Verified immigration pathways with guaranteed legal standing',
      viewTracks: 'View Tracks',
      matcherTitle: 'Instant Pathway Matcher',
      matcherDesc: 'Specify your current profile to find your ideal relocation track',
      eduLabel: 'Your Education:',
      langLabel: 'Language Proficiency:',
      finLabel: 'Financial Strategy:',
      matchBtn: 'Find Match',
      close: 'Close',
      askOrzuAboutCountry: 'Ask Orzu About This Country',
      stat1: '€950 – €1,450',
      stat1Label: 'Tuition at Public Unis in Czechia & Germany',
      stat2: '21 Months',
      stat2Label: 'To PR via EU Blue Card',
      stat3: '€0',
      stat3Label: 'Tuition at Public Unis in Czechia & Germany',
      stat4: '100% Legal',
      stat4Label: 'Direct AufenthG Articles',
    },
    de: {
      tag: 'Zentrales Portal für EU-Migration & Mobilität',
      heroTitle: 'Dein Weg nach Europa: Vom Traum zum legalen Status',
      heroDesc: 'Umfassender Katalog für Studien-, Freiwilligen- und Fachkräfteprogramme in Deutschland, Polen, Tschechien, Frankreich, den Niederlanden, Österreich und dem Baltikum.',
      exploreBtn: 'Programme erkunden',
      aiConsultBtn: 'Beratung mit KI "Orzu"',
      countriesTitle: 'Beliebte EU-Zielländer',
      countriesDesc: 'Geprüfte Einwanderungswege mit gesichertem Rechtsstatus',
      viewTracks: 'Wege ansehen',
      matcherTitle: 'Express-Finder für deinen Migrationsweg',
      matcherDesc: 'Gib deine Voraussetzungen ein – der Algorithmus findet das passende Programm',
      eduLabel: 'Dein Bildungsstand:',
      langLabel: 'Sprachkenntnisse:',
      finLabel: 'Finanzielle Strategie:',
      matchBtn: 'Passendes Programm finden',
      close: 'Schließen',
      askOrzuAboutCountry: 'Orzu über dieses Land befragen',
      stat1: '€950 – €1.450',
      stat1Label: 'Monatliche Ausbildungsvergütung',
      stat2: '21 Monate',
      stat2Label: 'Bis zur Niederlassungserlaubnis (Blaue Karte)',
      stat3: '€0',
      stat3Label: 'Studiengebühren an staatlichen Universitäten',
      stat4: '100% Legal',
      stat4Label: 'Aufenthaltsgesetz (AufenthG)',
    },
  }[language];

  const handleMatch = () => {
    if (userFinance === 'earn_immediate' && (userEducation === 'school' || userEducation === 'college')) {
      setMatcherResult('ausbildung');
    } else if (userLanguage === 'german_basic' && userEducation === 'school') {
      setMatcherResult('volunteer');
    } else if (userEducation === 'higher_tech' || userEducation === 'experience_tech') {
      setMatcherResult('bluecard');
    } else {
      setMatcherResult('chancenkarte');
    }
  };

  return (
    <div className="space-y-12 pb-12">
      {/* HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 p-6 sm:p-12 shadow-2xl">
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-12 bottom-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.tag}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight sm:leading-tight">
            {t.heroTitle}
          </h1>

          <p className="text-slate-300/90 text-base sm:text-lg leading-relaxed">
            {t.heroDesc}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigateToShowcase()}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-2 group cursor-pointer"
            >
              <span>{t.exploreBtn}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigateToOrzu('Салом! Помоги мне выбрать лучшую программу для релокации в ЕС с моим бэкграундом.')}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>{t.aiConsultBtn}</span>
            </button>

            <button
              onClick={onNavigateToRoadmap}
              className="px-5 py-3.5 rounded-xl text-slate-400 hover:text-white text-sm font-semibold transition flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>{language === 'ru' ? 'Открыть чек-лист' : language === 'tg' ? 'Харитаи роҳ' : 'Open Checklist'}</span>
            </button>
          </div>
        </div>

        {/* QUICK STATS CARDS */}
        <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60">
            <div className="text-blue-400 font-extrabold text-lg sm:text-xl">{t.stat1}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{t.stat1Label}</div>
          </div>
          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60">
            <div className="text-purple-400 font-extrabold text-lg sm:text-xl">{t.stat2}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{t.stat2Label}</div>
          </div>
          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60">
            <div className="text-emerald-400 font-extrabold text-lg sm:text-xl">{t.stat3}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{t.stat3Label}</div>
          </div>
          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60">
            <div className="text-cyan-400 font-extrabold text-lg sm:text-xl">{t.stat4}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{t.stat4Label}</div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE PROGRAMS DISTRIBUTION CHART (RECHARTS) */}
      <ProgramsChart
        onNavigateToShowcase={onNavigateToShowcase}
        language={language}
      />

      {/* TRACK MATCHER WIDGET */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Smart Matcher</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">{t.matcherTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">{t.matcherDesc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Education */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">{t.eduLabel}</label>
            <select
              value={userEducation}
              onChange={(e) => setUserEducation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="school">Школа (11 классов) / Аттестат</option>
              <option value="college">Колледж / Техникум (профобразование)</option>
              <option value="higher_tech">Высшее IT / Инженерное (MINT)</option>
              <option value="higher_humanities">Высшее гуманитарное / Экономика</option>
              <option value="experience_tech">Опыт в IT от 3 лет (без профильного ВУЗа)</option>
            </select>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">{t.langLabel}</label>
            <select
              value={userLanguage}
              onChange={(e) => setUserLanguage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="german_basic">Немецкий базовый (A1 – A2)</option>
              <option value="german_fluent">Немецкий уверенный (B1 – B2)</option>
              <option value="english_good">Только английский (B2 – C1)</option>
              <option value="zero_languages">Начинаю с нуля (готов учить)</option>
            </select>
          </div>

          {/* Finance */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">{t.finLabel}</label>
            <select
              value={userFinance}
              onChange={(e) => setUserFinance(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="earn_immediate">Хочу получать стипендию/зарплату с 1-го дня</option>
              <option value="low_budget">Минимальный бюджет (волонтерство с жильем)</option>
              <option value="has_capital">Есть средства на Sperrkonto (~€11,900)</option>
              <option value="job_offer">Ищу прямой рабочий контракт (оффер)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            onClick={handleMatch}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.matchBtn}</span>
          </button>

          {matcherResult && (
            <div className="w-full sm:w-auto flex-1 p-3.5 bg-blue-950/40 border border-blue-800/60 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400">Рекомендованный трек: </span>
                <span className="font-bold text-blue-400">
                  {matcherResult === 'ausbildung' && 'Duale Ausbildung (Стипендия €950-€1,250 + ссуз)'}
                  {matcherResult === 'volunteer' && 'FÖJ / BFD Волонтерство (Бесплатное жилье + карманные расходы)'}
                  {matcherResult === 'bluecard' && 'EU Blue Card (Голубая Карта ЕС — ПМЖ за 21 месяц)'}
                  {matcherResult === 'chancenkarte' && 'Chancenkarte (Карта возможностей ФРГ на 1 год)'}
                </span>
              </div>
              <button
                onClick={() => onNavigateToShowcase(matcherResult)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shrink-0 text-xs transition"
              >
                Открыть
              </button>
            </div>
          )}
        </div>
      </div>

      {/* COUNTRY SELECTION SECTION */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="text-blue-500 w-6 h-6" />
            <span>{t.countriesTitle}</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">{t.countriesDesc}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COUNTRIES.map((country) => (
            <div
              key={country.id}
              className="group bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-blue-500/50 transition-all duration-300 flex flex-col shadow-lg hover:shadow-blue-500/5"
            >
              {/* Card Header Image */}
              <div
                className="h-44 bg-cover bg-center relative group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url('${country.imageUrl}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/80 text-xs font-bold text-white border border-slate-800 backdrop-blur-md">
                  {country.flag} {country.name}
                </span>
                <span className="absolute bottom-3 left-4 text-xs font-medium text-slate-300">
                  {country.region}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition">
                    {country.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {country.description}
                  </p>

                  <div className="pt-2 space-y-1.5">
                    {country.popularTracks.slice(0, 2).map((track, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">{track}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCountryModal(country)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-200 transition cursor-pointer"
                  >
                    Инфо-карта
                  </button>
                  <button
                    onClick={() => onNavigateToShowcase(undefined, country.name.split(' ')[0])}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded-xl text-white transition cursor-pointer"
                    title={t.viewTracks}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COUNTRY DETAIL MODAL */}
      {selectedCountryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedCountryModal.flag}</span>
                <div>
                  <h3 className="font-bold text-xl text-white">{selectedCountryModal.name}</h3>
                  <span className="text-xs text-blue-400">{selectedCountryModal.region}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCountryModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p className="leading-relaxed">{selectedCountryModal.description}</p>
              
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Финансовые условия:</span>
                  <span className="font-semibold text-slate-200">{selectedCountryModal.minWageOrStipend}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Оценка проживания:</span>
                  <span className="font-semibold text-slate-200">{selectedCountryModal.livingCostEstimate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Требования к языку:</span>
                  <span className="font-semibold text-slate-200">{selectedCountryModal.languageReq}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-200 block mb-2">Ключевые иммиграционные треки:</span>
                <ul className="space-y-1.5 pl-1">
                  {selectedCountryModal.popularTracks.map((trk, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{trk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  const cName = selectedCountryModal.name;
                  setSelectedCountryModal(null);
                  onNavigateToOrzu(`Расскажи подробнее про все доступные программы переезда в ${cName} для гражданина СНГ.`);
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>{t.askOrzuAboutCountry}</span>
              </button>
              <button
                onClick={() => {
                  const cName = selectedCountryModal.name.split(' ')[0];
                  setSelectedCountryModal(null);
                  onNavigateToShowcase(undefined, cName);
                }}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition cursor-pointer"
              >
                {t.viewTracks}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
