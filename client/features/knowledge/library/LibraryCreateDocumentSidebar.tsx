import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "@remix-run/react";
import { X, Save, Loader2 } from "lucide-react";
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
import { NewDocument } from "~/types/knowledge";
import { KNOWLEDGE_AVAILABLE_TAGS } from "~/lib/constants";
import { useToast } from "~/hooks/use-toast";

interface CreateDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (document: NewDocument) => Promise<void>;
  initialTag?: string;
  currentUser?: string;
  isLoading?: boolean;
}

export function LibraryCreateDocumentSidebar({
                                               isOpen,
                                               onClose,
                                               onSave,
                                               initialTag,
                                               currentUser = "Uživatel",
                                               isLoading = false
                                             }: CreateDocumentDialogProps) {
  const [formData, setFormData] = useState<NewDocument>({
    title: "",
    summary: "",
    content: "",
    tags: initialTag ? [initialTag] : [],
    author: currentUser
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const [newTag, setNewTag] = useState<string>("");
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isLoadingState, setIsLoading] = useState(isLoading);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        summary: "",
        content: "",
        tags: initialTag ? [initialTag] : [],
        author: currentUser
      });
      setNewTag("");
      setIsGeneratingContent(false);
    }
  }, [isOpen, initialTag, currentUser]);

  const handleInputChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => {
      const tags = prev.tags.includes(tag)
          ? prev.tags.filter((t) => t !== tag)
          : [...prev.tags, tag];
      return { ...prev, tags };
    });
  };

  const handleAddCustomTag = (e: FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleGenerateContent = () => {
    setIsGeneratingContent(true);

    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        content: generateMdxContent()
      }));
      setIsGeneratingContent(false);
    }, 500);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      ...formData,
      content: formData.content || generateMdxContent(),
    };
    try {
      setIsLoading(true);
      const res = await fetch(`/api/knowledge/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error);
      toast({ title: "Dokument vytvořen", variant: "success" });
      navigate(`/knowledge/library/${body.id}`);
      onClose();
    } catch (err) {
      console.error(err);

      const message = err instanceof Error
          ? err.message
          : 'Zkuste to znovu.'

      toast({
        title: "Chyba při vytváření dokumentu",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const generateMdxContent = () => `# ${formData.title}

${formData.summary}

## Obsah dokumentu

Zde začni psát obsah tvého dokumentu...
`;

  return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="sm:max-w-md md:max-w-lg">
          <form onSubmit={handleSubmit} className="flex h-full flex-col">
            <SheetHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <SheetTitle>Nový dokument</SheetTitle>
              </div>
            </SheetHeader>

            <div className="flex-grow overflow-y-auto py-4 px-2 custom-scrollbar">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="title">Název dokumentu</Label>
                  <Input
                      id="title"
                      name="title"
                      placeholder="Zadejte název dokumentu"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="summary">Shrnutí</Label>
                  <Textarea
                      id="summary"
                      name="summary"
                      placeholder="Krátké shrnutí nebo popis dokumentu"
                      rows={2}
                      value={formData.summary}
                      onChange={handleInputChange}
                      disabled={isLoading}
                  />
                </div>

                <div className="grid gap-3">
                  <Label>Tagy</Label>
                  <div className="flex flex-wrap gap-2">
                    {KNOWLEDGE_AVAILABLE_TAGS.map((tag) => (
                        <Badge
                            key={tag}
                            variant={formData.tags.includes(tag) ? "default" : "outline"}
                            className={cn(
                                "cursor-pointer",
                                formData.tags.includes(tag) ? "bg-primary" : "",
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
                  <div className="flex justify-between items-center">
                    <Label htmlFor="content">Obsah</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={handleGenerateContent}
                        disabled={!formData.title || isLoading || isGeneratingContent}
                    >
                      {isGeneratingContent ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Generování...
                          </>
                      ) : (
                          "Vygenerovat obsah"
                      )}
                    </Button>
                  </div>
                  <Textarea
                      id="content"
                      name="content"
                      placeholder="Použijte Markdown pro formátování dokumentu"
                      rows={8}
                      value={formData.content || generateMdxContent()}
                      onChange={handleInputChange}
                      className="font-mono text-sm"
                      disabled={isLoading || isGeneratingContent}
                  />
                  <p className="text-xs text-muted-foreground">
                    Obsah je ve formátu MDX, což je Markdown s podporou React komponent.
                  </p>
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
                    disabled={isLoading || !formData.title.trim()}
                >
                  {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Ukládání...
                      </>
                  ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Vytvořit dokument
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
