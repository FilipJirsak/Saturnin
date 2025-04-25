import { MessageSquare } from "lucide-react";
import { Button } from "~/components/ui/button";

interface IssueCommentsProps {
  commentsCount?: number;
}

export function IssueComments({ commentsCount }: IssueCommentsProps) {
  if (!commentsCount || commentsCount <= 0) {
    return null;
  }

  return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span>Komentáře ({commentsCount})</span>
        </div>
        <Button
            variant="outline"
            className="w-full hover:bg-muted/50 transition-colors duration-200"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Zobrazit komentáře
        </Button>
      </div>
  );
}
