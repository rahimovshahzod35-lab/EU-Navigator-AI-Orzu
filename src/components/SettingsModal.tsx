import React from 'react';
import { Settings, X, Globe, Shield, RefreshCw, Info } from 'lucide-react';
import { Language } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  onResetData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Настройки системы</h3>
              <span className="text-xs text-slate-400">Параметры интерфейса и локализации</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs">
          
          {/* Language selection */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <label className="font-bold text-slate-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Язык интерфейса / Забон / Language / Sprache:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {[
                { code: 'ru', label: 'Русский', flag: '🇷🇺' },
                { code: 'tg', label: 'Тоҷикӣ', flag: '🇹🇯' },
                { code: 'en', label: 'English', flag: '🇬🇧' },
                { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
              ].map((item) => (
                <button
                  key={item.code}
                  onClick={() => onLanguageChange(item.code as Language)}
                  className={`py-2.5 px-2 rounded-xl font-semibold text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                    language === item.code
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span className="text-base leading-none">{item.flag}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Legal status banner */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-200 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Юридическая верификация:</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Все материалы согласованы с официальными параграфами AufenthG (Германия), директивами ЕС по Blue Card и требованиями посольств Visametric / VFS Global.
            </p>
          </div>

          {/* Reset progress */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (window.confirm('Сбросить весь сохраненный прогресс чек-листа и историю чата?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="w-full py-2.5 bg-slate-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800 text-slate-400 hover:text-rose-300 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Сбросить данные прогресса</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
          <span>EU Navigator v2.4 Pro</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
};
