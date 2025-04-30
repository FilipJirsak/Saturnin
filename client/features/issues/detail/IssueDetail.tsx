import { useState, useEffect } from "react";
import { IssueFull } from '~/types';
import { useToast } from "~/hooks/use-toast";
import {IssueDetailHeader} from "~/features/issues/detail/IssueDetailHeader";
import {IssueDetailContent} from "~/features/issues/detail/IssueDetailContent";
import {IssueDeleteDialog} from "~/features/issues/detail/dialogs/IssueDeleteDialog";
import {IssueAddTagDialog} from "~/features/issues/detail/dialogs/IssueAddTagDialog";
import {Card} from "~/components/ui/card";

// TODO (NL): Přidat podporu pro více typů příloh
// TODO (NL): Přidat podporu pro přidání více tagů najednou
interface IssueDetailProps {
  issue: IssueFull;
  className?: string;
  onSave: (issue: IssueFull) => void;
  onDelete: (issue: IssueFull) => void;
}

export function IssueDetail({ issue, className, onSave, onDelete }: IssueDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedIssue, setEditedIssue] = useState<IssueFull>(issue);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddTagDialogOpen, setIsAddTagDialogOpen] = useState(false);
  const [newTagValue, setNewTagValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!isEditing) {
      setEditedIssue(issue);
    }
  }, [issue, isEditing]);

  // TODO (NL): Implementovat validaci formuláře a lepší zpracování chyb
  const handleSave = async (data: IssueFull) => {
    try {
      const issueData = data.data || {};
      const attachments = issueData.attachments || [];
      const link = issueData.link;

      const updatedIssue = {
        ...data,
        tags: data.tags || [],
        data: {
          ...data.data,
          link: link,
          attachments: [
            ...(attachments || []),
            ...attachedFiles.map(file => ({
              name: file.name,
              size: file.size,
              type: file.type
            }))
          ]
        }
      };

      await onSave(updatedIssue);
      setIsEditing(false);
      setAttachedFiles([]);

      toast({
        title: "Změny uloženy",
        description: "Všechny změny byly úspěšně uloženy",
        variant: "success"
      });
    } catch (error) {
      console.error("Failed to save issue:", error);
      toast({
        variant: "destructive",
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit změny",
      });
    }
  };

  //TODO (NL): Implementovat mazání issues
  const handleDelete = async () => {
    try {
      await onDelete(issue);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Simulace mazání issue",
        description: "Mazání issues bude implementováno později",
      });
    } catch (error) {
      console.error("Failed to delete issue:", error);
      toast({
        variant: "destructive",
        title: "Chyba při mazání",
        description: "Nepodařilo se smazat issue",
      });
    }
  };

  const handleAddTag = () => {
    if (newTagValue.trim()) {
      const newTag = newTagValue.trim();
      const updatedIssue = {
        ...editedIssue,
        tags: [...(editedIssue.tags || []), newTag]
      };
      setEditedIssue(updatedIssue);
      onSave(updatedIssue);
      setNewTagValue("");
      setIsAddTagDialogOpen(false);
      toast({
        variant: "success",
        title: "Tag přidán",
        description: `Tag "${newTag}" byl přidán`,
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedIssue(issue);
    setAttachedFiles([]);
  };

  return (
      <div className={className}>
        <Card className="border-none shadow-lg transition-all duration-200 hover:shadow-xl">
          <IssueDetailHeader
              issue={editedIssue}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setEditedIssue={setEditedIssue}
              handleSave={handleSave}
              handleCancelEdit={handleCancelEdit}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          />

          <IssueDetailContent
              editedIssue={editedIssue}
              setEditedIssue={setEditedIssue}
              isEditing={isEditing}
              attachedFiles={attachedFiles}
              setAttachedFiles={setAttachedFiles}
              setIsAddTagDialogOpen={setIsAddTagDialogOpen}
          />
        </Card>

        <IssueDeleteDialog
            isOpen={isDeleteDialogOpen}
            setIsOpen={setIsDeleteDialogOpen}
            onDelete={handleDelete}
        />

        <IssueAddTagDialog
            isOpen={isAddTagDialogOpen}
            setIsOpen={setIsAddTagDialogOpen}
            newTagValue={newTagValue}
            setNewTagValue={setNewTagValue}
            onAddTag={handleAddTag}
        />

      </div>
  );
}
