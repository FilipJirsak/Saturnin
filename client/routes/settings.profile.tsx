import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLocation } from "@remix-run/react";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Bell, CreditCard, Shield, UserCircle } from "lucide-react";
import { requireAuth } from "~/utils/authGuard";
import { sidebarItems } from "~/lib/data";

export const meta: MetaFunction = () => {
  return [
    { title: "Profil | Saturnin" },
    { name: "description", content: "Správa tvého uživatelského profilu" },
  ];
};

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuth(args);

  return {
    user: sidebarItems.user,
  };
};

//TODO (NL): Upravit mobilní zobrazení (hlavně tabs)
export default function ProfileLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  let activeTab = "general";
  if (currentPath.includes("/security")) activeTab = "security";
  if (currentPath.includes("/notifications")) activeTab = "notifications";
  if (currentPath.includes("/billing")) activeTab = "billing";

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold font-display">Nastavení účtu</h1>
          <p className="text-muted-foreground">
            Spravuj svůj profil, předplatné a předvolby upozornění
          </p>
        </div>

        <Tabs value={activeTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general" asChild>
              <Link to="/settings/profile/general" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                <span>Obecné</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="security" asChild>
              <Link to="/settings/profile/security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Zabezpečení</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="notifications" asChild>
              <Link to="/settings/profile/notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Upozornění</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="billing" asChild>
              <Link to="/settings/profile/billing" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Předplatné</span>
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Outlet />
      </div>
    </div>
  );
}
