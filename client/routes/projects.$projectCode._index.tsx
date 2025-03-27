import { useOutletContext } from "@remix-run/react";
import { ProjectWithIssues, IssueFull } from "~/types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";

type ProjectContext = {
  project: ProjectWithIssues;
  issues: IssueFull[];
};

export default function ProjectDetailView() {
  const { project, issues } = useOutletContext<ProjectContext>();

  return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Přehled projektu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Detaily</h3>
                <p className="mt-2 text-sm">Počet issues: {issues.length}</p>
                <p className="text-sm">Počáteční stav issues: {project.initial_issue_state}</p>
              </div>
              <div>
                <h3 className="font-medium">Statistiky</h3>
                <div className="mt-2">
                  <p className="text-sm">Dokončené issues: {issues.filter(i => i.state === 'done').length}</p>
                  <p className="text-sm">Rozpracované: {issues.filter(i => i.state === 'in_progress').length}</p>
                  <p className="text-sm">Nové: {issues.filter(i => ['new', 'to_do'].includes(i.state)).length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nedávné issues</CardTitle>
          </CardHeader>
          <CardContent>
            {issues.length === 0 ? (
                <p className="text-muted-foreground">Žádné issues nebyly nalezeny</p>
            ) : (
                <div className="space-y-2">
                  {issues.slice(0, 5).map((issue) => (
                      <div key={issue.code} className="p-3 border rounded-md">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{issue.title || issue.summary || "Bez názvu"}</h3>
                          <Badge variant="secondary">{issue.code}</Badge>
                        </div>
                        {issue.summary && issue.title && (
                            <p className="text-sm text-muted-foreground mt-1">{issue.summary}</p>
                        )}
                        <div className="mt-2 text-xs text-muted-foreground">
                          Stav: <span className="font-medium">{issue.state}</span>
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Přidat nové issue</h3>
          <form
              className="flex gap-2"
              method="post"
              action={`/api/projects/${project.code}/issues/new`}
          >
            <Input
                type="text"
                name="title"
                placeholder="Název issue"
                className="flex-1"
                required
            />
            <Button type="submit">
              Přidat
            </Button>
          </form>
        </div>
      </div>
  );
}
