import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { Separator } from "~/components/ui/separator";

//TODO (NL): Implementovat ukládání nastavení notifikací na backendu
//TODO (NL): Upravit texty
export function NotificationsSection() {
  return (
      <Card>
        <CardHeader>
          <CardTitle>Nastavení upozornění</CardTitle>
          <CardDescription>
            Zde můžeš upravit, jak budeš dostávat upozornění
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-medium">Email</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Denní přehled</p>
                  <p className="text-sm text-muted-foreground">
                    Přehled aktivit za posledních 24 hodin
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Oznámení o komentářích</p>
                  <p className="text-sm text-muted-foreground">
                    Když někdo komentuje tvé příspěvky
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Oznámení o úkolech</p>
                  <p className="text-sm text-muted-foreground">
                    Když ti je přiřazen nový úkol
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}
