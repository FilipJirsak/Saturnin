import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { X, Network, Plus, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/utils/helpers";
import { Concept } from "~/types/knowledge";
import {KNOWLEDGE_AVAILABLE_TAGS} from "~/lib/constants";

interface ConceptCreationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (concept: Partial<Concept>) => Promise<void>;
  currentUser?: string;
  isLoading?: boolean;
}

//TODO (NL): Zařídit, aby fungovalo přidávání konceptů
export function ConceptCreationSidebar({
                                         isOpen,
                                         onClose,
                                         onSave,
                                         currentUser = "Uživatel",
                                         isLoading = false
                                       }: ConceptCreationSidebarProps) {
  const [formData, setFormData] = useState<Partial<Concept>>({
    title: "",
    description: "",
    tags: [],
    related: [],
    author: currentUser
  });
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        description: "",
        tags: [],
        related: [],
        author: currentUser
      });
      setNewTag("");
    }
  }, [isOpen, currentUser]);

  const handleInputChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => {
      const tags = prev.tags || [];
      const newTags = tags.includes(tag)
          ? tags.filter(t => t !== tag)
          : [...tags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const handleAddCustomTag = (e: FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !(formData.tags || []).includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    try {
      await onSave(formData);
    } catch (error) {
      console.error("Chyba při vytváření konceptu:", error);
    }
  };

  return (
      <Sheet open={isOpen} onOpenChange={v => !v && onClose()}>
        <SheetContent className="sm:max-w-md md:max-w-lg">
          <form onSubmit={handleSubmit} className="flex h-full flex-col">
            <SheetHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <SheetTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-primary" />
                  Nový koncept
                </SheetTitle>
              </div>
            </SheetHeader>

            <div className="flex-grow overflow-y-auto py-4 px-2 custom-scrollbar">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="title">Název konceptu</Label>
                  <Input
                      id="title"
                      name="title"
                      placeholder="Zadejte název konceptu"
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
                      placeholder="Popis konceptu"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={isLoading}
                  />
                </div>

                <div className="grid gap-3">
                  <Label>Tagy</Label>
                  <div className="flex flex-wrap gap-2">
                    {KNOWLEDGE_AVAILABLE_TAGS.map(tag => (
                        <Badge
                            key={tag}
                            variant={(formData.tags || []).includes(tag) ? "default" : "outline"}
                            className={cn(
                                "cursor-pointer",
                                (formData.tags || []).includes(tag) ? "bg-primary" : "",
                                isLoading && "opacity-70 cursor-not-allowed"
                            )}
                            onClick={() => !isLoading && handleTagToggle(tag)}
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
                        disabled={isLoading}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddCustomTag}
                        disabled={!newTag.trim() || isLoading}
                    >
                      Přidat
                    </Button>
                  </div>

                  {(formData.tags || []).length > 0 && (
                      <div className="mt-2">
                        <Label className="mb-2 inline-block">Vybrané tagy:</Label>
                        <div className="flex flex-wrap gap-2">
                          {(formData.tags || []).map((tag) => (
                              <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="flex items-center gap-1"
                              >
                                {tag}
                                <X
                                    className={cn(
                                        "h-3 w-3 cursor-pointer",
                                        isLoading && "cursor-not-allowed"
                                    )}
                                    onClick={() => !isLoading && handleTagToggle(tag)}
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
                      disabled={isLoading}
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
                    disabled={isLoading}
                >
                  Zrušit
                </Button>
                <Button
                    type="submit"
                    className="flex-1"
                    disabled={isLoading || !formData.title?.trim()}
                >
                  {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Ukládání...
                      </>
                  ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Vytvořit koncept
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
