import { useDrag } from "react-dnd";
import { Calendar, MessageSquare, Paperclip } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/utils/helpers";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { IssueFull } from "~/types";
import { format } from "date-fns";
import { MouseEvent, useRef } from "react";

interface CardProps {
  issue: IssueFull;
  onClick: (issue: IssueFull) => void;
}

export function KanbanCard({ issue, onClick }: CardProps) {
  const { title, summary, code, state, tags, due_date } = issue;
  const dragStartTimeRef = useRef<number>(0);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: { code, state },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleCardClick = (e: MouseEvent) => {
    const dragEndTime = Date.now();
    if (dragEndTime - dragStartTimeRef.current < 200) {
      onClick(issue);
    }
  };

  const handleDragStart = () => {
    dragStartTimeRef.current = Date.now();
  };

  return (
    <div
      ref={drag}
      className={cn(isDragging ? "opacity-50" : "opacity-100")}
      onMouseDown={handleDragStart}
    >
      <Card
        className={cn(
          "relative transition-all duration-200 hover:shadow-md cursor-pointer",
        )}
        onClick={handleCardClick}
      >
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {code}
            </span>
          </div>
          <CardTitle className="text-sm font-medium">{title || "[Bez názvu]"}</CardTitle>
        </CardHeader>

        {summary && (
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-foreground/80 line-clamp-2">
              {summary}
            </p>
          </CardContent>
        )}

        <CardFooter className="p-3 border-t flex flex-wrap justify-between">
          <div className="flex items-center space-x-3">
            {/*TODO (NL): Budeme mít i komentáře?*/}
            <div className="flex items-center text-muted-foreground">
              <MessageSquare className="mr-1.5 h-4 w-4" />
              <span className="text-xs">
                {issue.comments_count || 0}
              </span>
            </div>

            <div className="flex items-center text-muted-foreground">
              <Paperclip className="mr-1.5 h-4 w-4" />
              <span className="text-xs">
                {issue.attachments_count || 0}
              </span>
            </div>

            {due_date && (
              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-1.5 h-4 w-4" />
                <span className="text-xs">
                  {format(new Date(due_date), "dd.MM")}
                </span>
              </div>
            )}
          </div>

          {issue.assignee
            ? (
              <Avatar className="h-6 w-6 bg-primary/10 text-primary transition-colors">
                <AvatarFallback className="text-xs">
                  {issue.assignee.split(" ").map((part) => part[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )
            : (
              /*TODO (NL): Co použít, pokud není přiřazená osoba*/
              <Avatar className="h-6 w-6 bg-muted text-muted-foreground transition-colors">
                <AvatarFallback className="text-xs">–</AvatarFallback>
              </Avatar>
            )}
        </CardFooter>

        {tags && tags.length > 0 && (
          <div className="px-3 pb-3 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs py-0 h-5">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs py-0 h-5">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
