import { useDrop } from 'react-dnd';
import { PlusIcon } from '@heroicons/react/24/outline';
import {IssueFull} from "~/types";
import KanbanCard from "./KanbanCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import {ArrowUpToLine} from "lucide-react";

interface ColumnProps {
  title: string;
  state: string;
  issues: IssueFull[];
  onMoveCard: (cardId: string, targetState: string) => void;
  projectCode: string;
}

const KanbanColumn = ({ title, state, issues, onMoveCard, projectCode }: ColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (item: { code: string }) => {
      onMoveCard(item.code, state);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleAddIssue = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/project/${projectCode}/issue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `New Issue`,
          state: state
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create issue');
      }

      window.location.reload();
    } catch (error) {
      console.error('Failed to create issue:', error);
    }
  };

  return (
      <Card
          ref={drop}
          className={cn(
              "flex w-80 flex-col border-none bg-surface-50 transition-colors dark:border-surface-700 dark:bg-surface-800/90",
              isOver && "bg-primary/5 dark:bg-primary/10"
              // isOver ? 'bg-surface-200/50 dark:bg-surface-700/50' : ''
          )}
      >
        <CardHeader className="px-4 pb-2 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Badge variant="secondary" className="rounded-full px-2 py-0 text-xs text-white bg-primary/50"
              >
                {issues.length}
              </Badge>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleAddIssue}
            >
              <PlusIcon className="h-4 w-4" strokeWidth={2} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col space-y-3 overflow-auto p-4 pt-0">
          {issues.length === 0 ? (
              <div className="flex min-h-20 items-center justify-center rounded-md border border-dashed border-surface-300 p-4 text-center dark:border-surface-700">
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  <ArrowUpToLine size="16"/>
                </p>
              </div>
          ) : (
              issues.map((issue) => (
                  <KanbanCard
                      key={issue.code}
                      title={issue.title || ""}
                      summary={issue.summary}
                      code={issue.code}
                      state={issue.state}
                  />
              ))
          )}
        </CardContent>
      </Card>
  );
};

export default KanbanColumn
