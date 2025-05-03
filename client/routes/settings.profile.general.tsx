import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { ProfileSection } from "~/features/settings/ProfileSection";
import { AccountsSection } from "~/features/settings/AccountsSection";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { requireAuth } from "~/utils/authGuard";
import { sidebarItems } from "~/lib/data";

export const meta: MetaFunction = () => {
  return [
    { title: "Nastavení - Obecné informace | Saturnin" },
    { name: "description", content: "Základní nastavení profilu" },
  ];
};

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuth(args);

  return null;
};

export default function GeneralProfileRoute() {
  return (
      <div className="space-y-6">
        <ProfileSection user={sidebarItems.user} />
        <AccountsSection />

        <Card className="bg-destructive/5 border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Smazat účet</CardTitle>
            <CardDescription>
              Trvale odstraníš svůj účet a všechna související data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Smazání účtu je nevratná akce a odstraní všechna tvá data. Před pokračováním se ujisti, že sis zálohoval/a všechna potřebná data.
            </p>
          </CardContent>
          {/* TODO (NL): Implementovat smazání účtu na backendu */}
          <CardFooter>
            <Button variant="destructive">Smazat účet</Button>
          </CardFooter>
        </Card>
      </div>
  );
}
