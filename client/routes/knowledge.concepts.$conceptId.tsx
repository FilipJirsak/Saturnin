import { useEffect, useState } from "react";
import { useFetcher, useLoaderData, useLocation, useNavigate, useParams } from "@remix-run/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  ChevronLeft,
  Copy,
  Edit,
  LinkIcon,
  Loader2,
  MoreHorizontal,
  Network,
  Save,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { useToast } from "~/hooks/use-toast";

import { requireAuth } from "~/utils/authGuard";
import { typedJson } from "~/utils/typedJson";
import { Concept } from "~/types/knowledge";
import { MOCK_CONCEPTS } from "~/lib/data";
import { ConceptInfo } from "~/features/knowledge/concepts/conceptDetail/ConceptInfo";
import { ConceptTagsManager } from "~/features/knowledge/concepts/conceptDetail/ConceptTagsManager";
import { ConceptRelationManager } from "~/features/knowledge/concepts/conceptDetail/ConceptRelationManager";
import {
  deleteConceptFromLocalStorage,
  getConceptFromLocalStorage,
  saveConceptToLocalStorage,
} from "~/utils/knowledge/conceptUtils";

type LoaderData = {
  concept: Concept | null;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Koncept - ${data?.concept?.title || "Koncept"} | Saturnin` },
    { name: "description", content: "Detailní zobrazení konceptu" },
  ];
};

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuth(args);
  const conceptId = args.params.conceptId;
  if (!conceptId) throw new Response("Concept ID is required", { status: 400 });
  const mockConcept = MOCK_CONCEPTS.find((c) => c.id === conceptId);
  return typedJson({ concept: mockConcept ?? null });
};

export const action = async (args: LoaderFunctionArgs) => {
  await requireAuth(args);
  const formData = await args.request.formData();
  if (formData.get("intent") === "delete") {
    return typedJson({ success: true });
  }
  return typedJson({ error: "Invalid action" }, { status: 400 });
};

export default function ConceptDetailPage() {
  const { concept: serverConcept } = useLoaderData<typeof loader>();
  const { conceptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [concept, setConcept] = useState<Concept | null>(serverConcept);
  const [isEditing, setIsEditing] = useState(false);
  const [editedConcept, setEditedConcept] = useState<Concept | null>(
    serverConcept,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const deleteFetcher = useFetcher<typeof action>();
  const isDeleting = deleteFetcher.state === "submitting";

  useEffect(() => {
    if (!serverConcept && conceptId) {
      const local = getConceptFromLocalStorage(conceptId);
      if (local) {
        setConcept(local);
        setEditedConcept(local);
      } else {
        navigate("/404", { replace: true });
      }
    }
  }, [serverConcept, conceptId, navigate]);

  useEffect(() => {
    if (location.state?.editing) setIsEditing(true);
  }, [location.state]);

  useEffect(() => {
    setEditedConcept(concept);
  }, [concept]);

  useEffect(() => {
    if (
      deleteFetcher.state === "idle" &&
      deleteFetcher.data !== undefined
    ) {
      setIsDeleteDialogOpen(false);

      if (deleteFetcher.data.success) {
        if (conceptId) {
          deleteConceptFromLocalStorage(conceptId);
        }
        toast({ title: "Koncept smazán", variant: "success" });
        navigate("/knowledge/concepts");
      } else {
        toast({
          title: "Chyba při mazání",
          description: "Nepodařilo se koncept smazat.",
          variant: "destructive",
        });
      }
    }
  }, [
    deleteFetcher.state,
    deleteFetcher.data,
    navigate,
    toast,
    conceptId,
  ]);

  const handleSaveConcept = async () => {
    if (!editedConcept) return;
    setIsSaving(true);
    try {
      const updated: Concept = {
        ...editedConcept,
        lastModified: new Date().toISOString(),
      };
      saveConceptToLocalStorage(updated);
      setConcept(updated);
      setEditedConcept(updated);
      setIsEditing(false);
      toast({
        title: "Koncept uložen",
        description: "Změny byly úspěšně uloženy.",
        variant: "success",
      });
    } catch {
      toast({
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit změny.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConcept = () => {
    deleteFetcher.submit(
      { intent: "delete" },
      { method: "post", action: "" },
    );
  };

  if (concept === null || editedConcept === null) {
    return (
      <div className="flex items-center justify-center h-64">
        Načítám koncept...
      </div>
    );
  }

  const handleAddTag = (tag: string) => {
    if (tag && !editedConcept.tags.includes(tag)) {
      setEditedConcept({
        ...editedConcept,
        tags: [...editedConcept.tags, tag],
      });
    }
  };
  const handleRemoveTag = (tag: string) =>
    setEditedConcept({
      ...editedConcept,
      tags: editedConcept.tags.filter((t) => t !== tag),
    });
  const handleRemoveRelation = (id: string) =>
    setEditedConcept({
      ...editedConcept,
      related: editedConcept.related.filter((r) => r.id !== id),
    });
  const handleAddRelation = (id: string, rel: string) => {
    const target = MOCK_CONCEPTS.find((c) => c.id === id);
    if (!target) return;
    setEditedConcept({
      ...editedConcept,
      related: [
        ...editedConcept.related,
        { id, title: target.title, relation: rel as any },
      ],
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
          {isEditing
            ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedConcept(concept);
                  }}
                  disabled={isSaving}
                  className="gap-1"
                >
                  <X className="h-4 w-4" />
                  <span>Zrušit</span>
                </Button>
                <Button
                  onClick={handleSaveConcept}
                  disabled={isSaving}
                  className="gap-1"
                >
                  {isSaving
                    ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Ukládání...
                      </>
                    )
                    : (
                      <>
                        <Save className="h-4 w-4" />
                        Uložit změny
                      </>
                    )}
                </Button>
              </>
            )
            : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Upravit
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
                      Kopírovat odkaz
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplikovat
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" />
                      Sdílet
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Smazat
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
            {isEditing
              ? (
                <Input
                  value={editedConcept.title}
                  onChange={(e) =>
                    setEditedConcept({
                      ...editedConcept,
                      title: e.target.value,
                    })}
                  placeholder="Název konceptu"
                  className="text-xl font-bold"
                  required
                />
              )
              : (
                <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  <Network className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  {editedConcept.title}
                </CardTitle>
              )}
          </CardHeader>
          <CardContent className="p-6">
            {isEditing
              ? (
                <Textarea
                  value={editedConcept.description}
                  onChange={(e) =>
                    setEditedConcept({
                      ...editedConcept,
                      description: e.target.value,
                    })}
                  placeholder="Popis konceptu"
                  className="w-full p-3 min-h-24 mb-4"
                  required
                />
              )
              : (
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

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Opravdu chceš smazat tento koncept?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tato akce je nevratná. Koncept „{editedConcept.title}“ bude trvale odstraněn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Zrušit
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConcept}
              disabled={isDeleting}
              className="bg-destructive"
            >
              {isDeleting
                ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Mazání...
                  </>
                )
                : (
                  "Smazat"
                )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
