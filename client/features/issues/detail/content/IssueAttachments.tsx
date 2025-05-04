import { FileText, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";

interface Attachment {
  name: string;
  size: number;
  type?: string | undefined;
}

interface IssueAttachmentsProps {
  attachments: Attachment[];
  attachedFiles: File[];
  isEditing: boolean;
  onRemoveExisting?: (index: number) => void;
  onRemoveNew?: (index: number) => void;
}

export function IssueAttachments({
  attachments,
  attachedFiles,
  isEditing,
  onRemoveExisting,
  onRemoveNew,
}: IssueAttachmentsProps) {
  if (attachments.length === 0 && attachedFiles.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-2">
      {attachments.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{file.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </span>
            {isEditing && onRemoveExisting && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onRemoveExisting(index)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Odstranit</span>
              </Button>
            )}
          </div>
        </div>
      ))}
      {attachedFiles.map((file, index) => (
        <div
          key={`new-${index}`}
          className="flex items-center justify-between p-3 bg-primary/10 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-medium">{file.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-primary">
              {(file.size / 1024).toFixed(1)} KB
            </span>
            {isEditing && onRemoveNew && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onRemoveNew(index)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Odstranit</span>
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
