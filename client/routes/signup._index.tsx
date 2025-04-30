import { ThemeToggle } from "~/features/darkMode/ThemeToggle";
import { SignUpForm } from "~/features/authentication/SignupForm";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { requireGuest } from "~/utils/authGuard";
import { CheckCircle, Laptop, Lock, Users } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Registrace | Saturnin" },
    { name: "description", content: "Vytvořte si nový účet a začněte používat naši službu" },
  ];
};

export const loader = async (args: LoaderFunctionArgs) => {
  await requireGuest(args);

  // TODO (NL): Přidat logiku pro registraci
  return {};
};

export default function SignUpPage() {
  return (
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/*TODO (NL): Upravit logo*/}
              <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-8 w-auto dark:invert"
              />
              <span className="text-xl font-semibold font-display">Saturnin</span>
            </div>
            <ThemeToggle/>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md">
              <SignUpForm/>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>© 2025 Saturnin. Všechna práva vyhrazena.</p>
          </div>
        </div>

        <div className="relative hidden bg-muted lg:block">
          <img
              src="/image_login-signup.jpg"
              alt="Registrační obrázek"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/0 dark:from-background/90">
            <div className="absolute bottom-0 left-0 right-0 p-16">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Proč si nás vybrat?</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <Laptop className="h-6 w-6 text-primary" />
                    <span className="text-lg">Intuitivní rozhraní pro správu projektů</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <span className="text-lg">Rychlé a efektivní sledování issues</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-primary" />
                    <span className="text-lg">Bezpečná a spolehlivá týmová komunikace</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Lock className="h-6 w-6 text-primary" />
                    <span className="text-lg">Pokročilé zabezpečení dat a osobních údajů</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
