import {SidebarInset, SidebarProvider, SidebarTrigger} from "~/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from "~/components/ui/breadcrumb";
import {useLocation} from "@remix-run/react";
import {Fragment, ReactNode} from "react";
import {AppSidebar} from "~/components/layout/AppSidebar";
import {Separator} from "~/components/ui/separator";
import {ProjectWithIssues} from "~/types";
import {getBreadcrumbs} from "~/utils/helpers";
import {sidebarItems} from "~/lib/data";
import {Toaster} from "~/components/ui/toaster";

interface AppLayoutProps {
  children: ReactNode;
  projects: ProjectWithIssues[];
}

const AppLayout = ({ children, projects }: AppLayoutProps) => {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname, sidebarItems.navMain);

  return (
      <div className="flex h-screen w-full overflow-hidden">
        <SidebarProvider>
          <AppSidebar projects={projects}/>
          <SidebarInset className="relative flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur dark:bg-surface-800/80">
              <div className="flex items-center gap-2 px-3">
                <SidebarTrigger/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((item, index) => (
                        <Fragment key={item.path}>
                          {index > 0 && <BreadcrumbSeparator />}
                          <BreadcrumbItem>
                            {item.isLast ? (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink href={item.path}>
                                  {item.label}
                                </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                        </Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto">
              <div className="w-full p-6">
                {children}
              </div>
            </main>
          </SidebarInset>
          <Toaster />
        </SidebarProvider>
      </div>
  );
};

export default AppLayout;
