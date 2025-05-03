import { Dispatch, SetStateAction } from "react";
import { IssueFull } from '~/types';
import { FileText } from "lucide-react";
import { Textarea } from "~/components/ui/textarea";

// TODO (NL): Přidat maximální délku popisu
interface IssueDescriptionProps {
  description?: string;
  isEditing: boolean;
  setEditedIssue: Dispatch<SetStateAction<IssueFull>>;
}

export function IssueDescription({ description, isEditing, setEditedIssue }: IssueDescriptionProps) {
  return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          Popis
        </h3>
        {isEditing ? (
            <Textarea
                value={description || ''}
                onChange={(e) => setEditedIssue(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[100px] border-none bg-muted/50 focus-visible:ring-2"
                placeholder="Přidej popis..."
            />
        ) : (
            <div className="prose prose-sm max-w-none text-muted-foreground bg-muted/50 p-4 rounded-lg">
              <p className="whitespace-pre-wrap">{description || 'Žádný popis'}</p>
            </div>
        )}
      </div>
  );
}
