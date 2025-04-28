import { Dispatch, SetStateAction } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

// TODO (NL): Přidat validaci tagů
// TODO (NL): Přidat podporu pro více tagů najednou
interface IssueAddTagDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  newTagValue: string;
  setNewTagValue: Dispatch<SetStateAction<string>>;
  onAddTag: () => void;
}

export function IssueAddTagDialog({
                                    isOpen,
                                    setIsOpen,
                                    newTagValue,
                                    setNewTagValue,
                                    onAddTag
                                  }: IssueAddTagDialogProps) {
  return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Přidat nový tag</DialogTitle>
            <DialogDescription>
              Zadej název nového tagu
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
                placeholder="Název tagu"
                value={newTagValue}
                onChange={(e) => setNewTagValue(e.target.value)}
                autoFocus
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Zrušit
            </Button>
            <Button onClick={onAddTag} className="flex-1" disabled={!newTagValue.trim()}>
              Přidat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}
