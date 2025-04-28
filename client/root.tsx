import type { LinksFunction } from "@remix-run/node";
import {Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useLocation} from "@remix-run/react";
import "./styles/tailwind.css";
import { createDragDropManager } from "dnd-core";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { initializeConceptsIfEmpty } from "~/utils/knowledge/conceptUtils";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import AppLayout from "~/components/layout/AppLayout";
import { ThemeProvider } from "~/features/darkMode/ThemeProvider";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const manager = createDragDropManager(HTML5Backend);

const ClientOnly = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initializeConceptsIfEmpty();
  }, []);

  return mounted ? children : null;
};

export const loader = async () => {
  const resp = await fetch("http://localhost:8080/api/project");
  const projects = await resp.json();
  for await (const project of projects) {
    const issueResp = await fetch(`http://localhost:8080/api/project/${project.code}/issue`);
    project.issues = await issueResp.json();
  }
  return new Response(JSON.stringify({ projects }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const themeScript = `
(function() {
  const theme = localStorage.getItem('theme') || 'system';
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (theme === 'dark' || (theme === 'system' && prefersDarkMode)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();
`;

// TODO (NL): Nutno použít i tento Layout?
export function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="cs"
      suppressHydrationWarning
    >
    <head>
      <meta charSet="utf-8"/>
      <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
      />
      {/*<link rel="icon" href="/favicon.ico"/>*/}
      <Meta/>
      <Links/>
      <script dangerouslySetInnerHTML={{__html: themeScript}}/>
    </head>
    <body>
    {children}
    <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

//TODO (NL): Upravit, až bude implementováno přihlašování
function AuthLayout() {
  return (
      <ThemeProvider>
        <div className="min-h-svh">
          <Outlet />
        </div>
      </ThemeProvider>
  );
}

function AppLayoutWrapper({ projects }: { projects: any[] }) {
  return (
      <ThemeProvider>
        <DndProvider
            manager={manager}
            backend={HTML5Backend}
        >
          <AppLayout projects={projects}>
            <Outlet />
          </AppLayout>
        </DndProvider>
      </ThemeProvider>
  );
}

export default function App() {
  const { projects } = useLoaderData<typeof loader>();
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" ||
      location.pathname === "/signup" ||
      location.pathname === "/reset-password";

  // TODO (NL): Upravit, až bude implementováno přihlašování
  const searchParams = new URLSearchParams(location.search);
  const isSimulatedLoggedIn = searchParams.get("simulateAuth") === "true";

  return (
      <ClientOnly>
        {isAuthPage && !isSimulatedLoggedIn ? (
            <AuthLayout />
        ) : (
            <AppLayoutWrapper projects={projects} />
        )}
      </ClientOnly>
  );
}
