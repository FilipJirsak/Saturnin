import { type MetaFunction } from "@remix-run/node";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Brain, GitFork, Activity, Clock, CheckSquare } from "lucide-react";

export const meta: MetaFunction = () => {
    return [
        { title: "Saturnin - Správa znalostí" },
        { name: "description", content: "Systém pro správu znalostí a projektů" },
    ];
};

//TODO (NL): Prozatím jen náhled, bude potřeba upravit
export default function MainPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktivní projekty
            </CardTitle>
            <GitFork className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              +2 tento měsíc
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Znalostní báze
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">246</div>
            <p className="text-xs text-muted-foreground">
              +20 tento týden
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktivní úkoly
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              3 due today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dokončené
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              +24 tento měsíc
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nedávná aktivita</CardTitle>
          <CardDescription>
            Přehled vašich posledních aktivit napříč projekty
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Aktualizován dokument: Teoretická část</p>
                <p className="text-xs text-muted-foreground">před 2 hodinami</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Vytvořen nový úkol: Implementace API</p>
                <p className="text-xs text-muted-foreground">před 4 hodinami</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Přidán nový tag: #research</p>
                <p className="text-xs text-muted-foreground">před 6 hodinami</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
