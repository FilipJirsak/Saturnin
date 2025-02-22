import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration, useLoaderData,
} from "@remix-run/react";
import {LinksFunction} from "@remix-run/node";
import "./styles/tailwind.css";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {ReactNode, useEffect, useState} from "react";
import {createDragDropManager} from "dnd-core";
import AppLayout from "~/components/layout/AppLayout";

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

export const manager = createDragDropManager(HTML5Backend)

const ClientOnly = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? children : null;
}

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

//TODO (NL): Nutno použít i tento Layout?
export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { projects } = useLoaderData<typeof loader>();

  return (
      <ClientOnly>
        <DndProvider manager={manager} backend={HTML5Backend}>
          <AppLayout projects={projects}>
            <Outlet />
          </AppLayout>
        </DndProvider>
      </ClientOnly>
  );
}
