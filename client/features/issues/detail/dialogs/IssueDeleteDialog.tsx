import { Dispatch, SetStateAction } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";

// TODO (NL): Přidat možnost obnovení smazaného issue
interface IssueDeleteDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onDelete: () => Promise<void>;
}

export function IssueDeleteDialog({ isOpen, setIsOpen, onDelete }: IssueDeleteDialogProps) {
  return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Smazat issue</DialogTitle>
            <DialogDescription>
              Opravdu chcete smazat toto issue? Tato akce je nevratná.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Zrušit
            </Button>
            <Button variant="destructive" onClick={onDelete} className="flex-1">
              Smazat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}
