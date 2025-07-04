import {
  BookOpen,
  Brain,
  FolderKanban,
  Home,
  Inbox,
  Library,
  MessagesSquare,
  Network,
  Settings,
  Users,
} from "lucide-react";
import { Concept, KnowledgeTag, MindMap } from "~/types/knowledge";
import { ACTIVITY_STATUSES, ACTIVITY_TYPES, STATISTICS_PERIODS } from "~/lib/constants";
import { Activity, ActivityChartData, PieChartData, StatCardData, StatisticsPeriod } from "~/types/dashboard";
import { generateAvatar } from "~/utils/helpers";

export const sidebarItems = {
  user: {
    id: "user-1",
    name: "Nela Letochová",
    email: "nela.letochova@example.com",
    avatar: generateAvatar("nelinka", "female"),
    role: "admin" as const,
  },
  teams: [
    {
      name: "Diplomová práce",
      logo: BookOpen,
      plan: "Personal",
    },
    {
      name: "Tým 1",
      logo: Users,
      plan: "Team",
    },
  ],
  navMain: [
    {
      title: "Inbox",
      url: "/",
      icon: Inbox,
      isActive: true,
    },
    /*TODO (NL): Upravit URLs*/
    {
      title: "Přehled",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Statistiky",
          url: "/statistics",
        },
        {
          title: "Aktivity",
          url: "/activities",
        },
      ],
    },
    {
      title: "Znalosti",
      url: "/knowledge",
      icon: Brain,
      items: [
        {
          title: "Knihovna",
          url: "/knowledge/library",
        },
        {
          title: "Koncepty",
          url: "/knowledge/concepts",
        },
        {
          title: "Mind mapy",
          url: "/knowledge/mindmaps",
        },
        {
          title: "Tagy",
          url: "/knowledge/tags",
        },
      ],
    },
    {
      title: "Projekty",
      url: "/projects",
      icon: FolderKanban,
      items: [
        {
          title: "Přehled projektů",
          url: "/projects",
        },
        {
          title: "Kanban board",
          url: "/projects/board",
        },
        /*{
          title: "Seznam issues",
          url: "/projects/tasks",
        },
        {
          title: "Milníky",
          url: "/projects/milestones",
        }*/
      ],
    },
  ],
  navSettings: [
    {
      title: "Nastavení",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "Profil",
          url: "/settings/profile",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "/projects/design",
      icon: Network,
    },
    {
      name: "Sales & Marketing",
      url: "/projects/sales",
      icon: MessagesSquare,
    },
    {
      name: "Research",
      url: "/projects/research",
      icon: Library,
    },
  ],
};

// TODO (NL): Zařídit, aby se mock data načítala jen jednou na začátku aplikace?
export const MOCK_MINDMAPS: MindMap[] = [
  {
    id: "mindmap-1",
    title: "Architektura druhého mozku",
    description: "Kompletní přehled systémové architektury Second Brain včetně komponent a závislostí.",
    tags: ["architektura", "systém", "komponenty"],
    color: "#8b5cf6",
    thumbnail: "#8b5cf6",
    createdAt: "2025-03-15T10:00:00Z",
    updatedAt: "2025-04-01T14:30:00Z",
    author: "Nela Letochová",
    nodeCount: 24,
    isPublic: false,
    viewMode: "network" as const,
    nodes: [
      { id: "node-1", text: "Second Brain", x: 250, y: 200, color: "#8b5cf6" },
      { id: "node-2", text: "Frontend", x: 100, y: 100, color: "#3b82f6" },
      { id: "node-3", text: "Backend", x: 400, y: 100, color: "#10b981" },
      { id: "node-4", text: "Databáze", x: 400, y: 300, color: "#f59e0b" },
      { id: "node-5", text: "API", x: 100, y: 300, color: "#ef4444" },
      { id: "node-6", text: "Autentizace", x: 250, y: 400, color: "#6366f1" },
      { id: "node-7", text: "UI Komponenty", x: 0, y: 150, color: "#ec4899" },
      { id: "node-8", text: "State Management", x: 200, y: 50, color: "#14b8a6" },
    ],
    connections: [
      { id: "edge-1", sourceId: "node-1", targetId: "node-2", label: "používá", color: "#888", thickness: 1 },
      { id: "edge-2", sourceId: "node-1", targetId: "node-3", label: "obsahuje", color: "#888", thickness: 1 },
      { id: "edge-3", sourceId: "node-3", targetId: "node-4", label: "ukládá do", color: "#888", thickness: 1 },
      { id: "edge-4", sourceId: "node-2", targetId: "node-5", label: "volá", color: "#888", thickness: 1 },
      { id: "edge-5", sourceId: "node-5", targetId: "node-3", label: "komunikuje s", color: "#888", thickness: 1 },
      { id: "edge-6", sourceId: "node-3", targetId: "node-6", label: "ověřuje", color: "#888", thickness: 1 },
      { id: "edge-7", sourceId: "node-2", targetId: "node-7", label: "používá", color: "#888", thickness: 1 },
      { id: "edge-8", sourceId: "node-2", targetId: "node-8", label: "využívá", color: "#888", thickness: 1 },
    ],
  },
  {
    id: "mindmap-2",
    title: "Uživatelské role a oprávnění",
    description: "Přehled uživatelských rolí, jejich oprávnění a vztahy mezi nimi.",
    tags: ["uživatelé", "role", "oprávnění", "bezpečnost"],
    color: "#3b82f6",
    thumbnail: "#3b82f6",
    createdAt: "2025-03-20T09:15:00Z",
    updatedAt: "2025-03-28T13:45:00Z",
    author: "Nela Letochová",
    nodeCount: 15,
    isPublic: true,
    viewMode: "tree" as const,
    nodes: [
      { id: "node-1", text: "Role", x: 250, y: 200, color: "#3b82f6" },
      { id: "node-2", text: "Admin", x: 100, y: 100, color: "#8b5cf6" },
      { id: "node-3", text: "Editor", x: 400, y: 100, color: "#10b981" },
      { id: "node-4", text: "Viewer", x: 400, y: 300, color: "#f59e0b" },
      { id: "node-5", text: "Guest", x: 100, y: 300, color: "#ef4444" },
      { id: "node-6", text: "Project Manager", x: 250, y: 50, color: "#14b8a6" },
      { id: "node-7", text: "Team Member", x: 500, y: 200, color: "#ec4899" },
    ],
    connections: [
      { id: "edge-1", sourceId: "node-1", targetId: "node-2", label: "zahrnuje", color: "#888", thickness: 1 },
      { id: "edge-2", sourceId: "node-1", targetId: "node-3", label: "zahrnuje", color: "#888", thickness: 1 },
      { id: "edge-3", sourceId: "node-1", targetId: "node-4", label: "zahrnuje", color: "#888", thickness: 1 },
      { id: "edge-4", sourceId: "node-1", targetId: "node-5", label: "zahrnuje", color: "#888", thickness: 1 },
      { id: "edge-5", sourceId: "node-1", targetId: "node-6", label: "zahrnuje", color: "#888", thickness: 1 },
      { id: "edge-6", sourceId: "node-1", targetId: "node-7", label: "zahrnuje", color: "#888", thickness: 1 },
      { id: "edge-7", sourceId: "node-2", targetId: "node-3", label: "nadřazený", color: "#888", thickness: 1 },
      { id: "edge-8", sourceId: "node-3", targetId: "node-4", label: "nadřazený", color: "#888", thickness: 1 },
    ],
  },
  {
    id: "mindmap-3",
    title: "Datový model",
    description: "Struktura dat a vztahy mezi entitami v systému.",
    tags: ["data", "model", "entity", "databáze"],
    color: "#10b981",
    thumbnail: "#10b981",
    createdAt: "2025-03-10T16:30:00Z",
    updatedAt: "2025-03-25T11:20:00Z",
    author: "Nela Letochová",
    nodeCount: 32,
    isPublic: false,
    viewMode: "network" as const,
    nodes: [
      { id: "node-1", text: "Entity", x: 250, y: 200, color: "#10b981" },
      { id: "node-2", text: "Projekt", x: 100, y: 100, color: "#3b82f6" },
      { id: "node-3", text: "Issue", x: 400, y: 100, color: "#8b5cf6" },
      { id: "node-4", text: "Uživatel", x: 400, y: 300, color: "#f59e0b" },
      { id: "node-5", text: "Dokument", x: 100, y: 300, color: "#ef4444" },
      { id: "node-6", text: "Tag", x: 250, y: 400, color: "#6366f1" },
      { id: "node-7", text: "Komentář", x: 500, y: 200, color: "#ec4899" },
      { id: "node-8", text: "Skupina", x: 550, y: 300, color: "#14b8a6" },
      { id: "node-9", text: "Notifikace", x: 0, y: 200, color: "#0ea5e9" },
    ],
    connections: [
      { id: "edge-1", sourceId: "node-2", targetId: "node-3", label: "obsahuje", color: "#888", thickness: 1 },
      { id: "edge-2", sourceId: "node-3", targetId: "node-4", label: "přiřazeno", color: "#888", thickness: 1 },
      { id: "edge-3", sourceId: "node-2", targetId: "node-4", label: "vlastní", color: "#888", thickness: 1 },
      { id: "edge-4", sourceId: "node-5", targetId: "node-2", label: "patří k", color: "#888", thickness: 1 },
      { id: "edge-5", sourceId: "node-3", targetId: "node-6", label: "má", color: "#888", thickness: 1 },
      { id: "edge-6", sourceId: "node-3", targetId: "node-7", label: "obsahuje", color: "#888", thickness: 1 },
      { id: "edge-7", sourceId: "node-4", targetId: "node-7", label: "vytváří", color: "#888", thickness: 1 },
      { id: "edge-8", sourceId: "node-4", targetId: "node-8", label: "patří do", color: "#888", thickness: 1 },
      { id: "edge-9", sourceId: "node-3", targetId: "node-9", label: "vyvolává", color: "#888", thickness: 1 },
      { id: "edge-10", sourceId: "node-9", targetId: "node-4", label: "přijímá", color: "#888", thickness: 1 },
    ],
  },
  {
    id: "mindmap-4",
    title: "Plán vývoje",
    description: "Harmonogram vývoje a milníky projektu.",
    tags: ["plán", "vývoj", "milníky"],
    color: "#f59e0b",
    thumbnail: "#f59e0b",
    createdAt: "2025-03-05T08:45:00Z",
    updatedAt: "2025-04-02T15:10:00Z",
    author: "Nela Letochová",
    nodeCount: 18,
    isPublic: false,
    viewMode: "tree" as const,
    nodes: [
      { id: "node-1", text: "Plán", x: 250, y: 200, color: "#f59e0b" },
      { id: "node-2", text: "Q1", x: 100, y: 100, color: "#3b82f6" },
      { id: "node-3", text: "Q2", x: 400, y: 100, color: "#10b981" },
      { id: "node-4", text: "Q3", x: 400, y: 300, color: "#8b5cf6" },
      { id: "node-5", text: "Q4", x: 100, y: 300, color: "#ef4444" },
      { id: "node-6", text: "MVP", x: 150, y: 150, color: "#6366f1" },
      { id: "node-7", text: "Beta", x: 350, y: 150, color: "#ec4899" },
      { id: "node-8", text: "Release", x: 400, y: 250, color: "#14b8a6" },
      { id: "node-9", text: "Iterace 1", x: 50, y: 50, color: "#0ea5e9" },
      { id: "node-10", text: "Iterace 2", x: 150, y: 50, color: "#d946ef" },
    ],
    connections: [
      { id: "edge-1", sourceId: "node-1", targetId: "node-2", label: "zahrnuje", color: "#888", thickness: 1 },
      { id: "edge-2", sourceId: "node-1", targetId: "node-3", label: "zahrnuje", color: "#888", thickness: 1 },
      { id: "edge-3", sourceId: "node-1", targetId: "node-4", label: "zahrnuje", color: "#888", thickness: 1 },
      { id: "edge-4", sourceId: "node-1", targetId: "node-5", label: "zahrnuje", color: "#888", thickness: 1 },
      { id: "edge-5", sourceId: "node-2", targetId: "node-6", label: "cíl", color: "#888", thickness: 1 },
      { id: "edge-6", sourceId: "node-3", targetId: "node-7", label: "cíl", color: "#888", thickness: 1 },
      { id: "edge-7", sourceId: "node-4", targetId: "node-8", label: "cíl", color: "#888", thickness: 1 },
      { id: "edge-8", sourceId: "node-2", targetId: "node-9", label: "obsahuje", color: "#888", thickness: 1 },
      { id: "edge-9", sourceId: "node-2", targetId: "node-10", label: "obsahuje", color: "#888", thickness: 1 },
    ],
  },
  {
    id: "mindmap-5",
    title: "Brainstorming funkcí",
    description: "Myšlenková mapa funkcí a vlastností systému.",
    tags: ["brainstorming", "funkce", "vlastnosti"],
    color: "#ef4444",
    thumbnail: "#ef4444",
    createdAt: "2025-02-20T14:15:00Z",
    updatedAt: "2025-03-30T09:30:00Z",
    author: "Nela Letochová",
    nodeCount: 42,
    isPublic: true,
    viewMode: "free" as const,
    nodes: [
      { id: "node-1", text: "Funkce", x: 250, y: 200, color: "#ef4444" },
      { id: "node-2", text: "Projekty", x: 100, y: 100, color: "#3b82f6" },
      { id: "node-3", text: "Dokumenty", x: 400, y: 100, color: "#10b981" },
      { id: "node-4", text: "Kanban", x: 400, y: 300, color: "#8b5cf6" },
      { id: "node-5", text: "Kalendář", x: 100, y: 300, color: "#f59e0b" },
      { id: "node-6", text: "Notifikace", x: 0, y: 200, color: "#6366f1" },
      { id: "node-7", text: "Chat", x: 500, y: 200, color: "#ec4899" },
      { id: "node-8", text: "Reporty", x: 300, y: 400, color: "#14b8a6" },
      { id: "node-9", text: "Automatizace", x: 500, y: 400, color: "#0ea5e9" },
      { id: "node-10", text: "Integrace", x: 150, y: 400, color: "#d946ef" },
      { id: "node-11", text: "Dashboard", x: 300, y: 0, color: "#f43f5e" },
      { id: "node-12", text: "Úkoly", x: 150, y: 0, color: "#84cc16" },
    ],
    connections: [
      { id: "edge-1", sourceId: "node-1", targetId: "node-2", label: "obsahuje", color: "#888", thickness: 1 },
      { id: "edge-2", sourceId: "node-1", targetId: "node-3", label: "obsahuje", color: "#888", thickness: 1 },
      { id: "edge-3", sourceId: "node-1", targetId: "node-4", label: "obsahuje", color: "#888", thickness: 1 },
      { id: "edge-4", sourceId: "node-1", targetId: "node-5", label: "obsahuje", color: "#888", thickness: 1 },
      { id: "edge-5", sourceId: "node-1", targetId: "node-6", label: "obsahuje", color: "#888", thickness: 1 },
      { id: "edge-6", sourceId: "node-1", targetId: "node-7", label: "obsahuje", color: "#888", thickness: 1 },
      { id: "edge-7", sourceId: "node-1", targetId: "node-8", label: "obsahuje", color: "#888", thickness: 1 },
      { id: "edge-8", sourceId: "node-1", targetId: "node-9", label: "obsahuje", color: "#888", thickness: 1 },
      { id: "edge-9", sourceId: "node-1", targetId: "node-10", label: "obsahuje", color: "#888", thickness: 1 },
      { id: "edge-10", sourceId: "node-1", targetId: "node-11", label: "obsahuje", color: "#888", thickness: 1 },
      { id: "edge-11", sourceId: "node-1", targetId: "node-12", label: "obsahuje", color: "#888", thickness: 1 },
      { id: "edge-12", sourceId: "node-4", targetId: "node-12", label: "zobrazuje", color: "#888", thickness: 1 },
    ],
  },
  {
    id: "mindmap-6",
    title: "Architektura mikro-služeb",
    description: "Schéma architektury mikroslužeb a jejich komunikace.",
    tags: ["mikroslužby", "architektura", "systém", "cloud"],
    color: "#6366f1",
    thumbnail: "#6366f1",
    createdAt: "2025-03-01T10:15:00Z",
    updatedAt: "2025-04-03T11:20:00Z",
    author: "Nela Letochová",
    nodeCount: 12,
    isPublic: false,
    viewMode: "network" as const,
    nodes: [
      { id: "node-1", text: "API Gateway", x: 250, y: 100, color: "#6366f1" },
      { id: "node-2", text: "Uživatelský servis", x: 100, y: 200, color: "#3b82f6" },
      { id: "node-3", text: "Projektový servis", x: 250, y: 200, color: "#10b981" },
      { id: "node-4", text: "Dokumentový servis", x: 400, y: 200, color: "#f59e0b" },
      { id: "node-5", text: "Autentizační servis", x: 100, y: 300, color: "#ef4444" },
      { id: "node-6", text: "Notifikační servis", x: 400, y: 300, color: "#ec4899" },
      { id: "node-7", text: "Message Queue", x: 250, y: 350, color: "#84cc16" },
    ],
    connections: [
      { id: "edge-1", sourceId: "node-1", targetId: "node-2", label: "směruje", color: "#888", thickness: 1 },
      { id: "edge-2", sourceId: "node-1", targetId: "node-3", label: "směruje", color: "#888", thickness: 1 },
      { id: "edge-3", sourceId: "node-1", targetId: "node-4", label: "směruje", color: "#888", thickness: 1 },
      { id: "edge-4", sourceId: "node-1", targetId: "node-5", label: "ověřuje", color: "#888", thickness: 1 },
      { id: "edge-5", sourceId: "node-2", targetId: "node-5", label: "používá", color: "#888", thickness: 1 },
      { id: "edge-6", sourceId: "node-3", targetId: "node-7", label: "publikuje", color: "#888", thickness: 1 },
      { id: "edge-7", sourceId: "node-7", targetId: "node-6", label: "konzumuje", color: "#888", thickness: 1 },
      { id: "edge-8", sourceId: "node-3", targetId: "node-4", label: "volá", color: "#888", thickness: 1 },
    ],
  },
];

export const MOCK_CONCEPTS: Concept[] = [
  {
    id: "concept-1",
    title: "Architektura MVC",
    description:
      "Model-View-Controller je návrhový vzor používaný pro vývoj software, který odděluje aplikační logiku od uživatelského rozhraní.",
    tags: ["architektura", "návrhový vzor", "software"],
    related: [
      { id: "concept-2", title: "Frontend", relation: "is_a" },
      { id: "concept-3", title: "Backend", relation: "related_to" },
    ],
    lastModified: "2025-03-28T15:30:00Z",
    createdAt: "2025-03-10T09:30:00Z",
    author: "Nela Letochová",
  },
  {
    id: "concept-2",
    title: "Frontend",
    description: "Frontend je část aplikace, která běží na straně klienta a zajišťuje interakci s uživatelem.",
    tags: ["webová aplikace", "uživatelské rozhraní"],
    related: [
      { id: "concept-1", title: "Architektura MVC", relation: "part_of" },
      { id: "concept-4", title: "React", relation: "has_a" },
      { id: "concept-3", title: "Backend", relation: "depends_on" },
    ],
    lastModified: "2025-03-20T10:15:00Z",
    createdAt: "2025-03-10T09:30:00Z",
    author: "Nela Letochová",
  },
  {
    id: "concept-3",
    title: "Backend",
    description: "Backend je serverová část aplikace, která zpracovává business logiku a pracuje s databází.",
    tags: ["server", "api", "databáze"],
    related: [
      { id: "concept-2", title: "Frontend", relation: "related_to" },
      { id: "concept-5", title: "Databáze", relation: "has_a" },
    ],
    lastModified: "2025-03-15T09:45:00Z",
    createdAt: "2025-03-10T09:30:00Z",
    author: "Nela Letochová",
  },
  {
    id: "concept-4",
    title: "React",
    description: "React je JavaScriptová knihovna pro tvorbu uživatelských rozhraní.",
    tags: ["frontend", "javascript", "knihovna"],
    related: [
      { id: "concept-2", title: "Frontend", relation: "part_of" },
    ],
    lastModified: "2025-04-02T14:00:00Z",
    createdAt: "2025-03-10T09:30:00Z",
    author: "Nela Letochová",
  },
  {
    id: "concept-5",
    title: "Databáze",
    description: "Databáze je organizovaná kolekce dat, která je přístupná, spravovatelná a aktualizovatelná.",
    tags: ["backend", "data", "storage"],
    related: [
      { id: "concept-3", title: "Backend", relation: "part_of" },
    ],
    lastModified: "2025-03-10T11:20:00Z",
    createdAt: "2025-03-10T09:30:00Z",
    author: "Nela Letochová",
  },
];

// TODO (NL): Zařídit, aby se mock data načítala jen jednou na začátku aplikace?
export const MOCK_TAGS: KnowledgeTag[] = [
  {
    id: "tag-1",
    name: "architektura",
    description: "Dokumenty a koncepty týkající se architektury systému",
    color: "#8b5cf6",
    count: {
      documents: 5,
      concepts: 3,
      mindmaps: 1,
    },
    createdAt: "2025-03-10T09:30:00Z",
  },
  {
    id: "tag-2",
    name: "databáze",
    description: "Materiály o databázích, jejich správě a optimalizaci",
    color: "#3b82f6",
    count: {
      documents: 3,
      concepts: 2,
      mindmaps: 1,
    },
    createdAt: "2025-03-12T11:15:00Z",
  },
  {
    id: "tag-3",
    name: "frontend",
    description: "Vše o frontendu, UI komponentách a uživatelském rozhraní",
    color: "#10b981",
    count: {
      documents: 7,
      concepts: 4,
      mindmaps: 0,
    },
    createdAt: "2025-03-15T14:45:00Z",
  },
  {
    id: "tag-4",
    name: "backend",
    description: "Materiály týkající se backendu, API a serverových služeb",
    color: "#f59e0b",
    count: {
      documents: 6,
      concepts: 3,
      mindmaps: 0,
    },
    createdAt: "2025-03-18T10:20:00Z",
  },
  {
    id: "tag-5",
    name: "bezpečnost",
    description: "Dokumenty a koncepty o zabezpečení, autentizaci a autorizaci",
    color: "#ef4444",
    count: {
      documents: 2,
      concepts: 1,
      mindmaps: 1,
    },
    createdAt: "2025-03-20T09:10:00Z",
  },
  {
    id: "tag-6",
    name: "výkon",
    description: "Optimalizace výkonu, škálování a benchmark",
    color: "#ec4899",
    count: {
      documents: 3,
      concepts: 2,
      mindmaps: 0,
    },
    createdAt: "2025-03-25T16:30:00Z",
  },
  {
    id: "tag-7",
    name: "dokumentace",
    description: "Veškerá dokumentace projektu, API, komponent a systému",
    color: "#6366f1",
    count: {
      documents: 12,
      concepts: 0,
      mindmaps: 2,
    },
    createdAt: "2025-03-05T08:45:00Z",
  },
  {
    id: "tag-8",
    name: "testování",
    description: "Materiály o testování, testovacích strategiích a nástrojích",
    color: "#a855f7",
    count: {
      documents: 4,
      concepts: 2,
      mindmaps: 1,
    },
    createdAt: "2025-03-28T13:20:00Z",
  },
];

export const COLOR_PRESETS = [
  "#8b5cf6",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#6366f1",
  "#a855f7",
  "#64748b",
];

export const mockActivities: Activity[] = [
  {
    id: "1",
    type: ACTIVITY_TYPES.ISSUE,
    title: "Implementace nového API endpointu",
    description: "Přidán nový endpoint pro správu uživatelských rolí",
    timestamp: "2024-04-25T10:30:00",
    user: {
      name: "Jan Novák",
      avatar: generateAvatar("jan", "male"),
    },
    status: ACTIVITY_STATUSES.IN_PROGRESS,
    priority: "high",
  },
  {
    id: "2",
    type: ACTIVITY_TYPES.DOCUMENT,
    title: "Aktualizace dokumentace API",
    description: "Přidána dokumentace pro nové endpointy",
    timestamp: "2024-04-25T09:15:00",
    user: {
      name: "Petra Svobodová",
      avatar: generateAvatar("petra", "female"),
    },
  },
  {
    id: "3",
    type: ACTIVITY_TYPES.CONCEPT,
    title: "Nový koncept: Microservices architektura",
    description: "Vytvořen nový koncept pro budoucí rozšíření systému",
    timestamp: "2024-04-25T08:45:00",
    user: {
      name: "Martin Dvořák",
      avatar: generateAvatar("martin", "male"),
    },
  },
  {
    id: "4",
    type: ACTIVITY_TYPES.MINDMAP,
    title: "Aktualizace myšlenkové mapy projektu",
    description: "Přidány nové větve pro plánované funkce",
    timestamp: "2024-04-24T16:20:00",
    user: {
      name: "Eva Králová",
      avatar: generateAvatar("eva", "female"),
    },
  },
  {
    id: "5",
    type: ACTIVITY_TYPES.MESSAGE,
    title: "Nová zpráva v inboxu",
    description: "Přijata nová zpráva od klienta ohledně požadavků na projekt",
    timestamp: "2024-04-24T15:30:00",
    user: {
      name: "Tomáš Malý",
      avatar: generateAvatar("tomas", "male"),
    },
  },
];

export const mockActivityChartData: Record<StatisticsPeriod, ActivityChartData[]> = {
  [STATISTICS_PERIODS.WEEK]: [
    { name: "Po", issues: 4, documents: 2, concepts: 1 },
    { name: "Út", issues: 6, documents: 3, concepts: 2 },
    { name: "St", issues: 8, documents: 4, concepts: 3 },
    { name: "Čt", issues: 5, documents: 5, concepts: 2 },
    { name: "Pá", issues: 7, documents: 3, concepts: 4 },
    { name: "So", issues: 2, documents: 1, concepts: 1 },
    { name: "Ne", issues: 1, documents: 0, concepts: 0 },
  ],
  [STATISTICS_PERIODS.MONTH]: [
    { name: "1. týden", issues: 20, documents: 10, concepts: 5 },
    { name: "2. týden", issues: 25, documents: 15, concepts: 8 },
    { name: "3. týden", issues: 18, documents: 12, concepts: 6 },
    { name: "4. týden", issues: 22, documents: 14, concepts: 7 },
  ],
  [STATISTICS_PERIODS.QUARTER]: [
    { name: "Leden", issues: 80, documents: 40, concepts: 20 },
    { name: "Únor", issues: 90, documents: 45, concepts: 25 },
    { name: "Březen", issues: 85, documents: 42, concepts: 22 },
  ],
  [STATISTICS_PERIODS.YEAR]: [
    { name: "Q1", issues: 255, documents: 127, concepts: 67 },
    { name: "Q2", issues: 280, documents: 140, concepts: 75 },
    { name: "Q3", issues: 265, documents: 132, concepts: 70 },
    { name: "Q4", issues: 290, documents: 145, concepts: 78 },
  ],
};

export const mockIssuesData: Record<StatisticsPeriod, PieChartData[]> = {
  [STATISTICS_PERIODS.WEEK]: [
    { name: "Otevřené", value: 45 },
    { name: "V řešení", value: 35 },
    { name: "Uzavřené", value: 20 },
  ],
  [STATISTICS_PERIODS.MONTH]: [
    { name: "Otevřené", value: 40 },
    { name: "V řešení", value: 35 },
    { name: "Uzavřené", value: 25 },
  ],
  [STATISTICS_PERIODS.QUARTER]: [
    { name: "Otevřené", value: 35 },
    { name: "V řešení", value: 40 },
    { name: "Uzavřené", value: 25 },
  ],
  [STATISTICS_PERIODS.YEAR]: [
    { name: "Otevřené", value: 30 },
    { name: "V řešení", value: 45 },
    { name: "Uzavřené", value: 25 },
  ],
};

export const mockKnowledgeData: Record<StatisticsPeriod, PieChartData[]> = {
  [STATISTICS_PERIODS.WEEK]: [
    { name: "Dokumenty", value: 60 },
    { name: "Koncepty", value: 25 },
    { name: "Myšlenkové mapy", value: 15 },
  ],
  [STATISTICS_PERIODS.MONTH]: [
    { name: "Dokumenty", value: 55 },
    { name: "Koncepty", value: 30 },
    { name: "Myšlenkové mapy", value: 15 },
  ],
  [STATISTICS_PERIODS.QUARTER]: [
    { name: "Dokumenty", value: 50 },
    { name: "Koncepty", value: 35 },
    { name: "Myšlenkové mapy", value: 15 },
  ],
  [STATISTICS_PERIODS.YEAR]: [
    { name: "Dokumenty", value: 45 },
    { name: "Koncepty", value: 40 },
    { name: "Myšlenkové mapy", value: 15 },
  ],
};

export const mockSearchData: Record<StatisticsPeriod, PieChartData[]> = {
  [STATISTICS_PERIODS.WEEK]: [
    { name: "Úspěšné", value: 92 },
    { name: "Částečné", value: 5 },
    { name: "Neúspěšné", value: 3 },
  ],
  [STATISTICS_PERIODS.MONTH]: [
    { name: "Úspěšné", value: 90 },
    { name: "Částečné", value: 7 },
    { name: "Neúspěšné", value: 3 },
  ],
  [STATISTICS_PERIODS.QUARTER]: [
    { name: "Úspěšné", value: 88 },
    { name: "Částečné", value: 8 },
    { name: "Neúspěšné", value: 4 },
  ],
  [STATISTICS_PERIODS.YEAR]: [
    { name: "Úspěšné", value: 85 },
    { name: "Částečné", value: 10 },
    { name: "Neúspěšné", value: 5 },
  ],
};

export const mockStatCards: StatCardData[] = [
  {
    title: "Issues",
    icon: "AlertCircle",
    value: 156,
    change: "+12% oproti minulému měsíci",
    progressLabel: "Otevřené",
    progressValue: 45,
  },
  {
    title: "Dokumenty",
    icon: "Book",
    value: 234,
    change: "+8% oproti minulému měsíci",
    progressLabel: "Nové",
    progressValue: 28,
  },
  {
    title: "Myšlenkové mapy",
    icon: "Map",
    value: 45,
    change: "+5 nových tento měsíc",
    progressLabel: "Aktivní",
    progressValue: 82,
  },
  {
    title: "Vyhledávání",
    icon: "Search",
    value: 1234,
    change: "+15% oproti minulému měsíci",
    progressLabel: "Úspěšné",
    progressValue: 92,
  },
];
