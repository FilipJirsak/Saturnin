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
  Users
} from "lucide-react";

export const sidebarItems = {
  user: {
    name: "Nela Letochová",
    email: "nela.letochova@example.com",
    avatar: "/avatars/user.jpg",
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
    }
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
        }
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
        }
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
        {
          title: "Seznam issues",
          url: "/projects/tasks",
        },
        {
          title: "Milníky",
          url: "/projects/milestones",
        }
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
    }
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
}
