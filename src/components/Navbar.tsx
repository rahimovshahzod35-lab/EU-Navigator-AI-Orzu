import React, { useState } from 'react';
import { Compass, Layers, Map, Bot, Bell, Settings, Menu, X, Globe } from 'lucide-react';
import { Language } from '../types';

interface NavbarProps {
  activeTab: 'main' | 'showcase' | 'roadmap' | 'orzu';
  onSelectTab: (tab: 'main' | 'showcase' | 'roadmap' | 'orzu') => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  hasUnreadNotifications: boolean;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenNotifications,
  onOpenSettings,
  hasUnreadNotifications,
  language,
  onLanguageChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLabels = {
    ru: {
      main: 'Главный экран',
      showcase: 'Витрина программ',
      roadmap: 'Дорожная карта',
      orzu: 'Чат-бот «Орзу»',
      subtitle: 'Sovereignty & Global Mobility',
    },
    tg: {
      main: 'Саҳифаи асосӣ',
      showcase: 'Барномаҳои ИА',
      roadmap: 'Харитаи роҳ',
      orzu: 'Ёвари «Орзу»',
      subtitle: 'Муҳоҷирати қонунӣ ба Аврупо',
    },
    en: {
      main: 'Main Screen',
      showcase: 'Program Showcase',
      roadmap: 'Relocation Roadmap',
      orzu: 'AI Bot "Orzu"',
      subtitle: 'Sovereignty & Global Mobility',
    },
    de: {
      main: 'Hauptseite',
      showcase: 'Programme',
      roadmap: 'Fahrplan & Checkliste',
      orzu: 'KI-Berater "Orzu"',
      subtitle: 'Souveränität & Globale Mobilität',
    },
  }[language];

  const handleTabClick = (tab: 'main' | 'showcase' | 'roadmap' | 'orzu') => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <button
          onClick={() => handleTabClick('main')}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition">
            EU
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-wide bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                EU NAVIGATOR
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                PRO
              </span>
            </div>
            <span className="text-[11px] block text-blue-400/90 font-medium">
              {navLabels.subtitle}
            </span>
          </div>
        </button>

        {/* DESKTOP NAV MENU */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
          <button
            onClick={() => handleTabClick('main')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              activeTab === 'main'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{navLabels.main}</span>
          </button>

          <button
            onClick={() => handleTabClick('showcase')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              activeTab === 'showcase'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{navLabels.showcase}</span>
          </button>

          <button
            onClick={() => handleTabClick('roadmap')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              activeTab === 'roadmap'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>{navLabels.roadmap}</span>
          </button>

          <button
            onClick={() => handleTabClick('orzu')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              activeTab === 'orzu'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>{navLabels.orzu}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>
        </nav>

        {/* SYSTEM UTILITIES */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none pr-1 cursor-pointer"
            >
              <option value="ru" className="bg-slate-900 text-white">Рус</option>
              <option value="tg" className="bg-slate-900 text-white">Тоҷ</option>
              <option value="en" className="bg-slate-900 text-white">Eng</option>
              <option value="de" className="bg-slate-900 text-white">Deu</option>
            </select>
          </div>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition relative"
          >
            <Bell className="w-4 h-4" />
            {hasUnreadNotifications && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 border-b border-slate-800 px-4 py-3 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs text-slate-400">Язык / Забон</span>
            <div className="flex gap-2">
              {(['ru', 'tg', 'en', 'de'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    language === lang
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => handleTabClick('main')}
            className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-3 ${
              activeTab === 'main' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{navLabels.main}</span>
          </button>
          <button
            onClick={() => handleTabClick('showcase')}
            className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-3 ${
              activeTab === 'showcase' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{navLabels.showcase}</span>
          </button>
          <button
            onClick={() => handleTabClick('roadmap')}
            className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-3 ${
              activeTab === 'roadmap' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>{navLabels.roadmap}</span>
          </button>
          <button
            onClick={() => handleTabClick('orzu')}
            className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-3 ${
              activeTab === 'orzu' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>{navLabels.orzu}</span>
          </button>
        </div>
      )}
    </header>
  );
};
