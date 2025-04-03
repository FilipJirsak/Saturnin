import { useDrop } from 'react-dnd';
import { PlusIcon } from '@heroicons/react/24/outline';
import { IssueFull } from "~/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/utils/helpers";
import { ArrowUpToLine } from "lucide-react";
import {KanbanCard} from "~/features/views/kanban/KanbanCard";

interface ColumnProps {
  title: string;
  state: string;
  issues: IssueFull[];
  onMoveCard: (cardId: string, targetState: string) => void;
  projectCode: string;
  onCardClick: (issue: IssueFull) => void;
  onAddClick: (state: string) => void;
}

export function KanbanColumn({
                        title,
                        state,
                        issues,
                        onMoveCard,
                        projectCode,
                        onCardClick,
                        onAddClick
                      }: ColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (item: { code: string }) => {
      onMoveCard(item.code, state);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleAddIssue = () => {
    onAddClick(state);
  };

  return (
      <Card
          ref={drop}
          className={cn(
              "flex w-80 flex-shrink-0 flex-col border-none bg-muted/20 transition-colors",
              isOver && "bg-primary/5"
          )}
      >
        <CardHeader className="px-4 pb-2 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Badge
                  variant="secondary"
                  className="rounded-full px-2 py-0 text-xs text-white bg-primary/50 hover:bg-primary/60"
                  title={`${issues.length} issues`}
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
              /*TODO (NL): Tmavší border*/
              <div className="flex min-h-20 items-center justify-center rounded-md border border-dashed p-4 text-center">
                <p className="flex flex-col items-center text-xs text-muted-foreground">
                  <ArrowUpToLine size={16} className="mb-1" />
                  <span>Žádné issues</span>
                </p>
              </div>
          ) : (
              issues.map((issue) => (
                  <KanbanCard
                      key={issue.code}
                      issue={issue}
                      onClick={onCardClick}
                  />
              ))
          )}
        </CardContent>
      </Card>
  );
}
