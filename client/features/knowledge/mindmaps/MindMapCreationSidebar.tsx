import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Form, useNavigation } from "@remix-run/react";
import { Brain, X } from "lucide-react";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { KNOWLEDGE_AVAILABLE_TAGS } from "~/lib/constants";
import { NewMindMap } from "~/types/knowledge";

interface CreateMindMapSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewMindMap) => Promise<void>;
  initialTag?: string;
  currentUser?: string;
  isLoading?: boolean;
}

export function MindMapCreationSidebar({
  isOpen,
  onClose,
  onSave,
  initialTag,
  currentUser = "Uživatel",
  isLoading = false,
}: CreateMindMapSidebarProps) {
  const [formData, setFormData] = useState<NewMindMap>({
    title: "",
    description: "",
    tags: initialTag ? [initialTag] : [],
    author: currentUser,
  });
  const [newTag, setNewTag] = useState("");
  const navigation = useNavigation();
  const isSubmitting = isLoading || navigation.state !== "idle";

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        description: "",
        tags: initialTag ? [initialTag] : [],
        author: currentUser,
      });
      setNewTag("");
    }
  }, [isOpen, initialTag, currentUser]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => {
      const tags = prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag];
      return { ...prev, tags };
    });
  };

  const handleAddCustomTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    try {
      await onSave(formData);

      setTimeout(() => {
        onClose();
      }, 200);
    } catch (error) {
      console.error("Chyba při vytváření myšlenkové mapy:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="sm:max-w-md md:max-w-lg">
        <Form
          method="post"
          replace
          className="flex h-full flex-col"
          onSubmit={handleSubmit}
        >
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Nová myšlenková mapa
              </SheetTitle>
            </div>
          </SheetHeader>

          <input type="hidden" name="author" value={formData.author} />
          {formData.tags.map((tag) => <input key={tag} type="hidden" name="tags" value={tag} />)}

          <div className="flex-grow overflow-y-auto py-4 px-2 custom-scrollbar">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="title">Název myšlenkové mapy</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Zadej název myšlenkové mapy"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="description">Popis</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Krátký popis myšlenkové mapy"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-3">
                <Label>Tagy</Label>
                <div className="flex flex-wrap gap-2">
                  {KNOWLEDGE_AVAILABLE_TAGS.map((tag) => (
                    <Badge
                      key={tag}
                      variant={formData.tags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer ${formData.tags.includes(tag) ? "bg-primary" : ""} ${
                        isSubmitting && "opacity-70 cursor-not-allowed"
                      }`}
                      onClick={() => !isSubmitting && handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Vlastní tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCustomTag}
                    disabled={!newTag.trim() || isSubmitting}
                  >
                    Přidat
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="mt-2">
                    <Label className="mb-2 inline-block">Vybrané tagy:</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <X
                            className={`h-3 w-3 cursor-pointer ${isSubmitting && "cursor-not-allowed"}`}
                            onClick={() => !isSubmitting && handleTagToggle(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  name="author"
                  placeholder="Jméno autora"
                  value={formData.author}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <SheetFooter className="flex-shrink-0 border-t pt-4">
            <div className="flex gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Zrušit
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting || !formData.title.trim()}
              >
                {isSubmitting ? "Vytvářím…" : "Vytvořit mapu"}
              </Button>
            </div>
          </SheetFooter>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
