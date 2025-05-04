"use client";

import { FolderKanban } from "lucide-react";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "~/components/ui/sidebar";
import { TeamSwitcher } from "~/components/layout/TeamSwitcher";
import { NavMain } from "~/components/layout/NavMain";
import { NavProjects } from "~/components/layout/NavProjects";
import { NavUser } from "~/components/layout/NavUser";
import { ComponentProps } from "react";
import { ProjectWithIssues } from "~/types";
import { sidebarItems } from "~/lib/data";

interface AppSidebarProps extends ComponentProps<typeof Sidebar> {
  projects?: ProjectWithIssues[];
}

export function AppSidebar({ projects = [], ...props }: AppSidebarProps) {
  const sidebarProjects = projects.map((project) => ({
    name: project.title,
    url: `/projects/${project.code}`,
    icon: FolderKanban,
  }));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex flex-col gap-2">
        <TeamSwitcher teams={sidebarItems.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems.navMain} />
        <NavProjects projects={sidebarProjects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarItems.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
