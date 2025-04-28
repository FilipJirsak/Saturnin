import { Dispatch, SetStateAction } from "react";
import { Tag, Plus } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/utils/helpers";
import { IssueFull } from '~/types';
import { ISSUE_AVAILABLE_TAGS } from "~/lib/constants";

// TODO (NL): Přidat barevné rozlišení tagů
// TODO (NL): Přidat filtrování podle tagů
// TODO (NL): Přidat popisky k tagům
interface IssueTagsProps {
  editedIssue: IssueFull;
  isEditing: boolean;
  handleTagClick: (tag: string) => void;
  setIsAddTagDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export function IssueTags({
                            editedIssue,
                            isEditing,
                            handleTagClick,
                            setIsAddTagDialogOpen
                          }: IssueTagsProps) {
  if (!isEditing && (!editedIssue.tags || editedIssue.tags.length === 0)) {
    return null;
  }

  return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Tag className="h-4 w-4" />
          <span>Tagy</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {isEditing ? (
              <>
                {[...new Set([...ISSUE_AVAILABLE_TAGS, ...(editedIssue.tags || [])])].map(tag => (
                    <Badge
                        key={tag}
                        variant={editedIssue.tags?.includes(tag) ? "default" : "secondary"}
                        className={cn(
                            "rounded-md px-2 py-1 text-sm cursor-pointer transition-colors duration-200",
                            editedIssue.tags?.includes(tag) ? "bg-primary hover:bg-primary/90" : "hover:bg-muted"
                        )}
                        onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </Badge>
                ))}
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 gap-1"
                    onClick={() => setIsAddTagDialogOpen(true)}
                >
                  <Plus className="h-3 w-3" />
                  Přidat tag
                </Button>
              </>
          ) : (
              editedIssue.tags?.map(tag => (
                  <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-md px-2 py-1 text-sm"
                  >
                    {tag}
                  </Badge>
              ))
          )}
        </div>
      </div>
  );
}
