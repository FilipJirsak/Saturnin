import { useEffect, useState } from "react";
import { Laptop, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";

type Theme = "light" | "dark" | "system";

const themes = [
  {
    value: "light",
    label: "Světlý",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Tmavý",
    icon: Moon,
  },
  {
    value: "system",
    label: "Systémový",
    icon: Laptop,
  },
] as const;

export function ThemeDropdown() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    } else {
      root.classList.toggle("dark", theme === "dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const currentTheme = mounted ? theme : "system";
  const ThemeIcon = themes.find((t) => t.value === currentTheme)?.icon || Sun;

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="h-9 w-9 opacity-0" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <ThemeIcon className="h-5 w-5" />
          <span className="sr-only">Přepnout téma</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem
              key={item.value}
              onClick={() => setTheme(item.value)}
              className={theme === item.value ? "bg-muted" : ""}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
