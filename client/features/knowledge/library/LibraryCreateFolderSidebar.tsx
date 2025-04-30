import { ChangeEvent, FormEvent, useState } from "react";
import { FolderPlus, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { NewFolder } from "~/types/knowledge";

interface CreateFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (folder: NewFolder) => Promise<void>;
  isLoading?: boolean;
}

export function LibraryCreateFolderSidebar({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: CreateFolderDialogProps) {
  const [formData, setFormData] = useState<NewFolder>({
    title: "",
    description: "",
    tag: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "title" && formData.tag === formData.title.toLowerCase().replace(/\s+/g, "-")) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        tag: value.toLowerCase().replace(/\s+/g, "-"),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const processedData = {
        ...formData,
        tag: formData.tag.toLowerCase().replace(/\s+/g, "-"),
      };

      await onSave(processedData);
    } catch (error) {
      console.error("Nepodařilo se vytvořit složku:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      tag: "",
    });
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          resetForm();
        }
      }}
    >
      <SheetContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <SheetHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <SheetTitle>Nová složka</SheetTitle>
            </div>
          </SheetHeader>

          <div className="flex-grow overflow-y-auto py-6 px-2">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="title">Název složky</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Zadej název složky"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="description">Popis</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Krátký popis obsahu složky"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="tag">
                  Identifikátor tagu
                  <span className="text-xs text-muted-foreground ml-2">
                    (slouží pro zařazení dokumentů do této složky)
                  </span>
                </Label>
                <Input
                  id="tag"
                  name="tag"
                  placeholder="Např. architektura, backend, apod."
                  value={formData.tag}
                  onChange={handleInputChange}
                  className="lowercase"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Do této složky budou automaticky přidány všechny dokumenty s tímto tagem.
                </p>
              </div>
            </div>
          </div>

          <SheetFooter className="flex-shrink-0 border-t pt-4">
            <div className="flex gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                disabled={isLoading}
              >
                Zrušit
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading || !formData.title.trim() || !formData.tag.trim()}
              >
                {isLoading
                  ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Ukládání...
                    </>
                  )
                  : (
                    <>
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Vytvořit složku
                    </>
                  )}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
