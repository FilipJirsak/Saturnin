import { useState } from "react";
import { useOutletContext, useParams } from "@remix-run/react";
import { ProjectWithIssues, IssueFull } from "~/types";
import { Card } from "~/components/ui/card";
import { getDaysInMonth, issueToEvent, navigateDate } from "~/utils/calendarUtils";
import { CalendarNavigation } from "~/features/views/calendar/CalendarNavigation";
import { CalendarMonthView } from "~/features/views/calendar/CalendarMonthView";
import { CalendarTimeGridView } from "~/features/views/calendar/CalendarTimeGridView";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { IssueSidebar } from "~/features/views/common/IssueSidebar";
import { useToast } from "~/hooks/use-toast";
import { MetaFunction } from "@remix-run/node";

type ProjectContext = {
  project: ProjectWithIssues;
  issues: IssueFull[];
};

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: `Kalendář - ${params.projectCode} | Saturnin` },
    { name: "description", content: "Kalendářní přehled úkolů a milníků projektu" },
  ];
};

/*TODO (NL): Dodělat zobrazení detailu issue*/
export default function ProjectCalendarView() {
  const { project, issues: initialIssues } = useOutletContext<ProjectContext>();
  const { projectCode } = useParams();
  const [viewType, setViewType] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedIssue, setSelectedIssue] = useState<IssueFull | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState<IssueFull[]>(initialIssues);
  const { toast } = useToast();

  // TODO (NL): Implementovat přetahování issues mezi dny
  // TODO (NL): Implementovat možnost nastavení času pro issues
  // TODO (NL): Implementovat možnost zobrazení více issues ve stejném čase
  // TODO (NL): Implementovat možnost filtrování issues v kalendáři
  // TODO (NL): Implementovat možnost zobrazení opakujících se issues

  const handleNavigate = (direction: 'prev' | 'next') => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentDate(navigateDate(currentDate, viewType, direction));
    } catch (err) {
      setError("Nepodařilo se změnit datum. Zkuste to prosím znovu.");
      console.error("Error navigating date:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToday = () => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentDate(new Date());
    } catch (err) {
      setError("Nepodařilo se přejít na dnešní datum. Zkuste to prosím znovu.");
      console.error("Error setting today's date:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDay = (dateString: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const [year, month, day] = dateString.split('-').map(part => parseInt(part, 10));
      const selectedDate = new Date(year, month - 1, day, 0, 0, 0, 0);
      setCurrentDate(selectedDate);
    } catch (err) {
      setError("Nepodařilo se vybrat datum. Zkuste to prosím znovu.");
      console.error("Error selecting date:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIssueSelect = (issue: IssueFull) => {
    setSelectedIssue(issue);
    setIsSidebarOpen(true);
  };

  const handleSaveIssue = async (issue: Partial<IssueFull>) => {
    try {
      // TODO (NL): Implementovat uložení issue
      console.log("Saving issue:", issue);

      if (selectedIssue) {
        const updatedIssues = issues.map(i =>
          i.code === selectedIssue.code ? { ...i, ...issue } : i
        );
        setIssues(updatedIssues);
      }

      toast({
        title: "Issue uloženo",
        description: "Změny byly úspěšně uloženy.",
        variant: "success"
      });

      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Failed to save issue:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se uložit změny. Zkuste to prosím znovu.",
        variant: "destructive"
      });
    }
  };

  const calendarEvents = issues.map(issueToEvent);
  const days = getDaysInMonth(currentDate, calendarEvents);

  if (error) {
    return (
      <Card className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Chyba</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </Card>
    );
  }

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden">
        <div className="flex-none p-6 border-b border-border">
          <CalendarNavigation
            currentDate={currentDate}
            viewType={viewType}
            onNavigate={handleNavigate}
            onToday={handleToday}
            onViewChange={setViewType}
          />
        </div>

        <div className="flex-auto p-6 overflow-auto">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : viewType === 'month' ? (
            <CalendarMonthView
              days={days}
              issues={issues}
              onSelectDay={handleSelectDay}
              onIssueSelect={handleIssueSelect}
            />
          ) : (
            <CalendarTimeGridView
              viewType={viewType}
              currentDate={currentDate}
              days={days}
              issues={issues}
              onSelectDay={handleSelectDay}
              onIssueSelect={handleIssueSelect}
            />
          )}
        </div>
      </Card>

      <IssueSidebar
        isOpen={isSidebarOpen}
        issue={selectedIssue}
        projectCode={projectCode || ''}
        onClose={() => setIsSidebarOpen(false)}
        onSave={handleSaveIssue}
      />
    </>
  );
}
