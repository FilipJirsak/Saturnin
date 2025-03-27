"use client"

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon, ChevronDown,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar"
import {Link} from "@remix-run/react";
import {useState} from "react";

export function NavProjects({
                              projects,
                            }: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()
  const [showAll, setShowAll] = useState(false)

  const initialVisibleCount = 3
  const visibleProjects = showAll ? projects : projects.slice(0, initialVisibleCount)
  const hasMoreProjects = projects.length > initialVisibleCount

  return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Jednotlivé projekty</SidebarGroupLabel>
        <SidebarMenu>
          {visibleProjects.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">Více</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                  >
                    {/*TODO (NL): Doplnit funkcionalitu pro prohlédnutí projektu*/}
                    <DropdownMenuItem>
                      <Folder className="text-muted-foreground" />
                      <span>Prohlédnout projekt</span>
                    </DropdownMenuItem>
                    {/*TODO (NL): Doplnit funkcionalitu pro sdílení projektu*/}
                    <DropdownMenuItem>
                      <Forward className="text-muted-foreground" />
                      <span>Sdílet projekt</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {/*TODO (NL): Doplnit funkcionalitu pro smazání projektu*/}
                    <DropdownMenuItem>
                      <Trash2 className="text-muted-foreground" />
                      <span>Smazat projekt</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
          ))}
          {hasMoreProjects && (
              <SidebarMenuItem>
                <SidebarMenuButton
                    className="text-sidebar-foreground/70"
                    onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? (
                      <>
                        <ChevronDown className="rotate-180 text-sidebar-foreground/70" />
                        <span>Méně</span>
                      </>
                  ) : (
                      <>
                        <MoreHorizontal className="text-sidebar-foreground/70" />
                        <span>Více ({projects.length - initialVisibleCount})</span>
                      </>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>
  )
}
