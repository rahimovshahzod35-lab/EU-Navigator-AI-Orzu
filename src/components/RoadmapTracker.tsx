import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, ExternalLink, Download, 
  HelpCircle, Printer, Calculator, RefreshCw, ShieldAlert,
  Calendar, FileText, ChevronDown, ChevronUp, Bot, Sparkles
} from 'lucide-react';
import { INITIAL_ROADMAP_PHASES } from '../data/roadmapData';
import { RoadmapPhase, Language } from '../types';

interface RoadmapTrackerProps {
  onNavigateToOrzu: (prefillPrompt?: string) => void;
  language: Language;
}

export const RoadmapTracker: React.FC<RoadmapTrackerProps> = ({
  onNavigateToOrzu,
  language,
}) => {
  const [phases, setPhases] = useState<RoadmapPhase[]>(() => {
    const saved = localStorage.getItem('eu_navigator_roadmap_phases');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ROADMAP_PHASES;
      }
    }
    return INITIAL_ROADMAP_PHASES;
  });

  const [expandedPhaseId, setExpandedPhaseId] = useState<string>('phase-1');
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // Sperrkonto Calculator State
  const [calcMonths, setCalcMonths] = useState<number>(12);
  const [calcTrack, setCalcTrack] = useState<'study' | 'chancenkarte' | 'custom'>('study');
  const [customMonthly, setCustomMonthly] = useState<number>(992);

  const t = {
    ru: {
      badge: 'Интерактивный трекер релокации',
      title: 'Дорожная карта & Чек-лист документов',
      desc: 'Пошаговая система подач, переводов апостилей, проверки Anabin и коммуникации с консульствами',
      exportBtn: 'Экспорт чек-листа',
      resetConfirm: 'Сбросить все отметки выполнения чек-листа?',
      completedBadge: 'Выполнено',
    },
    tg: {
      badge: 'Трекери интерактивии муҳоҷират',
      title: 'Харитаи роҳ ва рӯйхати ҳуҷҷатҳо',
      desc: 'Қадам ба қадам барои тарҷумаи ҳуҷҷатҳо, санҷиши Anabin ва муроҷиат ба консулгарӣ',
      exportBtn: 'Боргирии рӯйхат',
      resetConfirm: 'Ҳамаи қайдҳои иҷрошуда тоза карда шаванд?',
      completedBadge: 'Иҷро шуд',
    },
    en: {
      badge: 'Interactive Relocation Tracker',
      title: 'Roadmap & Document Checklist',
      desc: 'Step-by-step guidance through translations, apostilles, Anabin verification, and consulate submissions',
      exportBtn: 'Export Checklist',
      resetConfirm: 'Reset all checklist completion marks?',
      completedBadge: 'Completed',
    },
    de: {
      badge: 'Interaktiver Migrations-Tracker',
      title: 'Fahrplan & Dokumenten-Checkliste',
      desc: 'Schritt-für-Schritt-Anleitung für Beglaubigungen, Apostillen, Anabin-Prüfung und Visumanträge',
      exportBtn: 'Checkliste exportieren',
      resetConfirm: 'Möchtest du alle erledigten Aufgaben wirklich zurücksetzen?',
      completedBadge: 'Abgeschlossen',
    },
  }[language];

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('eu_navigator_roadmap_phases', JSON.stringify(phases));
  }, [phases]);

  // Calculate Progress
  const totalTasks = phases.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = phases.reduce(
    (acc, p) => acc + p.tasks.filter((t) => t.isCompleted).length,
    0
  );
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const toggleTask = (phaseId: string, taskId: string) => {
    setPhases((prev) =>
      prev.map((phase) => {
        if (phase.id !== phaseId) return phase;
        return {
          ...phase,
          tasks: phase.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return { ...task, isCompleted: !task.isCompleted };
          }),
        };
      })
    );
  };

  const resetAllTasks = () => {
    if (window.confirm(t.resetConfirm)) {
      setPhases(INITIAL_ROADMAP_PHASES);
    }
  };

  const getMonthlyRate = () => {
    if (calcTrack === 'study') return 992;
    if (calcTrack === 'chancenkarte') return 1027;
    return customMonthly;
  };

  const totalCalculatedFunds = getMonthlyRate() * calcMonths;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.title}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {t.desc}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportBtn}</span>
          </button>

          <button
            onClick={resetAllTasks}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs transition cursor-pointer"
            title="Сбросить отметки"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: PHASES & TASKS */}
        <div className="lg:col-span-2 space-y-5">
          {phases.map((phase) => {
            const isExpanded = expandedPhaseId === phase.id;
            const phaseCompleted = phase.tasks.filter((t) => t.isCompleted).length;

            return (
              <div
                key={phase.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition hover:border-slate-700"
              >
                {/* Phase Header Accordion */}
                <button
                  onClick={() => setExpandedPhaseId(isExpanded ? '' : phase.id)}
                  className="w-full p-5 flex items-center justify-between text-left bg-slate-900/60 hover:bg-slate-800/40 transition cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        phaseCompleted === phase.tasks.length
                          ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40'
                          : 'bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/40'
                      }`}
                    >
                      {phase.number}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white flex items-center gap-2">
                        <span>{phase.title}</span>
                        {phaseCompleted === phase.tasks.length && (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {t.completedBadge}
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{phase.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400">
                      {phaseCompleted}/{phase.tasks.length}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Tasks List */}
                {isExpanded && (
                  <div className="p-5 pt-0 space-y-3 border-t border-slate-800/80 bg-slate-950/30">
                    {phase.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-4 rounded-xl border transition ${
                          task.isCompleted
                            ? 'bg-emerald-950/10 border-emerald-800/30 text-slate-300'
                            : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleTask(phase.id, task.id)}
                            className="mt-0.5 text-blue-400 hover:text-blue-300 cursor-pointer shrink-0"
                          >
                            {task.isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-500 hover:text-slate-400" />
                            )}
                          </button>

                          <div className="flex-1 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span
                                className={`font-bold text-sm ${
                                  task.isCompleted ? 'line-through text-slate-400' : 'text-white'
                                }`}
                              >
                                {task.title}
                              </span>
                            </div>

                            <p className="text-slate-400 leading-relaxed">{task.description}</p>

                            {task.legalTip && (
                              <div className="p-2.5 bg-blue-950/25 border border-blue-900/30 rounded-lg text-blue-300/90 text-[11px] leading-relaxed flex items-start gap-2">
                                <HelpCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                                <span>{task.legalTip}</span>
                              </div>
                            )}

                            {task.officialLink && (
                              <div className="pt-1">
                                <a
                                  href={task.officialLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-400 hover:underline font-semibold text-[11px]"
                                >
                                  <span>{task.officialLinkText || 'Официальный источник'}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: STATUS DASHBOARD & CALCULATOR */}
        <div className="space-y-6">
          
          {/* PROGRESS CARD */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5 shadow-xl">
            <h3 className="font-bold text-base text-white">Статус вашей заявки</h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Прогресс подготовки</span>
                <span className="text-blue-400 font-bold text-sm">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>Завершено: {completedTasks} из {totalTasks} пунктов</span>
                <span>{progressPercent === 100 ? 'Готово к подаче!' : 'В процессе'}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1 text-xs">
              <span className="font-bold text-slate-200">Текущая рекомендация:</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {progressPercent < 30
                  ? 'Сфокусируйтесь на проверке университета в Anabin и апостилировании диплома.'
                  : progressPercent < 70
                  ? 'Готовьте немецкий стандарт Lebenslauf DIN 5008 и отслеживайте слоты в Visametric.'
                  : 'Оформляйте медстраховку Incoming и готовьте оригиналы к визовому интервью!'}
              </p>
            </div>

            <button
              onClick={() =>
                onNavigateToOrzu(
                  `Салом Орзу! Я заполнил чек-лист на ${progressPercent}%. Помоги мне проверить, всё ли готово для подачи в консульство и на какие вопросы на собеседовании обратить внимание?`
                )
              }
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Аудит готовности с Орзу</span>
            </button>
          </div>

          {/* SPERRKONTO CALCULATOR WIDGET */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              <span>Калькулятор Sperrkonto</span>
            </div>

            <h3 className="font-bold text-sm text-white">
              Расчет суммы блокированного счета
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Тип визы / Цель:</label>
                <select
                  value={calcTrack}
                  onChange={(e) => setCalcTrack(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="study">Студенческая виза (§ 16b) — €992/мес</option>
                  <option value="chancenkarte">Chancenkarte (§ 20a) — €1,027/мес</option>
                  <option value="custom">Пользовательская ставка</option>
                </select>
              </div>

              {calcTrack === 'custom' && (
                <div>
                  <label className="text-slate-400 block mb-1">Сумма в месяц (€):</label>
                  <input
                    type="number"
                    value={customMonthly}
                    onChange={(e) => setCustomMonthly(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Срок пребывания:</span>
                  <span className="font-bold text-white">{calcMonths} месяцев</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="24"
                  value={calcMonths}
                  onChange={(e) => setCalcMonths(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/40 rounded-xl space-y-1">
                <span className="text-[11px] text-slate-400">Итоговая сумма для блокировки:</span>
                <div className="text-xl font-black text-emerald-400">
                  €{totalCalculatedFunds.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-500 block">
                  ~€{getMonthlyRate()} / месяц на жизнь
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EXPORT / PRINT MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-lg text-white">Чек-лист релокации EU Navigator</h3>
                <span className="text-xs text-blue-400">Готовность: {progressPercent}% ({completedTasks}/{totalTasks})</span>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-3 text-xs text-slate-300 pr-1">
              {phases.map((ph) => (
                <div key={ph.id} className="space-y-1">
                  <div className="font-bold text-slate-200 border-b border-slate-800/60 pb-1">
                    {ph.number}. {ph.title}
                  </div>
                  <ul className="space-y-1 pl-2">
                    {ph.tasks.map((t) => (
                      <li key={t.id} className="flex items-center gap-2">
                        <span>{t.isCompleted ? '☑' : '☐'}</span>
                        <span className={t.isCompleted ? 'text-slate-300' : 'text-slate-400'}>
                          {t.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Распечатать / Сохранить в PDF</span>
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
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
