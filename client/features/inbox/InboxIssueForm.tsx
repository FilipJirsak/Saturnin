import {FormEvent, useState, useCallback, ChangeEvent, DragEvent} from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Plus, Loader2, Inbox, Link, Upload } from "lucide-react";
import { useToast } from "~/hooks/use-toast";
import { IssueFull } from "~/types";
import { cn } from "~/utils/helpers";

// TODO (NL): Přidat validaci formuláře

interface IssueFormProps {
  onIssueCreated: (issue: IssueFull) => void;
}

export function InboxIssueForm({ onIssueCreated }: IssueFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [link, setLink] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const fileInputId = `file-upload-${Math.random().toString(36).substring(2, 11)}`;
  const isValid = title.trim() !== "" || description.trim() !== "";

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    setAttachedFiles(prev => [...prev, ...files]);

    toast({
      title: "Soubory přidány",
      description: `Přidáno ${files.length} souborů`,
    });
  }, [toast]);

  const handleFileInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);

    toast({
      title: "Soubory přidány",
      description: `Přidáno ${files.length} souborů`,
    });
  }, [toast]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      toast({
        title: "Chyba při vytváření issue",
        description: "Vyplňte alespoň název nebo popis issue",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO (NL): Nahradit reálným API voláním
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newIssue: IssueFull = {
        code: `INBOX-${Date.now()}`,
        title: title.trim() || "Bez názvu",
        description: description.trim() || undefined,
        state: "new",
        last_modified: new Date().toISOString(),
        attachments_count: attachedFiles.length,
        data: {
          link: link.trim() || undefined,
          attachments: attachedFiles.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type
          }))
        }
      };

      onIssueCreated(newIssue);

      setTitle("");
      setDescription("");
      setLink("");
      setAttachedFiles([]);

      toast({
        title: "Issue bylo vytvořeno",
        description: "Issue bylo úspěšně přidáno do inboxu",
      });

    } catch (error) {
      console.error(error);
      toast({
        title: "Chyba při vytváření issue",
        description: "Nepodařilo se vytvořit nové issue",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-5 w-5 text-primary" />
            Přidat do Inboxu
          </CardTitle>
          <CardDescription>
            Rychlý záznam issue bez přiřazení k projektu
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                  placeholder="Název issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                  placeholder="Popis issue (volitelné)"
                  className="min-h-32"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Odkaz (volitelné)"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
              </div>
            </div>
            <div
                className={cn(
                    "border-2 border-dashed rounded-lg p-4 text-center",
                    isDragging ? "border-primary bg-primary/5" : "border-muted"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Přetáhni soubory sem nebo klikni pro výběr
                </p>
                <input
                    type="file"
                    multiple
                    className="hidden"
                    id={fileInputId}
                    onChange={handleFileInput}
                />
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById(fileInputId)?.click()}
                >
                  Vybrat soubory
                </Button>
              </div>
              {attachedFiles.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Připojené soubory:</p>
                    <ul className="space-y-1">
                      {attachedFiles.map((file, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="truncate flex-1">{file.name}</span>
                            <span className="text-xs whitespace-nowrap">({(file.size / 1024).toFixed(1)} KB)</span>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
                type="submit"
                className="w-full"
                disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Vytvářím...
                  </>
              ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Přidat issue
                  </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
  );
}
