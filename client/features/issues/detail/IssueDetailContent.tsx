import { ChangeEvent, Dispatch, DragEvent, SetStateAction, useState } from "react";
import { IssueData, IssueFull } from "~/types";
import { CardContent } from "~/components/ui/card";
import { useToast } from "~/hooks/use-toast";
import { cn } from "~/utils/helpers";
import { FileText, Upload } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { IssueDescription } from "~/features/issues/detail/content/IssueDescription";
import { IssueSettings } from "~/features/issues/detail/content/IssueSettings";
import { IssueMetadata } from "~/features/issues/detail/content/IssueMetadata";
import { IssueTags } from "~/features/issues/detail/content/IssueTags";
import { IssueExternalLink } from "~/features/issues/detail/content/IssueExternalLink";
import { IssueAttachments } from "~/features/issues/detail/content/IssueAttachments";
import { IssueComments } from "~/features/issues/detail/content/IssueComments";

// TODO (NL): Přidat podporu pro více typů souborů a externích odkazů
// TODO (NL): Přidat podporu pro náhledy obrázků a PDF
// TODO (NL): Přidat validaci maximální velikosti souboru
interface IssueDetailContentProps {
  editedIssue: IssueFull;
  setEditedIssue: Dispatch<SetStateAction<IssueFull>>;
  isEditing: boolean;
  attachedFiles: File[];
  setAttachedFiles: Dispatch<SetStateAction<File[]>>;
  setIsAddTagDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export function IssueDetailContent({
  editedIssue,
  setEditedIssue,
  isEditing,
  attachedFiles,
  setAttachedFiles,
  setIsAddTagDialogOpen,
}: IssueDetailContentProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const issueData = editedIssue.data as IssueData;
  const attachments = issueData?.attachments || [];
  const link = issueData?.link;

  const handleTagClick = (tag: string) => {
    setEditedIssue((prev) => {
      const currentTags = prev.tags || [];
      const newTags = currentTags.includes(tag) ? currentTags.filter((t) => t !== tag) : [...currentTags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer?.files || []);
    setAttachedFiles((prev) => [...prev, ...files]);

    toast({
      description: `Přidáno ${files.length} souborů`,
    });
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles((prev) => [...prev, ...files]);

    toast({
      description: `Přidáno ${files.length} souborů`,
    });
  };

  const handleRemoveAttachedFile = (index: number) => {
    setAttachedFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });

    toast({
      description: "Soubor byl odebrán",
    });
  };

  const handleRemoveExistingFile = (index: number) => {
    setEditedIssue((prev) => {
      const prevData = prev.data as IssueData;
      const newAttachments = [...(prevData.attachments || [])];
      newAttachments.splice(index, 1);

      return {
        ...prev,
        data: {
          ...prevData,
          attachments: newAttachments,
        },
      };
    });

    toast({
      description: "Soubor byl odebrán",
    });
  };

  return (
    <CardContent className="space-y-8">
      <IssueDescription
        description={editedIssue.description}
        isEditing={isEditing}
        setEditedIssue={setEditedIssue}
      />

      {isEditing && (
        <IssueSettings
          editedIssue={editedIssue}
          setEditedIssue={setEditedIssue}
        />
      )}

      <IssueMetadata
        editedIssue={editedIssue}
        isEditing={isEditing}
      />

      <IssueTags
        editedIssue={editedIssue}
        isEditing={isEditing}
        handleTagClick={handleTagClick}
        setIsAddTagDialogOpen={setIsAddTagDialogOpen}
      />

      <IssueExternalLink
        link={link}
        isEditing={isEditing}
        setEditedIssue={setEditedIssue}
      />

      {isEditing
        ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Přílohy</span>
            </div>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-4 text-center",
                isDragging ? "border-primary bg-primary/5" : "border-muted",
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Přetáhněte soubory sem nebo klikněte pro výběr
                </p>
                <Input
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  Vybrat soubory
                </Button>
              </div>
            </div>

            <IssueAttachments
              attachments={attachments}
              attachedFiles={attachedFiles}
              isEditing={true}
              onRemoveExisting={handleRemoveExistingFile}
              onRemoveNew={handleRemoveAttachedFile}
            />
          </div>
        )
        : (
          <IssueAttachments
            attachments={attachments}
            attachedFiles={[]}
            isEditing={false}
          />
        )}

      <IssueComments
        commentsCount={editedIssue.comments_count}
      />
    </CardContent>
  );
}
