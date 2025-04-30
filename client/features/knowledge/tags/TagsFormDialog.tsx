import { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { KnowledgeTag } from "~/types/knowledge";
import { COLOR_PRESETS } from "~/lib/data";
import {cn, darkenColor} from "~/utils/helpers";

interface ColorPickerProps {
  newTag: Partial<KnowledgeTag>;
  onNewTag: Dispatch<SetStateAction<Partial<KnowledgeTag>>>;
}

export function ColorPicker({ newTag, onNewTag }: ColorPickerProps) {
  return (
      <div className="flex flex-wrap gap-2 mb-4">
        {COLOR_PRESETS.map(color => (
            <div
                key={color}
                className={cn(
                    "w-6 h-6 rounded-full cursor-pointer border-2",
                    newTag.color === color ? "" : "border-transparent"
                )}
                style={{
                  backgroundColor: color,
                  borderColor: newTag.color === color ? darkenColor(color, 40) : undefined
                }}
                onClick={() => onNewTag({ ...newTag, color })}
            />
        ))}
      </div>
  );
}

interface TagsFormDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  newTag: Partial<KnowledgeTag>;
  setNewTag: Dispatch<SetStateAction<Partial<KnowledgeTag>>>;
  editMode: boolean;
  handleSaveTag: () => void;
  resetForm: () => void;
}

export function TagsFormDialog({
                                 open,
                                 setOpen,
                                 newTag,
                                 setNewTag,
                                 editMode,
                                 handleSaveTag,
                                 resetForm,
                               }: TagsFormDialogProps) {
  const borderColor = newTag.color ? darkenColor(newTag.color) : undefined;

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editMode ? "Upravit tag" : "Vytvořit nový tag"}
            </DialogTitle>
            <DialogDescription>
              {editMode ? "Uprav vlastnosti existujícího tagu" : "Vytvoř nový tag pro organizaci vašeho obsahu"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="tag-name" className="text-sm font-medium">
                Název tagu
              </label>
              <div className="flex items-center">
                <div
                    className="h-5 w-5 rounded-full mr-2 flex-shrink-0 border"
                    style={{
                      backgroundColor: newTag.color,
                      borderColor: borderColor
                    }}
                />
                <Input
                    id="tag-name"
                    value={newTag.name}
                    onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                    placeholder="Zadej název tagu"
                    className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="tag-description" className="text-sm font-medium">
                Popis (volitelné)
              </label>
              <Input
                  id="tag-description"
                  value={newTag.description || ""}
                  onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
                  placeholder="Zadej popis tagu"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Barva</label>
              <ColorPicker newTag={newTag} onNewTag={setNewTag} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Zrušit
            </Button>
            <Button onClick={handleSaveTag} disabled={!newTag.name}>
              {editMode ? "Uložit změny" : "Vytvořit tag"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}
