import { cn } from "~/utils/helpers";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { ComponentProps, FormEvent, useState } from "react";
import { Link, useNavigate } from "@remix-run/react";

// TODO (NL): Zatím pouze simulace registrace pro testovací účely --> kompletně upravit, až bude backend
// TODO (NL): Upravit texty a doplnit linky
export function SignUpForm({
                             className,
                             ...props
                           }: ComponentProps<"div">) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) return;

    setLoading(true);

    setTimeout(() => {
      navigate(`?simulateAuth=true`);
    }, 1000);
  };

  const handleOAuthSignup = (provider: string) => {
    setLoading(true);

    setTimeout(() => {
      navigate(`?simulateAuth=true`);
    }, 1000);
  };

  return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-bold font-display">Vytvořit účet</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Zaregistruj se a začni používat naši službu
          </p>
        </div>

        <form className="grid gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="name">Jméno</Label>
            <Input
                id="name"
                placeholder="Jan Novák"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
                id="email"
                type="email"
                placeholder="tvuj@email.cz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Heslo</Label>
            <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <p className="text-xs text-muted-foreground">
              Heslo musí mít alespoň 8 znaků a obsahovat písmeno a číslo.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
            />
            <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Souhlasím s{" "}
              <a href="#" className="text-primary underline-offset-2 hover:underline">
                podmínkami služby
              </a>{" "}
              a{" "}
              <a href="#" className="text-primary underline-offset-2 hover:underline">
                zásadami ochrany osobních údajů
              </a>
            </label>
          </div>

          <Button
              type="submit"
              className="w-full"
              disabled={loading || !termsAccepted}
          >
            {loading ? "Vytváření účtu..." : "Vytvořit účet"}
          </Button>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Nebo se zaregistruj pomocí
          </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleOAuthSignup('google')}
                disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                />
              </svg>
              Google
            </Button>
            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleOAuthSignup('github')}
                disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                <path
                    d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
                    fill="currentColor"
                />
              </svg>
              GitHub
            </Button>
          </div>
        </form>

        <div className="text-center text-sm">
          Už máš účet?{" "}
          <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Přihlas se
          </Link>
        </div>
      </div>
  );
}
