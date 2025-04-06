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
