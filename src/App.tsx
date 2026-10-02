import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { MainScreen } from './components/MainScreen';
import { ProgramShowcase } from './components/ProgramShowcase';
import { RoadmapTracker } from './components/RoadmapTracker';
import { OrzuChat } from './components/OrzuChat';
import { NotificationsModal } from './components/NotificationsModal';
import { SettingsModal } from './components/SettingsModal';
import { INITIAL_NOTIFICATIONS } from './data/roadmapData';
import { Language, NotificationItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'main' | 'showcase' | 'roadmap' | 'orzu'>('main');
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('eu_navigator_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('eu_navigator_lang') as Language) || 'ru';
  });

  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Cross-tab transfer states
  const [showcaseCategoryFilter, setShowcaseCategoryFilter] = useState<string | undefined>(undefined);
  const [showcaseCountryFilter, setShowcaseCountryFilter] = useState<string | undefined>(undefined);
  const [orzuPrefillPrompt, setOrzuPrefillPrompt] = useState<string | undefined>(undefined);

  const hasUnreadNotifications = notifications.some((n) => n.isNew);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('eu_navigator_lang', newLang);
  };

  const handleMarkAllNotificationsAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isNew: false }));
    setNotifications(updated);
    localStorage.setItem('eu_navigator_notifications', JSON.stringify(updated));
  };

  const handleResetAllData = () => {
    localStorage.removeItem('eu_navigator_roadmap_phases');
    localStorage.removeItem('eu_navigator_chat_history');
    localStorage.removeItem('eu_navigator_notifications');
    window.location.reload();
  };

  const navigateToShowcase = (category?: string, country?: string) => {
    setShowcaseCategoryFilter(category);
    setShowcaseCountryFilter(country);
    setActiveTab('showcase');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToOrzu = (prompt?: string) => {
    setOrzuPrefillPrompt(prompt);
    setActiveTab('orzu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToRoadmap = () => {
    setActiveTab('roadmap');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* NAVIGATION BAR */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasUnreadNotifications={hasUnreadNotifications}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'main' && (
          <MainScreen
            onNavigateToShowcase={navigateToShowcase}
            onNavigateToOrzu={navigateToOrzu}
            onNavigateToRoadmap={navigateToRoadmap}
            language={language}
          />
        )}

        {activeTab === 'showcase' && (
          <ProgramShowcase
            initialCategoryFilter={showcaseCategoryFilter}
            initialCountryFilter={showcaseCountryFilter}
            onNavigateToOrzu={navigateToOrzu}
            onNavigateToRoadmap={navigateToRoadmap}
            language={language}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapTracker
            onNavigateToOrzu={navigateToOrzu}
            language={language}
          />
        )}

        {activeTab === 'orzu' && (
          <OrzuChat
            initialPrompt={orzuPrefillPrompt}
            language={language}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">EU NAVIGATOR</span>
            <span>•</span>
            <span>Sovereignty & Global Mobility</span>
          </div>
          <div className="text-center sm:text-right text-[11px] text-slate-500">
            {
              {
                ru: 'Информация основана на официальных параграфах AufenthG, базе Anabin и визовых регламентах ЕС.',
                tg: 'Маълумот дар асоси қонунҳои расмии AufenthG, пойгоҳи Anabin ва санадҳои ИА омода шудааст.',
                en: 'Information grounded in official AufenthG statutes, Anabin database standards, and EU visa protocols.',
                de: 'Informationen basieren auf den offiziellen Bestimmungen des AufenthG, der Anabin-Datenbank und den EU-Visavorschriften.',
              }[language]
            }
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        language={language}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        onLanguageChange={handleLanguageChange}
        onResetData={handleResetAllData}
      />
    </div>
  );
}
