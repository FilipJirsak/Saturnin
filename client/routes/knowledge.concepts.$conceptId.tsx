import { useState, useEffect, useRef } from "react";
import { useLoaderData, useNavigate, useLocation, Form, useParams } from "@remix-run/react";
import { type LoaderFunctionArgs } from "@remix-run/node";
import {
  ChevronLeft,
  Edit,
  Save,
  X,
  MoreHorizontal,
  Loader2,
  Trash2,
  LinkIcon,
  Share2,
  Copy,
  Network
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog";
import { useToast } from "~/hooks/use-toast";

import { requireAuth } from "~/utils/authGuard";
import { typedJson } from "~/utils/typedJson";
import { RelatedConcept, Concept } from "~/types/knowledge";
import { MOCK_CONCEPTS } from "~/lib/data";
import {ConceptInfo} from "~/features/knowledge/concepts/conceptDetail/ConceptInfo";
import {ConceptTagsManager} from "~/features/knowledge/concepts/conceptDetail/ConceptTagsManager";
import {ConceptRelationManager} from "~/features/knowledge/concepts/conceptDetail/ConceptRelationManager";
import { getConceptFromLocalStorage, saveConceptToLocalStorage, deleteConceptFromLocalStorage } from "~/utils/knowledge/conceptUtils";

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuth(args);

  const conceptId = args.params.conceptId;
  if (!conceptId) {
    throw new Response("Concept ID is required", { status: 400 });
  }

  const mockConcept = MOCK_CONCEPTS.find(c => c.id === conceptId);
  return typedJson({ concept: mockConcept ?? null });
};

export const action = async (args: LoaderFunctionArgs) => {
  await requireAuth(args);

  const conceptId = args.params.conceptId;
  if (!conceptId) {
    throw new Response("Concept ID is required", { status: 400 });
  }

  const formData = await args.request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    try {
      deleteConceptFromLocalStorage(conceptId);
      return typedJson({ success: true });
    } catch (error) {
      return typedJson({ error: "Failed to delete concept" }, { status: 500 });
    }
  }

  if (intent === "update") {
    try {
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const tags = formData.getAll("tags") as string[];
      const related = JSON.parse(formData.get("related") as string);

      const concept = getConceptFromLocalStorage(conceptId);
      if (!concept) {
        throw new Response("Concept not found", { status: 404 });
      }

      const updatedConcept: Concept = {
        ...concept,
        title,
        description,
        tags,
        related,
        lastModified: new Date().toISOString()
      };

      saveConceptToLocalStorage(updatedConcept);
      return typedJson({ concept: updatedConcept });
    } catch (error) {
      return typedJson({ error: "Failed to update concept" }, { status: 500 });
    }
  }

  return typedJson({ error: "Invalid action" }, { status: 400 });
};

export default function ConceptDetailPage() {
  const { concept: serverConcept } = useLoaderData<typeof loader>();
  const { conceptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [concept, setConcept] = useState<Concept|null>(serverConcept);
  const [isEditing, setIsEditing] = useState(false);
  const [editedConcept, setEditedConcept] = useState(concept);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const updateFormRef = useRef<HTMLFormElement>(null);
  const deleteFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!serverConcept && conceptId) {
      const localConcept = getConceptFromLocalStorage(conceptId);
      if (localConcept) {
        setConcept(localConcept);
        setEditedConcept(localConcept);
        return;
      }
      navigate("/404", { replace: true });
    }
  }, [serverConcept, conceptId, navigate]);

  useEffect(() => {
    if (location.state?.editing) {
      setIsEditing(true);
    }
  }, [location.state]);

  useEffect(() => {
    setEditedConcept(concept);
  }, [concept]);

  if (concept === null || editedConcept === null) {
    return (
      <div className="flex items-center justify-center h-64">
        Načítám koncept...
      </div>
    );
  }

  const handleSaveConcept = async () => {
    setIsSaving(true);
    try {
      const updatedConcept = {
        ...editedConcept,
        lastModified: new Date().toISOString()
      };

      saveConceptToLocalStorage(updatedConcept);
      setConcept(updatedConcept);
      setEditedConcept(updatedConcept);
      setIsEditing(false);

      toast({
        title: "Koncept uložen",
        description: "Změny byly úspěšně uloženy.",
        variant: "success"
      });
    } catch (error) {
      console.error("Chyba při ukládání konceptu:", error);
      toast({
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit změny. Zkuste to prosím znovu.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConcept = () => {
    setIsDeleting(true);
    try {
      deleteFormRef.current?.requestSubmit();
    } catch (error) {
      console.error("Chyba při mazání konceptu:", error);
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Chyba při mazání",
        description: "Nepodařilo se smazat koncept. Zkuste to prosím znovu.",
        variant: "destructive"
      });
    }
  };

  const handleAddTag = (tag: string) => {
    if (tag && !editedConcept.tags.includes(tag)) {
      setEditedConcept({
        ...editedConcept,
        tags: [...editedConcept.tags, tag],
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedConcept({
      ...editedConcept,
      tags: editedConcept.tags.filter((tag: string) => tag !== tagToRemove),
    });
  };

  const handleRemoveRelation = (relationId: string) => {
    setEditedConcept({
      ...editedConcept,
      related: editedConcept.related.filter((rel: RelatedConcept) => rel.id !== relationId)
    });
  };

  const handleAddRelation = (relationId: string, relationType: string) => {
    const targetConcept = MOCK_CONCEPTS.find((c: Concept) => c.id === relationId);
    if (!targetConcept) return;

    const newRelation: RelatedConcept = {
      id: relationId,
      title: targetConcept.title,
      relation: relationType as "is_a" | "has_a" | "related_to" | "depends_on" | "part_of"
    };

    setEditedConcept({
      ...editedConcept,
      related: [...editedConcept.related, newRelation]
    });
  };

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/knowledge/concepts")}
              className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Zpět na koncepty</span>
          </Button>

          <div className="flex items-center gap-2">
            {isEditing ? (
                <>
                  <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedConcept(concept);
                      }}
                      className="gap-1"
                      disabled={isSaving}
                  >
                    <X className="h-4 w-4" />
                    <span>Zrušit</span>
                  </Button>
                  <Button
                      onClick={handleSaveConcept}
                      className="gap-1"
                      disabled={isSaving}
                  >
                    {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          <span>Ukládání...</span>
                        </>
                    ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Uložit změny</span>
                        </>
                    )}
                  </Button>
                </>
            ) : (
                <>
                  <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Upravit</span>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Akce</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        <span>Kopírovat odkaz</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Duplikovat</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="mr-2 h-4 w-4" />
                        <span>Sdílet</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setIsDeleteDialogOpen(true)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Smazat</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="overflow-hidden border shadow-sm">
            <CardHeader className="p-6 pb-4 border-b bg-muted/20">
              {isEditing ? (
                  <Input
                      value={editedConcept.title}
                      onChange={(e) => setEditedConcept({ ...editedConcept, title: e.target.value })}
                      className="text-xl font-bold"
                      placeholder="Název konceptu"
                      required
                  />
              ) : (
                  <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                    <Network className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    {editedConcept.title}
                  </CardTitle>
              )}
            </CardHeader>

            <CardContent className="p-6">
              {isEditing ? (
                  <Textarea
                      value={editedConcept.description}
                      onChange={(e) => setEditedConcept({ ...editedConcept, description: e.target.value })}
                      className="w-full p-3 min-h-24 mb-4"
                      placeholder="Popis konceptu"
                      required
                  />
              ) : (
                  <p className="mb-6 leading-relaxed">
                    {editedConcept.description}
                  </p>
              )}

              <div className="flex flex-col gap-6 mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-muted/10 rounded-lg p-4 border border-border/40">
                    <ConceptTagsManager
                        tags={editedConcept.tags}
                        isEditing={isEditing}
                        onAddTag={handleAddTag}
                        onRemoveTag={handleRemoveTag}
                    />
                  </div>

                  <div className="bg-muted/10 rounded-lg p-4 border border-border/40">
                    <ConceptInfo
                        author={editedConcept.author}
                        createdAt={editedConcept.createdAt}
                        lastModified={editedConcept.lastModified}
                    />
                  </div>
                </div>

                <div className="bg-muted/10 rounded-lg p-4 border border-border/40">
                  <ConceptRelationManager
                      relations={editedConcept.related}
                      isEditing={isEditing}
                      availableConcepts={MOCK_CONCEPTS}
                      onRemoveRelation={handleRemoveRelation}
                      onAddRelation={handleAddRelation}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Opravdu chcete smazat tento koncept?</AlertDialogTitle>
              <AlertDialogDescription>
                Tato akce je nevratná. Koncept "{editedConcept.title}" bude trvale odstraněn.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Zrušit</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConcept} className="bg-destructive">
                {isDeleting ? "Mazání..." : "Smazat"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Form method="post" ref={updateFormRef} className="hidden">
          <input type="hidden" name="intent" value="update" />
          <input type="hidden" name="title" value={editedConcept.title} />
          <input type="hidden" name="description" value={editedConcept.description} />
          <input type="hidden" name="tags" value={JSON.stringify(editedConcept.tags)} />
          <input type="hidden" name="related" value={JSON.stringify(editedConcept.related)} />
        </Form>

        <Form method="post" ref={deleteFormRef} className="hidden">
          <input type="hidden" name="intent" value="delete" />
          <input type="hidden" name="conceptId" value={editedConcept.id} />
        </Form>
      </div>
  );
}
