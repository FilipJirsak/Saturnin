import { useLoaderData, Outlet, Link, useParams, useLocation } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

export async function loader({ params }: LoaderFunctionArgs) {
  const projectCode = params.projectCode;

  const response = await fetch(`http://localhost:8080/api/project/${projectCode}`);

  if (!response.ok) {
    throw new Response("Projekt nenalezen", { status: 404 });
  }

  const project = await response.json();

  const issueResponse = await fetch(`http://localhost:8080/api/project/${projectCode}/issue`);
  const issues = await issueResponse.json();

  return new Response(JSON.stringify({ project, issues }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export default function ProjectLayout() {
  const { project, issues } = useLoaderData<typeof loader>();
  const params = useParams();
  const location = useLocation();

  const path = location.pathname;
  const viewPath = path.includes('/board') ? 'board' :
      path.includes('/issues') ? 'issues' :
          path.includes('/calendar') ? 'calendar' :
              path.includes('/milestones') ? 'milestones' : 'detail';

  const views = [
    { id: 'detail', label: 'Detail', path: `/projects/${params.projectCode}` },
    { id: 'issues', label: 'Issues', path: `/projects/${params.projectCode}/issues` },
    { id: 'board', label: 'Kanban', path: `/projects/${params.projectCode}/board` },
    { id: 'calendar', label: 'Kalendář', path: `/projects/${params.projectCode}/calendar` },
    { id: 'milestones', label: 'Milníky', path: `/projects/${params.projectCode}/milestones` }
  ];

  return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h1 className="text-2xl font-semibold">
              {project.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Kód projektu: {project.code}
            </p>
          </CardContent>
        </Card>

        <Tabs value={viewPath} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            {views.map(view => (
                <TabsTrigger
                    key={view.id}
                    value={view.id}
                    asChild
                >
                  <Link to={view.path}>{view.label}</Link>
                </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Outlet context={{ project, issues }} />
      </div>
  );
}
