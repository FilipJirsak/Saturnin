import { LoginForm } from "~/features/authentication/LoginForm";
import { ThemeToggle } from "~/features/darkMode/ThemeToggle";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import {requireGuest} from "~/utils/authGuard";

export const meta: MetaFunction = () => {
  return [
    { title: "Přihlášení | Saturnin" },
    { name: "description", content: "Přihlaste se ke svému účtu" },
  ];
};

export const loader = async (args: LoaderFunctionArgs) => {
  await requireGuest(args);

  // TODO (NL): Přidat logiku pro přesměrování na stránku přihlášení, pokud je uživatel již přihlášen
  return {};
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const errorMessage = searchParams.get("error");

  return (
      <div className="flex min-h-svh flex-col bg-background">
        <header className="flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-2">
            {/*TODO (NL): Upravit logo*/}
            <img
                src="/logo.png"
                alt="Logo"
                className="h-8 w-auto dark:invert"
            />
            <span className="text-xl font-semibold font-display">Saturnin</span>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm md:max-w-3xl">
            {errorMessage && (
                <div className="mb-4 rounded-lg bg-destructive/15 p-3 text-destructive">
                  {errorMessage}
                </div>
            )}
            <LoginForm redirectTo={redirectTo} />
          </div>
        </main>

        <footer className="py-6 text-center text-sm text-muted-foreground">
          <p>© 2025 Saturnin. Všechna práva vyhrazena.</p>
        </footer>
      </div>
  );
}
