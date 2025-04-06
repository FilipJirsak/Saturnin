import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { CreditCard } from "lucide-react";

//TODO (NL): Implementovat zpracování plateb a správu předplatného
//TODO (NL): Upravit texty
export function BillingSection() {
  return (
      <Card>
        <CardHeader>
          <CardTitle>Plán a předplatné</CardTitle>
          <CardDescription>
            Spravuj své předplatné a platební metody
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">Free Plan</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Základní funkce pro začínající týmy
                </p>
                <div className="mt-4">
                  <Badge variant="outline" className="text-primary">Aktuální plán</Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold">0 Kč</p>
                <p className="text-sm text-muted-foreground">měsíčně</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-sm">Až 3 projekty</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-sm">Maximálně 5 členů týmu</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-sm">Základní analytika</span>
              </div>
            </div>
            <div className="mt-4">
              <Button>Upgrade na Pro</Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Platební metody</h3>
            <div className="rounded-lg border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">Přidat platební metodu</p>
                  <p className="text-sm text-muted-foreground">
                    Přidej si kreditní kartu pro rychlé platby
                  </p>
                </div>
              </div>
              <Button variant="outline">Přidat</Button>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}
