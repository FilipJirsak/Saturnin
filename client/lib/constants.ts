/*NAVIGATION*/

export const PATH_TRANSLATIONS: Record<string, string> = {
  'settings': 'Nastavení',
  'profile': 'Profil',
  'general': 'Obecné',
  'security': 'Zabezpečení',
  'notifications': 'Upozornění',
  'billing': 'Předplatné',
  'integrations': 'Integrace',

  'dashboard': 'Přehled',
  'statistics': 'Statistiky',
  'activities': 'Aktivity',
  'knowledge': 'Znalosti',
  'projects': 'Projekty',
  'board': 'Kanban',
  'calendar': 'Kalendář',
  'issues': 'Issues',
  'milestones': 'Milníky',
  'detail': 'Detail',
};


/*ISSUES*/

//TODO (NL): Nutno udělat konfigurovatelné
export const ISSUE_STATES = [
  { value: 'new', label: 'Nové' },
  { value: 'to_do', label: 'K řešení' },
  { value: 'in_progress', label: 'V řešení' },
  { value: 'done', label: 'Hotovo' },
];

//TODO (NL): Nutno udělat konfigurovatelné
export const ISSUE_TEAM_MEMBERS = [
  { value: 'Nela Letochová', label: 'Nela Letochová' },
  { value: 'Jan Novák', label: 'Jan Novák' },
  { value: 'Eva Černá', label: 'Eva Černá' },
  { value: 'Petr Svoboda', label: 'Petr Svoboda' },
];

//TODO (NL): Nutno vybrat, které tagy budou použity
export const ISSUE_AVAILABLE_TAGS = [
  "Bug", "Feature", "Documentation", "UI", "Backend", "Priority", "Research", "Testing"
];


/*KNOWLEDGE*/

//TODO (NL): Upravit barvy?
export const NODE_COLORS = [
  '#8b5cf6',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#6366f1',
  '#14b8a6',
  '#0ea5e9',
  '#84cc16',
  '#d946ef',
  '#f43f5e',
];

//TODO (NL): Upravit barvy?
export const EDGE_COLORS = [
  { value: '#555555', label: 'Šedá' },
  { value: '#3b82f6', label: 'Modrá' },
  { value: '#10b981', label: 'Zelená' },
  { value: '#f59e0b', label: 'Žlutá' },
  { value: '#ef4444', label: 'Červená' },
  { value: '#6366f1', label: 'Indigo' },
];

export const LINE_STYLES = [
  { value: 'solid', label: 'Plná čára' },
  { value: 'dashed', label: 'Přerušovaná čára' },
  { value: 'dotted', label: 'Tečkovaná čára' },
];

//TODO (NL): Sjednotit s tagy v issue
export const KNOWLEDGE_AVAILABLE_TAGS = [
  "architektura",
  "systém",
  "dokumentace",
  "api",
  "frontend",
  "backend",
  "databáze",
  "workflow",
  "brainstorming",
  "plánování",
  "model",
  "mikroslužby"
];
