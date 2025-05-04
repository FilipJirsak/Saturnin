import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  itemType?: string;
  description?: string;
  onConfirm: () => Promise<void> | void;
  confirmText?: string;
  cancelText?: string;
}

export function MindMapDeleteConfirmationDialog({
  open,
  onOpenChange,
  title,
  itemType = "myšlenkovou mapu",
  description,
  onConfirm,
  confirmText = "Smazat",
  cancelText = "Zrušit",
}: DeleteConfirmationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  const defaultDescription =
    `Opravdu chceš smazat ${itemType} "${title}"? Tato akce je nevratná a smaže i všechny související položky.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Smazat {itemType}?</DialogTitle>
          <DialogDescription>
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? <span className="animate-pulse">Mazání...</span> : (
              <>
                <Trash2 className="h-4 w-4 mr-1" />
                {confirmText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
