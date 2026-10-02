import React from 'react';
import { Bell, X, Sparkles, CheckCheck } from 'lucide-react';
import { NotificationItem, Language } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  language?: Language;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  language = 'ru',
}) => {
  if (!isOpen) return null;

  const t = {
    ru: {
      title: 'Оперативные уведомления ЕС',
      subtitle: 'Изменения миграционных законов и регламентов',
      markAll: 'Прочитано всё',
      close: 'Закрыть',
    },
    tg: {
      title: 'Огоҳиномаҳои фаврии ИА',
      subtitle: 'Тағйироти қонунҳои муҳоҷират ва дастурҳо',
      markAll: 'Ҳама хонда шуд',
      close: 'Пӯшидан',
    },
    en: {
      title: 'EU Operational Alerts',
      subtitle: 'Updates on migration statutes and visa policies',
      markAll: 'Mark all as read',
      close: 'Close',
    },
    de: {
      title: 'Aktuelle EU-Mitteilungen',
      subtitle: 'Änderungen der Aufenthaltsgesetze und Visabestimmungen',
      markAll: 'Alle als gelesen markieren',
      close: 'Schließen',
    },
  }[language];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">{t.title}</h3>
              <span className="text-xs text-slate-400">{t.subtitle}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border space-y-1.5 transition ${
                n.isNew
                  ? 'bg-slate-800/80 border-blue-500/40'
                  : 'bg-slate-900/60 border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${n.badgeColor}`}>
                  {n.category}
                </span>
                <span className="text-[10px] text-slate-500">{n.date}</span>
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-white">{n.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{n.description}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={onMarkAllAsRead}
            className="text-xs text-blue-400 hover:underline flex items-center gap-1.5 font-medium cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{t.markAll}</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
