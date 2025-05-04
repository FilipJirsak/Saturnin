import { Calendar, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { formatDate, formatRelativeTime } from "~/utils/dateUtils";
import { getInitials } from "~/utils/helpers";
import { IssueFull } from "~/types";

// TODO (NL): Přidat profilovou fotku přiřazené osoby
interface IssueMetadataProps {
  editedIssue: IssueFull;
  isEditing: boolean;
}

export function IssueMetadata({ editedIssue, isEditing }: IssueMetadataProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Vytvořeno</span>
        </div>
        <div>
          <p className="font-medium">
            {formatDate(editedIssue.created_at || editedIssue.last_modified)}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatRelativeTime(editedIssue.created_at || editedIssue.last_modified)}
          </p>
        </div>
      </div>

      {!isEditing && editedIssue.due_date && (
        <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Termín dokončení</span>
          </div>
          <div>
            <p className="font-medium">
              {formatDate(editedIssue.due_date)}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatRelativeTime(editedIssue.due_date)}
            </p>
          </div>
        </div>
      )}

      {!isEditing && editedIssue.assignee && (
        <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Přiřazená osoba</span>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {getInitials(editedIssue.assignee)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{editedIssue.assignee}</span>
          </div>
        </div>
      )}
    </div>
  );
}
