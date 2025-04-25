import { useState, useEffect } from 'react';
import { IssueFull } from "~/types";
import {ISSUE_STATES} from "~/lib/constants";
import {IssueSidebar} from "~/features/views/common/IssueSidebar";
import {KanbanColumn} from "~/features/views/kanban/KanbanColumn";
import {useToast} from "~/hooks/use-toast";

interface BoardProps {
  projectCode: string;
  issues: IssueFull[];
}

export function KanbanBoard({ projectCode, issues: initialIssues }: BoardProps){
  const [issues, setIssues] = useState<IssueFull[]>(initialIssues);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Partial<IssueFull> | null>(null);
  const [isNewIssue, setIsNewIssue] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIssues(initialIssues);
  }, [initialIssues]);

  const handleMoveCard = async (code: string, newState: string) => {
    const issueToUpdate = issues.find(issue => issue.code === code);
    if (!issueToUpdate) return;

    const updatedIssue = { ...issueToUpdate, state: newState };
    setIssues(prevIssues =>
        prevIssues.map(issue =>
            issue.code === code ? updatedIssue : issue
        )
    );

    // TODO (NL): Implementovat skutečné uložení na server
    toast({
      title: "Issue aktualizováno",
      description: `Issue ${code} přesunuto do stavu ${newState}`,
      variant: "success"
    });
  };

  const handleCardClick = (issue: IssueFull) => {
    setSelectedIssue(issue);
    setIsNewIssue(false);
    setIsDetailsOpen(true);
  };

  const handleAddClick = (state: string) => {
    setSelectedIssue({ state });
    setIsNewIssue(true);
    setIsDetailsOpen(true);
  };

  const handleSidebarClose = () => {
    setIsDetailsOpen(false);
    setSelectedIssue(null);
  };

  const handleSaveIssue = async (updatedIssue: Partial<IssueFull>) => {
    if (isNewIssue) {
      // TODO (NL): Implementovat skutečné vytvoření na serveru
      const newIssue: IssueFull = {
        code: `${projectCode}-${issues.length + 1}`,
        state: updatedIssue.state || 'new',
        title: updatedIssue.title || '',
        summary: updatedIssue.summary || '',
        description: updatedIssue.description,
        assignee: updatedIssue.assignee,
        tags: updatedIssue.tags,
        due_date: updatedIssue.due_date,
        comments_count: 0,
        attachments_count: updatedIssue.attachments_count || 0,
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
        data: updatedIssue.data
      };

      setIssues(prevIssues => [...prevIssues, newIssue]);

      toast({
        title: "Issue vytvořeno",
        description: `Issue ${newIssue.code} bylo úspěšně vytvořeno`,
        variant: "success"
      });
    } else {
      // TODO (NL): Implementovat skutečné uložení na server
      setIssues(prevIssues =>
          prevIssues.map(issue =>
              issue.code === selectedIssue?.code
                  ? { ...issue, ...updatedIssue, last_modified: new Date().toISOString() }
                  : issue
          )
      );

      toast({
        title: "Issue aktualizováno",
        description: `Issue ${selectedIssue?.code} bylo úspěšně aktualizováno`,
        variant: "success"
      });
    }

    handleSidebarClose();
  };

  return (
      <>
        <div className="flex space-x-4 overflow-x-auto p-4">
          {ISSUE_STATES.map((state) => (
              <KanbanColumn
                  key={state.value}
                  title={state.label}
                  state={state.value}
                  issues={issues.filter((issue) => issue.state === state.value)}
                  onMoveCard={handleMoveCard}
                  projectCode={projectCode}
                  onCardClick={handleCardClick}
                  onAddClick={handleAddClick}
              />
          ))}
        </div>

        <IssueSidebar
            isOpen={isDetailsOpen}
            issue={selectedIssue}
            projectCode={projectCode}
            onClose={handleSidebarClose}
            onSave={handleSaveIssue}
            isNew={isNewIssue}
        />
      </>
  );
}
