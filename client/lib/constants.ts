import { AlertCircle, Book, MessageSquare, Map } from "lucide-react";
import {
  type ActivityType,
  type ActivityStatus,
  type StatisticsPeriod
} from "~/types/dashboard";

/*NAVIGATION*/

export interface TeamMember {
  value: string;
  label: string;
}

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
export const ISSUE_TEAM_MEMBERS: TeamMember[] = [
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

export const RELATION_TYPES = [
  { value: "is_a", label: "je typ" },
  { value: "has_a", label: "má" },
  { value: "related_to", label: "souvisí s" },
  { value: "depends_on", label: "závisí na" },
  { value: "part_of", label: "je součástí" },
];

/*DASHBOARD*/

export const ACTIVITY_TYPES: Record<string, ActivityType> = {
  ISSUE: 'issue',
  DOCUMENT: 'document',
  CONCEPT: 'concept',
  MINDMAP: 'mindmap',
  MESSAGE: 'message',
} as const;

export const ACTIVITY_STATUSES = {
  OPEN: 'open',
  CLOSED: 'closed',
  IN_PROGRESS: 'in-progress',
} as const;

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  [ACTIVITY_STATUSES.OPEN]: 'Otevřený',
  [ACTIVITY_STATUSES.CLOSED]: 'Uzavřený',
  [ACTIVITY_STATUSES.IN_PROGRESS]: 'V řešení',
};

export const ACTIVITY_STATUS_VARIANTS: Record<ActivityStatus, string> = {
  [ACTIVITY_STATUSES.OPEN]: 'bg-green-100 text-green-800',
  [ACTIVITY_STATUSES.CLOSED]: 'bg-gray-100 text-gray-800',
  [ACTIVITY_STATUSES.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
};

export const CHART_COLORS = {
  primary: {
    light: 'hsl(var(--primary-300))',
    medium: 'hsl(var(--primary))',
    dark: 'hsl(var(--primary-700))'
  },
  primaryLight: {
    light: 'hsl(var(--primary-200))',
    medium: 'hsl(var(--primary-300))',
    dark: 'hsl(var(--primary-600))'
  },
  primaryDark: {
    light: 'hsl(var(--primary-400))',
    medium: 'hsl(var(--primary-600))',
    dark: 'hsl(var(--primary-800))'
  },
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  muted: 'hsl(var(--muted))',
  success: 'hsl(var(--success))',
};

export const STATISTICS_PERIODS = {
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
} as const;

export const STATISTICS_PERIOD_LABELS: Record<StatisticsPeriod, string> = {
  [STATISTICS_PERIODS.WEEK]: 'Tento týden',
  [STATISTICS_PERIODS.MONTH]: 'Tento měsíc',
  [STATISTICS_PERIODS.QUARTER]: 'Poslední 3 měsíce',
  [STATISTICS_PERIODS.YEAR]: 'Celý rok',
};

export const STATISTICS_TABS = {
  OVERVIEW: 'overview',
  ISSUES: 'issues',
  KNOWLEDGE: 'knowledge',
  SEARCH: 'search',
} as const;

export const ACTIVITY_TABS = {
  RECENT: 'recent',
  ISSUES: 'issues',
  KNOWLEDGE: 'knowledge',
  MESSAGES: 'messages',
} as const;

export const ACTIVITY_ICONS = {
  [ACTIVITY_TYPES.ISSUE]: {
    icon: AlertCircle,
    className: 'text-red-500'
  },
  [ACTIVITY_TYPES.DOCUMENT]: {
    icon: Book,
    className: 'text-blue-500'
  },
  [ACTIVITY_TYPES.CONCEPT]: {
    icon: MessageSquare,
    className: 'text-green-500'
  },
  [ACTIVITY_TYPES.MINDMAP]: {
    icon: Map,
    className: 'text-purple-500'
  },
  [ACTIVITY_TYPES.MESSAGE]: {
    icon: MessageSquare,
    className: 'text-yellow-500'
  }
};
