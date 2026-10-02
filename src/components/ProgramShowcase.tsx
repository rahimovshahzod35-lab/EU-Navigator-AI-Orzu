import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, CheckCircle2, ArrowUpRight, Bot, 
  ExternalLink, Sparkles, BookOpen, Clock, Banknote, ShieldAlert
} from 'lucide-react';
import { PROGRAMS } from '../data/programsData';
import { Program, Language } from '../types';

interface ProgramShowcaseProps {
  initialCategoryFilter?: string;
  initialCountryFilter?: string;
  onNavigateToOrzu: (prefillPrompt?: string) => void;
  onNavigateToRoadmap: () => void;
  language: Language;
}

export const ProgramShowcase: React.FC<ProgramShowcaseProps> = ({
  initialCategoryFilter,
  initialCountryFilter,
  onNavigateToOrzu,
  onNavigateToRoadmap,
  language,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryFilter || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountryFilter || 'all');
  const [detailModalProgram, setDetailModalProgram] = useState<Program | null>(null);

  const t = {
    ru: {
      badge: 'Официальный Реестр Программ',
      title: 'Витрина легальных программ ЕС',
      desc: 'Актуальные категории для граждан с разбором статей законов (AufenthG), финансовыми условиями и прямыми ссылками',
      searchPlaceholder: 'Поиск по названию, профессии, параграфу...',
      found: 'Найдено программ:',
      reset: 'Сбросить фильтры',
      noFound: 'По вашему запросу программ не найдено',
      tryReset: 'Попробуйте изменить параметры поиска или категорию',
      detailsBtn: 'Подробнее о программе',
      askOrzu: 'Спросить Орзу об этой программе',
      roadmapBtn: 'Открыть дорожную карту',
      categories: [
        { id: 'all', label: 'Все программы' },
        { id: 'volunteer', label: 'Волонтерство (FSJ/FÖJ/BFD)' },
        { id: 'ausbildung', label: 'Аусбильдинг / Dual Studies' },
        { id: 'chancenkarte', label: 'Карта возможностей (Chancenkarte)' },
        { id: 'bluecard', label: 'Голубая Карта (EU Blue Card)' },
        { id: 'university', label: 'Бесплатные ВУЗы & Гранты' },
        { id: 'tech_nomad', label: 'IT & Digital Nomad' },
      ],
    },
    tg: {
      badge: 'Феҳристи расмии барномаҳо',
      title: 'Барномаҳои қонунии Иттиҳоди Аврупо',
      desc: 'Барномаҳои таҳсил, ихтиёриён ва касбӣ бо шарҳи моддаҳои қонун ва шароити молиявӣ',
      searchPlaceholder: 'Ҷустуҷӯ аз рӯи ном, ихтисос ё кишвар...',
      found: 'Барномаҳои ёфтшуда:',
      reset: 'Тоза кардани филтрҳо',
      noFound: 'Аз рӯи дархости шумо чизе ёфт нашуд',
      tryReset: 'Лутфан калимаҳои дигарро ворид кунед',
      detailsBtn: 'Маълумоти бештар',
      askOrzu: 'Аз Орзу дар ин бора пурсед',
      roadmapBtn: 'Кушодани харитаи роҳ',
      categories: [
        { id: 'all', label: 'Ҳамаи барномаҳо' },
        { id: 'volunteer', label: 'Ихтиёриён (FSJ/FÖJ/BFD)' },
        { id: 'ausbildung', label: 'Таҳсили касбӣ (Ausbildung)' },
        { id: 'chancenkarte', label: 'Харитаи имкониятҳо (Chancenkarte)' },
        { id: 'bluecard', label: 'Корти Кабуд (EU Blue Card)' },
        { id: 'university', label: 'Донишгоҳҳо ва грантҳо' },
        { id: 'tech_nomad', label: 'IT ва Номадҳои рақамӣ' },
      ],
    },
    en: {
      badge: 'Official Program Registry',
      title: 'EU Legal Pathways Showcase',
      desc: 'Up-to-date opportunities with statutory AufenthG basis, salary data, and direct official portals',
      searchPlaceholder: 'Search by title, occupation, country, law...',
      found: 'Programs found:',
      reset: 'Reset filters',
      noFound: 'No programs match your search',
      tryReset: 'Try changing your search parameters or category filter',
      detailsBtn: 'Program Details',
      askOrzu: 'Ask Orzu about this track',
      roadmapBtn: 'Open Relocation Roadmap',
      categories: [
        { id: 'all', label: 'All Programs' },
        { id: 'volunteer', label: 'Volunteering (FSJ/FÖJ/BFD)' },
        { id: 'ausbildung', label: 'Dual Studies (Ausbildung)' },
        { id: 'chancenkarte', label: 'Opportunity Card (Chancenkarte)' },
        { id: 'bluecard', label: 'EU Blue Card' },
        { id: 'university', label: 'Free Universities & Scholarships' },
        { id: 'tech_nomad', label: 'IT & Digital Nomad' },
      ],
    },
    de: {
      badge: 'Offizielles Programmverzeichnis',
      title: 'Übersicht legaler EU-Programme',
      desc: 'Aktuelle Wege mit gesetzlicher Grundlage (AufenthG), Vergütungsinformationen und offiziellen Portallinks',
      searchPlaceholder: 'Suche nach Titel, Beruf, AufenthG-Paragraf...',
      found: 'Gefundene Programme:',
      reset: 'Filter zurücksetzen',
      noFound: 'Keine Programme für deine Suchanfrage gefunden',
      tryReset: 'Versuche, die Suchbegriffe oder die Kategorie anzupassen',
      detailsBtn: 'Programmdetails anzeigen',
      askOrzu: 'Orzu zu diesem Programm fragen',
      roadmapBtn: 'Fahrplan öffnen',
      categories: [
        { id: 'all', label: 'Alle Programme' },
        { id: 'volunteer', label: 'Freiwilligendienst (FSJ/FÖJ/BFD)' },
        { id: 'ausbildung', label: 'Duale Ausbildung' },
        { id: 'chancenkarte', label: 'Chancenkarte (§ 20a)' },
        { id: 'bluecard', label: 'Blaue Karte EU (§ 18g)' },
        { id: 'university', label: 'Gebührenfreies Studium & Stipendien' },
        { id: 'tech_nomad', label: 'IT & Digital Nomad' },
      ],
    },
  }[language];

  const filteredPrograms = useMemo(() => {
    return PROGRAMS.filter((prog) => {
      const matchCategory = selectedCategory === 'all' || prog.category === selectedCategory;
      const matchCountry = selectedCountry === 'all' || prog.country.toLowerCase().includes(selectedCountry.toLowerCase());
      const matchSearch = 
        !searchQuery.trim() || 
        prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prog.legalBasis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prog.country.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchCountry && matchSearch;
    });
  }, [selectedCategory, selectedCountry, searchQuery]);

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.title}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {t.desc}
          </p>
        </div>

        {/* SEARCH BOX */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* FILTER PILLS */}
      <div className="flex flex-wrap items-center gap-2">
        {t.categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ACTIVE FILTERS & STATS */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          {t.found} <strong className="text-white">{filteredPrograms.length}</strong>
        </span>
        {(selectedCategory !== 'all' || selectedCountry !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedCountry('all');
              setSearchQuery('');
            }}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            {t.reset}
          </button>
        )}
      </div>

      {/* PROGRAM CARDS GRID */}
      {filteredPrograms.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-4">
          <p className="text-slate-400 text-sm">По вашему запросу не найдено программ.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
          >
            Показать все программы
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((prog) => (
            <div
              key={prog.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition shadow-xl space-y-5"
            >
              {/* Card Top */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                      prog.category === 'volunteer'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : prog.category === 'ausbildung'
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        : prog.category === 'chancenkarte'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : prog.category === 'bluecard'
                        ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                        : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                    }`}
                  >
                    {prog.categoryLabel}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    {prog.countryFlag} {prog.country}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">
                  {prog.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {prog.description}
                </p>

                {/* Key attributes */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Banknote className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-medium truncate">{prog.stipendOrSalary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Срок: {prog.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="truncate">Язык: {prog.languageReq}</span>
                  </div>
                </div>

                {/* Legal basis badge */}
                <div className="pt-1">
                  <span className="inline-block text-[10px] font-mono bg-slate-950 px-2.5 py-1 rounded-md text-slate-400 border border-slate-800">
                    Правовая основа: {prog.legalBasis}
                  </span>
                </div>
              </div>

              {/* Card Bottom CTA */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => setDetailModalProgram(prog)}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Подробный регламент & Чек-лист</span>
                </button>

                <button
                  onClick={() =>
                    onNavigateToOrzu(
                      `Привет! Расскажи пошагово, как мне подать документы на программу: "${prog.title}" (${prog.legalBasis}). Какие есть подводные камни?`
                    )
                  }
                  className="w-full py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Спросить Орзу об этой программе</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL DOSSIER MODAL */}
      {detailModalProgram && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{detailModalProgram.countryFlag}</span>
                  <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                    {detailModalProgram.country} • {detailModalProgram.categoryLabel}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white leading-snug">
                  {detailModalProgram.title}
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  Юридический параграф: {detailModalProgram.legalBasis}
                </span>
              </div>
              <button
                onClick={() => setDetailModalProgram(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
              <div>
                <h4 className="font-bold text-sm text-white mb-2">Описание программы:</h4>
                <p className="leading-relaxed text-slate-300">{detailModalProgram.description}</p>
              </div>

              {/* Conditions Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-400 block mb-0.5">Финансирование / Оплата:</span>
                  <span className="font-semibold text-emerald-400">{detailModalProgram.stipendOrSalary}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Требования к языку:</span>
                  <span className="font-semibold text-slate-200">{detailModalProgram.languageReq}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Продолжительность:</span>
                  <span className="font-semibold text-slate-200">{detailModalProgram.duration}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Целевая аудитория:</span>
                  <span className="font-semibold text-slate-200">{detailModalProgram.targetAudience}</span>
                </div>
              </div>

              {/* Key Points */}
              <div>
                <h4 className="font-bold text-sm text-white mb-2">Главные преимущества и условия:</h4>
                <ul className="space-y-2">
                  {detailModalProgram.keyPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Official Portals */}
              <div className="p-4 bg-blue-950/20 border border-blue-900/40 rounded-2xl space-y-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4 text-blue-400" />
                  <span>Официальный ресурс для подачи:</span>
                </span>
                <p className="text-slate-400">
                  Подавайте заявки только через официальные государственные порталы или аккредитованные центры:
                </p>
                <a
                  href={detailModalProgram.officialPortal}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-400 hover:underline font-semibold"
                >
                  <span>{detailModalProgram.officialPortalName}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex flex-wrap gap-3 justify-end">
              <button
                onClick={() => {
                  const pTitle = detailModalProgram.title;
                  setDetailModalProgram(null);
                  onNavigateToOrzu(
                    `Напиши структуру мотивационного письма и чек-лист документов для подачи на "${pTitle}".`
                  );
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Написать мотивационное письмо с Орзу</span>
              </button>
              <button
                onClick={() => setDetailModalProgram(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
