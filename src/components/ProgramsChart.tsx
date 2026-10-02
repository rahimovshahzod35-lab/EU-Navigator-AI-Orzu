import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  Layers, 
  Globe2, 
  ArrowRight, 
  TrendingUp, 
  Award,
  Sparkles,
  Info
} from 'lucide-react';
import { PROGRAMS } from '../data/programsData';
import { Language } from '../types';

interface ProgramsChartProps {
  onNavigateToShowcase: (filterCategory?: string, filterCountry?: string) => void;
  language: Language;
}

export const ProgramsChart: React.FC<ProgramsChartProps> = ({
  onNavigateToShowcase,
  language,
}) => {
  // Chart dimensions & types
  const [dimension, setDimension] = useState<'category' | 'country'>('category');
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const t = {
    ru: {
      badge: 'Аналитика и статистика программ',
      title: 'Интерактивное распределение иммиграционных программ',
      subtitle: 'Наглядный обзор официальных европейских треков по типам виз, странам назначения и финансовым условиям',
      byCategory: 'По категориям',
      byCountry: 'По странам',
      barChart: 'Гистограмма',
      pieChart: 'Круговая диаграмма',
      totalPrograms: 'Всего программ',
      totalProgramsDesc: 'Официальных треков в базе',
      topCountry: 'Лидер направлений',
      topCountryDesc: 'Германия (50% всех программ)',
      avgDuration: 'Средний срок',
      avgDurationDesc: 'От 1 года до ПМЖ',
      zeroTuition: 'Стипендии & Бесплатно',
      zeroTuitionDesc: '60% программ с доходом',
      availableDesc: 'доступно для заявителей в этом направлении',
      examplePrefix: 'Пример:',
      avgDurationVal: '1 – 3 года',
      programsCount: 'программ(ы)',
      share: 'Доля в каталоге',
      clickHint: 'Нажмите на сектор или столбец для быстрого перехода к списку',
      exploreBtn: 'Смотреть программы в каталоге',
      representativeTracks: 'Ключевые программы трека:',
      legalTag: 'Правовая основа:',
      selectedOverview: 'Информация о выбранном направлении:',
      categoryNames: {
        ausbildung: 'Duale Ausbildung (Ссуз + Зарплата)',
        university: 'Высшее образование & Гранты',
        tech_nomad: 'IT & Digital Nomad',
        volunteer: 'Волонтерство (FÖJ / BFD)',
        chancenkarte: 'Карта возможностей (Chancenkarte)',
        bluecard: 'Голубая карта ЕС (Blue Card)',
      } as Record<string, string>,
      countryNames: {
        Germany: 'Германия',
        EU: 'Общеевропейские (ЕС)',
        Czechia: 'Чехия',
        France: 'Франция',
        Netherlands: 'Нидерланды',
        Estonia: 'Эстония',
      } as Record<string, string>,
    },
    tg: {
      badge: 'Омор ва таҳлили барномаҳо',
      title: 'Тақсимоти интерактивии барномаҳои муҳоҷират',
      subtitle: 'Шарҳи муфассали роҳҳои қонунии Аврупо аз рӯи категорияҳо, кишварҳо ва шароити молиявӣ',
      byCategory: 'Бо рӯи категорияҳо',
      byCountry: 'Бо рӯи кишварҳо',
      barChart: 'Диаграммаи сутунӣ',
      pieChart: 'Диаграммаи даврашакл',
      totalPrograms: 'Ҳамагӣ барномаҳо',
      totalProgramsDesc: 'Роҳҳои расмӣ дар пойгоҳ',
      topCountry: 'Кишвари асосӣ',
      topCountryDesc: 'Олмон (50% барномаҳо)',
      avgDuration: 'Муддати миёна',
      avgDurationDesc: 'Аз 1 сол то гирифтани ПМЖ',
      zeroTuition: 'Таҳсили ройгон ва маош',
      zeroTuitionDesc: '60% барномаҳо бо пардохт',
      availableDesc: 'барои довталабон дар ин бахш дастрас аст',
      examplePrefix: 'Мисол:',
      avgDurationVal: '1 – 3 сол',
      programsCount: 'барнома',
      share: 'Ҳисса дар феҳрист',
      clickHint: 'Барои гузаштан ба рӯйхати барномаҳо сутун ё секторро клик кунед',
      exploreBtn: 'Дидани барномаҳо дар феҳрист',
      representativeTracks: 'Барномаҳои асосии ин бахш:',
      legalTag: 'Асоси ҳуқуқӣ:',
      selectedOverview: 'Маълумот дар бораи бахши интихобшуда:',
      categoryNames: {
        ausbildung: 'Аусбилдинг (Таҳсил бо маош)',
        university: 'Таҳсилоти олӣ ва грантҳо',
        tech_nomad: 'IT ва Номадҳои рақамӣ',
        volunteer: 'Ихтиёриён (FÖJ / BFD)',
        chancenkarte: 'Корти имкониятҳо (Chancenkarte)',
        bluecard: 'Корти кабуди ИА (Blue Card)',
      } as Record<string, string>,
      countryNames: {
        Germany: 'Олмон',
        EU: 'Умумиаврупоӣ (ИА)',
        Czechia: 'Чехия',
        France: 'Фаронса',
        Netherlands: 'Нидерланд',
        Estonia: 'Эстония',
      } as Record<string, string>,
    },
    en: {
      badge: 'Programs Analytics & Statistics',
      title: 'Interactive Migration Programs Distribution',
      subtitle: 'Visual breakdown of official European relocation pathways by visa category, destination country, and financial support',
      byCategory: 'By Category',
      byCountry: 'By Country',
      barChart: 'Bar Chart',
      pieChart: 'Donut Chart',
      totalPrograms: 'Total Programs',
      totalProgramsDesc: 'Official pathways verified',
      topCountry: 'Top Destination',
      topCountryDesc: 'Germany (50% of all tracks)',
      avgDuration: 'Average Duration',
      avgDurationDesc: '1 year to permanent residence',
      zeroTuition: 'Funded & Free',
      zeroTuitionDesc: '60% offer stipends/salary',
      availableDesc: 'available for applicants in this pathway',
      examplePrefix: 'Example:',
      avgDurationVal: '1 – 3 years',
      programsCount: 'programs',
      share: 'Share in Catalog',
      clickHint: 'Click any bar or chart segment to filter directly in catalog',
      exploreBtn: 'Explore Programs in Catalog',
      representativeTracks: 'Key representative tracks:',
      legalTag: 'Legal foundation:',
      selectedOverview: 'Selected segment details:',
      categoryNames: {
        ausbildung: 'Dual Vocational (Ausbildung)',
        university: 'Higher Education & Grants',
        tech_nomad: 'Tech & Digital Nomad',
        volunteer: 'Volunteering (FÖJ / BFD)',
        chancenkarte: 'Opportunity Card (Chancenkarte)',
        bluecard: 'EU Blue Card',
      } as Record<string, string>,
      countryNames: {
        Germany: 'Germany',
        EU: 'Pan-European (EU)',
        Czechia: 'Czechia',
        France: 'France',
        Netherlands: 'Netherlands',
        Estonia: 'Estonia',
      } as Record<string, string>,
    },
    de: {
      badge: 'Programmanalyse & Statistiken',
      title: 'Interaktive Verteilung der Migrationsprogramme',
      subtitle: 'Visuelle Übersicht der offiziellen europäischen Einwanderungswege nach Kategorien, Zielländern und Vergütung',
      byCategory: 'Nach Kategorie',
      byCountry: 'Nach Land',
      barChart: 'Balkendiagramm',
      pieChart: 'Kreisdiagramm',
      totalPrograms: 'Gesamtzahl Programme',
      totalProgramsDesc: 'Geprüfte Wege im Katalog',
      topCountry: 'Hauptzielland',
      topCountryDesc: 'Deutschland (50% aller Wege)',
      avgDuration: 'Durchschnittsdauer',
      avgDurationDesc: '1 Jahr bis zur Niederlassung',
      zeroTuition: 'Vergütet & Gebührenfrei',
      zeroTuitionDesc: '60% bieten Gehalt/Taschengeld',
      availableDesc: 'für Bewerber in diesem Bereich verfügbar',
      examplePrefix: 'Beispiel:',
      avgDurationVal: '1 – 3 Jahre',
      programsCount: 'Programme',
      share: 'Anteil im Verzeichnis',
      clickHint: 'Klicke auf einen Balken oder ein Kreissegment, um direkt zum Katalog zu gelangen',
      exploreBtn: 'Programme im Katalog ansehen',
      representativeTracks: 'Wichtigste Programme:',
      legalTag: 'Gesetzliche Grundlage:',
      selectedOverview: 'Details zum ausgewählten Segment:',
      categoryNames: {
        ausbildung: 'Duale Berufsausbildung',
        university: 'Hochschulstudium & Stipendien',
        tech_nomad: 'Tech & Digital Nomad',
        volunteer: 'Freiwilligendienst (FÖJ / BFD)',
        chancenkarte: 'Chancenkarte (§ 20a)',
        bluecard: 'Blaue Karte EU (§ 18g)',
      } as Record<string, string>,
      countryNames: {
        Germany: 'Deutschland',
        EU: 'EU-weit / Paneuropäisch',
        Czechia: 'Tschechien',
        France: 'Frankreich',
        Netherlands: 'Niederlande',
        Estonia: 'Estland',
      } as Record<string, string>,
    },
  }[language];

  // Distinct vibrant color palette
  const COLORS = {
    ausbildung: '#10b981', // Emerald
    university: '#ec4899', // Pink
    tech_nomad: '#3b82f6', // Blue
    volunteer: '#06b6d4',  // Cyan
    chancenkarte: '#f59e0b', // Amber
    bluecard: '#8b5cf6', // Violet
    Germany: '#3b82f6',
    EU: '#8b5cf6',
    Czechia: '#10b981',
    France: '#ec4899',
    Netherlands: '#f59e0b',
    Estonia: '#06b6d4',
  };

  // Group by category
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    const progsByCategory: Record<string, typeof PROGRAMS> = {};

    PROGRAMS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
      if (!progsByCategory[p.category]) progsByCategory[p.category] = [];
      progsByCategory[p.category].push(p);
    });

    return Object.entries(counts)
      .map(([key, count]) => {
        const percent = Math.round((count / PROGRAMS.length) * 100);
        return {
          id: key,
          name: t.categoryNames[key] || key,
          count,
          percentage: percent,
          color: (COLORS as Record<string, string>)[key] || '#64748b',
          programs: progsByCategory[key] || [],
          targetKey: key,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [language, t.categoryNames]);

  // Group by country
  const countryData = useMemo(() => {
    const counts: Record<string, number> = {};
    const progsByCountry: Record<string, typeof PROGRAMS> = {};
    const flags: Record<string, string> = {
      Germany: '🇩🇪',
      Czechia: '🇨🇿',
      France: '🇫🇷',
      Netherlands: '🇳🇱',
      Estonia: '🇪🇪',
      EU: '🇪🇺',
    };

    PROGRAMS.forEach((p) => {
      let cKey = 'Germany';
      if (p.countryCode === 'CZ') cKey = 'Czechia';
      else if (p.countryCode === 'FR') cKey = 'France';
      else if (p.countryCode === 'NL') cKey = 'Netherlands';
      else if (p.countryCode === 'EE') cKey = 'Estonia';
      else if (p.countryCode === 'EU') cKey = 'EU';

      counts[cKey] = (counts[cKey] || 0) + 1;
      if (!progsByCountry[cKey]) progsByCountry[cKey] = [];
      progsByCountry[cKey].push(p);
    });

    return Object.entries(counts)
      .map(([key, count]) => {
        const percent = Math.round((count / PROGRAMS.length) * 100);
        return {
          id: key,
          name: `${flags[key] || '🇪🇺'} ${t.countryNames[key] || key}`,
          count,
          percentage: percent,
          color: (COLORS as Record<string, string>)[key] || '#3b82f6',
          programs: progsByCountry[key] || [],
          targetKey: key === 'Germany' ? 'Германия' : key === 'Czechia' ? 'Чехия' : key === 'France' ? 'Франция' : key === 'Netherlands' ? 'Нидерланды' : key === 'Estonia' ? 'Эстония' : '',
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [language, t.countryNames]);

  const currentData = dimension === 'category' ? categoryData : countryData;

  // Selected item detail
  const selectedItem = activeIndex !== null && currentData[activeIndex]
    ? currentData[activeIndex]
    : currentData[0];

  const handleSelectSlice = (index: number) => {
    setActiveIndex(index);
  };

  const handleNavigate = (item: typeof currentData[0]) => {
    if (dimension === 'category') {
      onNavigateToShowcase(item.targetKey, undefined);
    } else {
      onNavigateToShowcase(undefined, item.targetKey);
    }
  };

  // Custom sleek tooltip
  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3.5 shadow-2xl backdrop-blur-md max-w-xs text-xs z-50">
          <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-slate-800">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: data.color }}
            />
            <span className="font-bold text-white text-sm truncate">{data.name}</span>
          </div>

          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">{t.totalPrograms}:</span>
              <span className="font-semibold text-white">
                {data.count} {t.programsCount} ({data.percentage}%)
              </span>
            </div>
            {data.programs && data.programs[0] && (
              <div className="pt-1.5 text-[11px] text-slate-400 border-t border-slate-800/60">
                <span className="text-slate-300 font-medium">{t.examplePrefix} </span>
                {data.programs[0].title}
              </div>
            )}
          </div>
          <div className="mt-2 pt-1.5 text-[10px] text-blue-400 flex items-center gap-1 font-medium">
            <span>{t.clickHint}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* SECTION HEADER & CONTROL BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* INTERACTIVE CONTROLS (TABS & CHART TYPE TOGGLE) */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Dimension Selector (Category vs Country) */}
          <div className="inline-flex p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
            <button
              onClick={() => {
                setDimension('category');
                setActiveIndex(0);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                dimension === 'category'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t.byCategory}</span>
            </button>
            <button
              onClick={() => {
                setDimension('country');
                setActiveIndex(0);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                dimension === 'country'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>{t.byCountry}</span>
            </button>
          </div>

          {/* Chart Type Toggle (Bar vs Donut) */}
          <div className="inline-flex p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
            <button
              onClick={() => setChartType('bar')}
              title={t.barChart}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                chartType === 'bar'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('pie')}
              title={t.pieChart}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                chartType === 'pie'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PieChartIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* QUICK INSIGHT SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 bg-slate-950/50 rounded-2xl border border-slate-800/70">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{t.totalPrograms}</span>
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white">10</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{t.totalProgramsDesc}</div>
        </div>

        <div className="p-3.5 bg-slate-950/50 rounded-2xl border border-slate-800/70">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{t.topCountry}</span>
            <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400">50%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{t.topCountryDesc}</div>
        </div>

        <div className="p-3.5 bg-slate-950/50 rounded-2xl border border-slate-800/70">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{t.zeroTuition}</span>
            <Award className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-purple-400">60%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{t.zeroTuitionDesc}</div>
        </div>

        <div className="p-3.5 bg-slate-950/50 rounded-2xl border border-slate-800/70">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{t.avgDuration}</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-cyan-400">{t.avgDurationVal}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{t.avgDurationDesc}</div>
        </div>
      </div>

      {/* CHART MAIN SECTION & DETAIL CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
        {/* RECHARTS CANVAS (8 COLS ON DESKTOP) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[360px]">
          <div className="h-[280px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart
                  data={currentData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                >
                  <XAxis
                    type="number"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    axisLine={{ stroke: '#334155' }}
                    tickLine={{ stroke: '#334155' }}
                    allowDecimals={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: '#cbd5e1', fontSize: 11 }}
                    axisLine={{ stroke: '#334155' }}
                    tickLine={false}
                    width={130}
                  />
                  <Tooltip
                    content={<CustomChartTooltip />}
                    cursor={{ fill: 'rgba(51, 65, 85, 0.25)' }}
                  />
                  <Bar
                    dataKey="count"
                    radius={[0, 8, 8, 0]}
                    onClick={(entry, idx) => handleSelectSlice(idx)}
                    className="cursor-pointer transition-all duration-200"
                  >
                    {currentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={activeIndex === index || activeIndex === null ? 1 : 0.45}
                        stroke={activeIndex === index ? '#ffffff' : 'none'}
                        strokeWidth={activeIndex === index ? 2 : 0}
                      />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <Tooltip content={<CustomChartTooltip />} />
                  <Pie
                    data={currentData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={4}
                    onClick={(_, index) => handleSelectSlice(index)}
                    className="cursor-pointer"
                  >
                    {currentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={activeIndex === index || activeIndex === null ? 1 : 0.45}
                        stroke="#0f172a"
                        strokeWidth={3}
                      />
                    ))}
                  </Pie>
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Quick Segment Indicator tags below the chart */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-slate-800/80">
            {currentData.map((item, index) => {
              const isSelected = activeIndex === index;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectSlice(index)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 text-white ring-1 ring-blue-500'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                  <span className="text-[10px] text-slate-500">({item.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SELECTED ITEM DETAIL CARD (4 COLS ON DESKTOP) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: selectedItem?.color }}
              />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {t.selectedOverview}
              </span>
            </div>
            <span className="text-xs font-black px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {selectedItem?.percentage}% {t.share}
            </span>
          </div>

          {selectedItem && (
            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-white">
                  {selectedItem.name}
                </h3>
                <p className="text-slate-400 text-xs">
                  {selectedItem.count} {t.programsCount} {t.availableDesc}
                </p>
              </div>

              {/* Sample programs inside selected category/country */}
              <div className="space-y-2">
                <span className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t.representativeTracks}</span>
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {selectedItem.programs.map((prog) => (
                    <div
                      key={prog.id}
                      className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800/80 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-200 truncate">
                          {prog.countryFlag} {prog.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-medium">
                        {prog.stipendOrSalary}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {prog.legalBasis}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTON */}
              <button
                onClick={() => handleNavigate(selectedItem)}
                className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>{t.exploreBtn}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
