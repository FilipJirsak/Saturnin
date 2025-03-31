import { ReactNode, useEffect } from "react";
import { useHydrated } from "~/hooks/useHydrated";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const isHydrated = useHydrated();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const root = document.documentElement;
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("theme") === "system") {
        root.classList.toggle("dark", e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [isHydrated]);

  return <>{children}</>;
}
