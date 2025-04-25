import { useState, useEffect } from 'react';
import { IssueFull } from "~/types";
import {ISSUE_STATES} from "~/lib/constants";
import {KanbanIssueSidebar} from "~/features/views/kanban/KanbanIssueSidebar";
import {KanbanColumn} from "~/features/views/kanban/KanbanColumn";
import {useToast} from "~/hooks/use-toast";

interface BoardProps {
  projectCode: string;
  issues: IssueFull[];
}

export function KanbanBoard({ projectCode, issues: initialIssues }: BoardProps){
  const [issues, setIssues] = useState<IssueFull[]>(initialIssues);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<IssueFull | null>(null);
  const [isNewIssue, setIsNewIssue] = useState(false);
  const [newIssueState, setNewIssueState] = useState<string>('new');
  const { toast } = useToast();

  useEffect(() => {
    setIssues(initialIssues);
  }, [initialIssues]);

  const handleMoveCard = async (cardCode: string, targetState: string) => {
    // TODO (NL): Zatím pouze lokální změna stavu
    setIssues((prevIssues) =>
        prevIssues.map((issue) =>
            issue.code === cardCode ? { ...issue, state: targetState } : issue
        )
    );

    // TODO (NL): Později implementovat uložení na serveru
    console.log(`Moving card ${cardCode} to ${targetState} - bude implementováno později`);
  };

  const handleCardClick = (issue: IssueFull) => {
    console.log("Selected issue:", issue);
    setSelectedIssue(issue);
    setIsNewIssue(false);
    setIsDetailsOpen(true);
  };

  const handleAddClick = (state: string) => {
    setNewIssueState(state);
    const timestamp = new Date().toISOString();
    const newIssueNumber = issues.length + 1;

    setSelectedIssue({
      state,
      code: `${projectCode}-${newIssueNumber}`,
      title: '',
      summary: '',
      last_modified: timestamp,
      created_at: timestamp,
    } as IssueFull);
    setIsNewIssue(true);
    setIsDetailsOpen(true);
  };

  const handleSidebarClose = () => {
    setIsDetailsOpen(false);
    setSelectedIssue(null);
  };

  const handleSaveIssue = async (issue: Partial<IssueFull>) => {
    try {
      if (isNewIssue) {
        const timestamp = new Date().toISOString();
        const newIssue: IssueFull = {
          ...issue,
          code: selectedIssue?.code || `${projectCode}-${issues.length + 1}`,
          state: newIssueState || 'new',
          last_modified: timestamp,
          created_at: timestamp,
          title: issue.title || `Nový úkol ${issues.length + 1}`,
          summary: issue.summary || '',
          description: issue.description || '',
          tags: issue.tags || [],
          assignee: issue.assignee || ''
        } as IssueFull;

        setIssues((prev) => [...prev, newIssue]);
        toast({
          title: "Úkol vytvořen",
          description: `Úkol ${newIssue.code} byl úspěšně vytvořen.`,
          variant: "success"
        });
      } else if (selectedIssue?.code) {
        const updatedIssue: IssueFull = {
          ...selectedIssue,
          ...issue,
          last_modified: new Date().toISOString(),
          title: issue.title || selectedIssue.title,
          state: issue.state || selectedIssue.state,
          tags: issue.tags || selectedIssue.tags || [],
          assignee: issue.assignee !== undefined ? issue.assignee : selectedIssue.assignee
        } as IssueFull;

        setIssues((prev) =>
            prev.map((i) => (i.code === updatedIssue.code ? updatedIssue : i))
        );
        console.log("Updated issue (locally):", updatedIssue);
      }

      setIsDetailsOpen(false);
      setSelectedIssue(null);
    } catch (error) {
      console.error('Failed to save issue:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se uložit úkol.",
        variant: "destructive",
      });
    }
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

        <KanbanIssueSidebar
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
