import { useOutletContext, useSearchParams } from "@remix-run/react";
import { IssueFull, ProjectWithIssues } from "~/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { AlertCircle, BarChart4, CheckCircle, Clock, Folder, GitPullRequest, Plus } from "lucide-react";
import { cn } from "~/utils/helpers";
import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getStateColorClasses, getStateLabel } from "~/utils/issueUtils";
import { useToast } from "~/hooks/use-toast";
import { IssueSidebar } from "~/features/views/common/IssueSidebar";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: `Detail projektu ${params.projectCode} | Saturnin` },
    { name: "description", content: "Detail projektu" },
  ];
};

type ProjectContext = {
  project: ProjectWithIssues;
  issues: IssueFull[];
};

export default function ProjectDetailView() {
  const { project, issues: initialIssues } = useOutletContext<ProjectContext>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [issues, setIssues] = useState<IssueFull[]>(initialIssues);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Partial<IssueFull> | null>(null);
  const [isNewIssue, setIsNewIssue] = useState(false);

  const doneIssues = issues.filter((i) => i.state === "done").length;
  const inProgressIssues = issues.filter((i) => i.state === "in_progress").length;
  const newIssues = issues.filter((i) => ["new", "to_do"].includes(i.state)).length;

  const totalIssues = issues.length;
  const donePercent = totalIssues > 0 ? Math.round((doneIssues / totalIssues) * 100) : 0;
  const inProgressPercent = totalIssues > 0 ? Math.round((inProgressIssues / totalIssues) * 100) : 0;
  const newPercent = totalIssues > 0 ? Math.round((newIssues / totalIssues) * 100) : 0;

  useEffect(() => {
    const issueCode = searchParams.get("issueCode");
    if (issueCode) {
      const issue = issues.find((i) => i.code === issueCode);
      if (issue) {
        setSelectedIssue(issue);
        setIsNewIssue(false);
        setIsDetailsOpen(true);
      }
    }
  }, [searchParams, issues]);

  const handleCardClick = (issue: IssueFull) => {
    setSelectedIssue(issue);
    setIsNewIssue(false);
    setIsDetailsOpen(true);
    setSearchParams((prev) => {
      prev.set("issueCode", issue.code);
      return prev;
    });
  };

  const handleAddClick = () => {
    setSelectedIssue({ state: project.initial_issue_state || "new" });
    setIsNewIssue(true);
    setIsDetailsOpen(true);
    setSearchParams((prev) => {
      prev.delete("issueCode");
      return prev;
    });
  };

  const handleSidebarClose = () => {
    setIsDetailsOpen(false);
    setSelectedIssue(null);
    setSearchParams((prev) => {
      prev.delete("issueCode");
      return prev;
    });
  };

  // TODO (NL): Implementovat skutečné API volání
  const handleSaveIssue = async (updatedIssue: Partial<IssueFull>) => {
    try {
      if (isNewIssue) {
        const newIssue: IssueFull = {
          code: `${project.code}-${issues.length + 1}`,
          state: updatedIssue.state || project.initial_issue_state || "new",
          title: updatedIssue.title || "",
          summary: updatedIssue.summary || "",
          description: updatedIssue.description,
          assignee: updatedIssue.assignee,
          tags: updatedIssue.tags,
          due_date: updatedIssue.due_date,
          comments_count: 0,
          attachments_count: updatedIssue.attachments_count || 0,
          created_at: new Date().toISOString(),
          last_modified: new Date().toISOString(),
          data: updatedIssue.data,
        };

        setIssues((prevIssues) => [newIssue, ...prevIssues]);

        toast({
          title: "Issue vytvořeno",
          description: `Issue ${newIssue.code} bylo úspěšně vytvořeno`,
          variant: "success",
        });
      } else {
        setIssues((prevIssues) =>
          prevIssues.map((issue) => issue.code === selectedIssue?.code ? { ...issue, ...updatedIssue } : issue)
        );

        toast({
          title: "Issue aktualizováno",
          description: `Issue ${selectedIssue?.code} bylo úspěšně aktualizováno`,
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Failed to save issue:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se uložit issue. Zkus to prosím znovu.",
        variant: "destructive",
      });
    }

    handleSidebarClose();
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-subtle">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-2xl flex items-center font-display">
                <Folder className="mr-2 h-6 w-6 text-primary" />
                {project.title || project.code}
              </CardTitle>
            </div>
            <Badge variant="outline" className="ml-2 px-3 py-1">
              {project.code}
            </Badge>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center text-muted-foreground">
                  <GitPullRequest className="mr-2 h-4 w-4" />
                  Informace o projektu
                </h3>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground block">Kód projektu</span>
                      <span className="font-medium">{project.code}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Počáteční stav issues</span>
                      <span className="font-medium">
                        {getStateLabel(project.initial_issue_state)}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Celkem issues</span>
                      <span className="font-medium">{issues.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center text-muted-foreground">
                  <BarChart4 className="mr-2 h-4 w-4" />
                  Stav projektu
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1 text-success-foreground" />
                        Dokončené
                      </span>
                      <span>{doneIssues} z {totalIssues} ({donePercent}%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-success-foreground h-2 rounded-full"
                        style={{ width: `${donePercent}%` }}
                      >
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-primary-600" />
                        Rozpracované
                      </span>
                      <span>{inProgressIssues} z {totalIssues} ({inProgressPercent}%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${inProgressPercent}%` }}
                      >
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1 text-primary-800" />
                        Nové
                      </span>
                      <span>{newIssues} z {totalIssues} ({newPercent}%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary-800 h-2 rounded-full"
                        style={{ width: `${newPercent}%` }}
                      >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <GitPullRequest className="mr-2 h-5 w-5 text-primary" />
              Nedávné issues
            </CardTitle>
            <CardDescription>
              Zobrazuje posledních 5 issues v projektu
            </CardDescription>
          </CardHeader>
          <CardContent>
            {issues.length === 0
              ? (
                <div className="text-center py-8 bg-muted rounded-lg">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground font-medium">Žádné issues nebyly nalezeny</p>
                  <p className="text-muted-foreground text-sm mt-1">Vytvoř první issue kliknutím na tlačítko níže</p>
                </div>
              )
              : (
                <div className="space-y-4">
                  {issues.slice(0, 5).map((issue) => {
                    const stateClasses = getStateColorClasses(issue.state);
                    return (
                      <div
                        key={issue.code}
                        className="p-4 border border-border rounded-lg hover:bg-muted transition-all cursor-pointer"
                        onClick={() => handleCardClick(issue)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex-grow">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium truncate">{issue.title || issue.summary || "Bez názvu"}</h3>
                              <Badge variant="outline" className="shrink-0">{issue.code}</Badge>
                            </div>
                            {issue.summary && issue.title && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{issue.summary}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", stateClasses.circle)}></div>
                            <span className={cn("text-xs", stateClasses.text)}>{getStateLabel(issue.state)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
          </CardContent>
          <CardFooter className="pt-2 flex justify-between">
            <Link to={`/projects/${project.code}/issues`}>
              <Button variant="outline" size="sm">
                Zobrazit všechny issues
              </Button>
            </Link>
            {issues.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Celkem: {issues.length} issues
              </div>
            )}
          </CardFooter>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <Plus className="mr-2 h-5 w-5 text-primary" />
              Přidat nové issue
            </CardTitle>
            <CardDescription>
              Vytvoř nové issue pro tento projekt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={handleAddClick}
            >
              <Plus className="mr-2 h-4 w-4" />
              Přidat nové issue
            </Button>
          </CardContent>
        </Card>
      </div>

      <IssueSidebar
        isOpen={isDetailsOpen}
        issue={selectedIssue}
        projectCode={project.code}
        onClose={handleSidebarClose}
        onSave={handleSaveIssue}
        isNew={isNewIssue}
      />
    </div>
  );
}
