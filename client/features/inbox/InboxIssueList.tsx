import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Inbox, RefreshCw } from "lucide-react";
import { IssueFull, ProjectFull } from "~/types";
import { filterRecentItems } from "~/utils/dateUtils";
import { useToast } from "~/hooks/use-toast";
import {EmptyState} from "~/components/states/EmptyState";
import {InboxIssueCard} from "~/features/inbox/InboxIssueCard";

interface IssueListProps {
  issues: IssueFull[];
  projects: ProjectFull[];
  onIssueAssigned: (issueCode: string, projectCode: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export function InboxIssueList({
                            issues,
                            projects,
                            onIssueAssigned,
                            onRefresh
                          }: IssueListProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [assigningIssueCode, setAssigningIssueCode] = useState<string | null>(null);
  const { toast } = useToast();

  const recentIssues = filterRecentItems(issues);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Chyba při aktualizaci",
        description: "Nepodařilo se načíst aktuální data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignToProject = async (issueCode: string, projectCode: string) => {
    setAssigningIssueCode(issueCode);

    try {
      await onIssueAssigned(issueCode, projectCode);
    } catch (error) {
      console.error(error);
      toast({
        title: "Chyba při přiřazování",
        description: "Nepodařilo se přiřadit issue k projektu",
        variant: "destructive",
      });
    } finally {
      setAssigningIssueCode(null);
    }
  };

  return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-2">
          <div className="flex flex-col gap-y-2">
            <CardTitle>Inbox</CardTitle>
            <CardDescription>Tvé nezpracované issues</CardDescription>
          </div>
          <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
          >
            {/*TODO (NL): Přidat funkcionalitu na obnovení*/}
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Obnovit
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">Všechny</TabsTrigger>
              <TabsTrigger value="recent">Nedávné</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {issues.length === 0 ? (
                  <EmptyState icon={Inbox} message="Tvůj inbox je zatím prázdný" />
              ) : (
                  <div className="space-y-4 mt-4">
                    {issues.map(issue => (
                        <InboxIssueCard
                            key={issue.code}
                            issue={issue}
                            projects={projects}
                            onAssign={handleAssignToProject}
                            isAssigning={assigningIssueCode === issue.code}
                        />
                    ))}
                  </div>
              )}
            </TabsContent>
            <TabsContent value="recent">
              {recentIssues.length === 0 ? (
                  <EmptyState icon={Inbox} message="Nemáš žádné nedávno přidané issues" />
              ) : (
                  <div className="space-y-4 mt-4">
                    {recentIssues.map(issue => (
                        <InboxIssueCard
                            key={issue.code}
                            issue={issue}
                            projects={projects}
                            onAssign={handleAssignToProject}
                            isAssigning={assigningIssueCode === issue.code}
                        />
                    ))}
                    <p className="text-xs text-center text-surface-500 mt-6">
                      Zobrazují se issues přidané v posledních 7 dnech
                    </p>
                  </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
  );
}
