import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Lock, Key } from "lucide-react";

// TODO (NL): Upravit texty
// TODO (NL): Přidat validaci hesel
// TODO (NL): Přidat podporu pro více typů 2FA
// TODO (NL): Přidat podporu pro více bezpečnostních klíčů
export function SecuritySection() {
  return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Změna hesla</CardTitle>
            <CardDescription>
              Změň své heslo pro zvýšení bezpečnosti
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Současné heslo</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nové heslo</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Potvrď nové heslo</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            {/* TODO (NL): Implementovat změnu hesla na backendu */}
            <Button>Aktualizovat heslo</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dvoufaktorové ověření</CardTitle>
            <CardDescription>
              Zvyš zabezpečení svého účtu pomocí dvoufaktorového ověření
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Autentizační aplikace</p>
                  <p className="text-sm text-muted-foreground">
                    Použij autentizační aplikaci k vygenerování jednorázových kódů
                  </p>
                </div>
              </div>
              <Switch />
            </div>
            {/* TODO (NL): Implementovat 2FA na backendu */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Bezpečnostní klíč</p>
                  <p className="text-sm text-muted-foreground">
                    Použij bezpečnostní klíč pro přihlášení
                  </p>
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            {/* TODO (NL): Implementovat sledování historie přihlášení na backendu */}
            <CardTitle>Historie přihlášení</CardTitle>
            <CardDescription>
              Zkontroluj nedávné přihlášení k tvému účtu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Chrome na macOS</p>
                  <p className="text-sm text-muted-foreground">Praha, Česko • Dnes, 14:03</p>
                </div>
                <Badge>Aktuální</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Firefox na Windows</p>
                  <p className="text-sm text-muted-foreground">Praha, Česko • Včera, 10:42</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Safari na iPhone</p>
                  <p className="text-sm text-muted-foreground">Brno, Česko • 23. března 2025</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </>
  );
}
