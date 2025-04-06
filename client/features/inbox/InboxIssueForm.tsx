import { FormEvent, useState } from "react";
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
import { Plus, Loader2, Inbox } from "lucide-react";
import { useToast } from "~/hooks/use-toast";
import { IssueFull } from "~/types";

interface IssueFormProps {
  onIssueCreated: (issue: IssueFull) => void;
}

export function InboxIssueForm({ onIssueCreated }: IssueFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const isValid = title.trim() !== "" || description.trim() !== "";

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
        last_modified: new Date().toISOString()
      };

      onIssueCreated(newIssue);

      setTitle("");
      setDescription("");

      /*TODO (NL): Upravit variantu toastu?*/
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
