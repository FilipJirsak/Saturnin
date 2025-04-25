import { ThemeToggle } from "~/features/darkMode/ThemeToggle";
import { SignUpForm } from "~/features/authentication/SignupForm";
import { Inbox } from "lucide-react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { requireGuest } from "~/utils/authGuard";

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
            <Link to="/" className="flex items-center gap-2 font-medium font-display">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Inbox className="size-4" />
              </div>
              Saturnin
            </Link>
            <ThemeToggle />
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md">
              <SignUpForm />
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
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Proč si nás vybrat?</h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-lg">Intuitivní rozhraní pro správu projektů</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-lg">Rychlé a efektivní sledování issues</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-lg">Bezpečná a spolehlivá týmová komunikace</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
