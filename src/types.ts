export type Language = 'ru' | 'tg' | 'en' | 'de';

export interface Program {
  id: string;
  title: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  category: 'volunteer' | 'ausbildung' | 'bluecard' | 'chancenkarte' | 'university' | 'tech_nomad';
  categoryLabel: string;
  description: string;
  stipendOrSalary: string;
  duration: string;
  languageReq: string;
  legalBasis: string; // e.g. AufenthG § 19e
  keyPoints: string[];
  targetAudience: string;
  officialPortal: string;
  officialPortalName: string;
  isPopular?: boolean;
}

export interface CountryInfo {
  id: string;
  name: string;
  nameTg: string;
  flag: string;
  region: string;
  description: string;
  popularTracks: string[];
  minWageOrStipend: string;
  livingCostEstimate: string;
  languageReq: string;
  imageUrl: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  legalTip?: string;
  officialLink?: string;
  officialLinkText?: string;
  isCompleted: boolean;
}

export interface RoadmapPhase {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  tasks: RoadmapTask[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  source?: 'gemini_api' | 'knowledge_engine' | 'knowledge_engine_fallback';
}

export interface NotificationItem {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  badgeColor: string;
  isNew: boolean;
}
