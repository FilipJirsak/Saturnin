import { KeyboardEvent, useEffect, useState } from "react";
import { useLoaderData, useLocation, useNavigate, useParams } from "@remix-run/react";
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { requireAuth } from "~/utils/authGuard";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  AlertTriangle,
  Brain,
  CalendarDays,
  ChevronLeft,
  Copy,
  Edit,
  MoreHorizontal,
  Plus,
  Save,
  Share2,
  Tag,
  Trash2,
  User,
  X,
} from "lucide-react";
import { MindMapEditor } from "~/features/knowledge/mindmaps/mindmapEditor/MindMapEditor";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/utils/helpers";
import { typedJson } from "~/utils/typedJson";
import { formatDate } from "~/utils/dateUtils";
import { getMindMapFromLocalStorage, saveMindMapToLocalStorage } from "~/utils/knowledge/mindmapUtils";
import { useMindMapActions } from "~/hooks/useMindMapActions";
import { MindMap } from "~/types/knowledge";
import { MindMapDeleteConfirmationDialog } from "~/features/knowledge/mindmaps/MindMapDeleteConfirmationDialog";
import { MOCK_MINDMAPS } from "~/lib/data";

type LoaderData = {
  mindmap: MindMap | null;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Mindmaps - ${data?.mindmap?.title || "Myšlenková mapa"} | Saturnin` },
    { name: "description", content: "Detailní zobrazení myšlenkové mapy" },
  ];
};

//TODO (NL): Implementovat skutečné API volání pro načtení myšlenkové mapy
export const loader: LoaderFunction = async ({ request, params, context }) => {
  await requireAuth({ request, params, context });
  const { mindmapId } = params;

  const map = (MOCK_MINDMAPS.find((m) => m.id === mindmapId) ?? null) as MindMap | null;
  return typedJson({ mindmap: map });
};

export default function MindmapDetailPage() {
  const { mindmap: serverMap } = useLoaderData<{ mindmap: MindMap | null }>();
  const { mindmapId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [mindmap, setMindmap] = useState<MindMap | null>(serverMap);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMindmap, setEditedMindmap] = useState(mindmap);
  const [newTag, setNewTag] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"editor" | "info">("editor");
  const [editorKey, setEditorKey] = useState(Date.now());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (!serverMap && mindmapId) {
      const local = getMindMapFromLocalStorage(mindmapId);
      if (local) {
        setMindmap(local);
        return;
      }
      navigate("/404", { replace: true });
    }
  }, [serverMap, mindmapId, navigate]);

  const {
    handleDeleteMindMap,
    handleDuplicateMindMap,
    handleShareMindMap,
    handleUpdateMindMap,
  } = useMindMapActions();

  useEffect(() => {
    if (location.state?.editing) {
      setIsEditing(true);
    }
  }, [location.state]);

  useEffect(() => {
    setEditedMindmap(mindmap);
  }, [mindmap]);

  /*TODO (NL): Přidat loading spinner*/
  if (mindmap === null || editedMindmap === null) {
    return (
      <div className="flex items-center justify-center h-64">
        Načítám myšlenkovou mapu…
      </div>
    );
  }

  const handleAddTag = () => {
    if (newTag.trim() && !editedMindmap.tags.includes(newTag.trim())) {
      setEditedMindmap({
        ...editedMindmap,
        tags: [...editedMindmap.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedMindmap({
      ...editedMindmap,
      tags: editedMindmap.tags.filter((tag: string) => tag !== tagToRemove),
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTag();
    }
  };

  const handleSaveMap = async () => {
    setIsSaving(true);
    try {
      saveMindMapToLocalStorage(editedMindmap);
      const success = await handleUpdateMindMap(editedMindmap.id, editedMindmap);

      if (success) {
        setIsEditing(false);
        setEditorKey(Date.now());
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error("Chyba při ukládání myšlenkové mapy:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateMap = (updatedMindmap: Partial<MindMap>) => {
    setEditedMindmap({
      ...editedMindmap,
      ...updatedMindmap,
      updatedAt: new Date().toISOString(),
    });
    setHasUnsavedChanges(true);
  };

  const handleDeleteMap = async () => {
    try {
      await handleDeleteMindMap(editedMindmap.id);
      navigate("/knowledge/mindmaps");
    } catch (error) {
      console.error("Chyba při mazání myšlenkové mapy:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/knowledge/mindmaps")}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Zpět na myšlenkové mapy</span>
        </Button>

        <div className="flex items-center gap-2">
          {isEditing
            ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="gap-1"
                  disabled={isSaving}
                >
                  <X className="h-4 w-4" />
                  <span>Zrušit</span>
                </Button>
                <Button
                  onClick={handleSaveMap}
                  className="gap-1"
                  disabled={isSaving}
                >
                  {isSaving
                    ? (
                      <>
                        <span className="animate-pulse">Ukládám...</span>
                      </>
                    )
                    : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Uložit změny{hasUnsavedChanges ? "*" : ""}</span>
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
                    <DropdownMenuItem onClick={() => handleShareMindMap(editedMindmap.id, editedMindmap.isPublic)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      <span>Sdílet</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicateMindMap(editedMindmap.id)}>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Duplikovat</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteDialogOpen(true)}
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

      <Card>
        <CardHeader className="p-4 pb-0">
          {isEditing
            ? (
              <Input
                value={editedMindmap.title}
                onChange={(e) => setEditedMindmap({ ...editedMindmap, title: e.target.value })}
                className="text-xl font-bold"
              />
            )
            : (
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Brain className="h-5 w-5" style={{ color: editedMindmap?.color || "white" }} />
                {editedMindmap.title}
              </CardTitle>
            )}
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex flex-col gap-6">
            {isEditing
              ? (
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Popis</label>
                  <Textarea
                    value={editedMindmap.description}
                    onChange={(e) => setEditedMindmap({ ...editedMindmap, description: e.target.value })}
                    rows={2}
                    className="resize-none"
                  />
                </div>
              )
              : <p className="text-muted-foreground">{editedMindmap.description}</p>}

            <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as "editor" | "info")}>
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="editor" className="flex items-center gap-1">
                    <Brain className="h-4 w-4" />
                    <span>Editor myšlenkové mapy</span>
                  </TabsTrigger>
                  <TabsTrigger value="info" className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    <span>Informace a tagy</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="editor" className="mt-4">
                <div className="rounded-lg border overflow-hidden" style={{ height: "500px" }}>
                  <MindMapEditor
                    key={editorKey}
                    mindmap={editedMindmap}
                    onSave={handleUpdateMap}
                    readOnly={isEditing}
                  />
                </div>

                {isEditing && (
                  <Alert className="mt-3" variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      V režimu editace metadat je editor myšlenkové mapy uzamčen. Uložte změny pro možnost úpravy obsahu
                      mapy.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="info" className="mt-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="bg-muted/30 rounded-md p-4 space-y-3">
                      <h3 className="font-medium flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span>Tagy</span>
                      </h3>
                      <div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {editedMindmap.tags.map((tag: string) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="px-2 py-0 h-5 flex items-center gap-1"
                            >
                              {tag}
                              {isEditing && (
                                <X
                                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                                  onClick={() => handleRemoveTag(tag)}
                                />
                              )}
                            </Badge>
                          ))}
                        </div>

                        {isEditing && (
                          <div className="flex gap-2">
                            <Input
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyDown={handleKeyDown}
                              placeholder="Nový tag"
                              className="h-8 text-xs"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs px-2"
                              onClick={handleAddTag}
                              disabled={!newTag.trim()}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Přidat
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="md:w-72">
                    <div className="bg-muted/30 rounded-md p-4 space-y-2">
                      <h3 className="font-medium">Informace</h3>
                      <div className="text-sm">
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">Vytvořeno:</span>
                          <span>{formatDate(editedMindmap.createdAt)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">Aktualizováno:</span>
                          <span>{formatDate(editedMindmap.updatedAt)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">Autor:</span>
                          <span>{editedMindmap.author}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">Počet uzlů:</span>
                          <span>{editedMindmap.nodeCount}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">Veřejná:</span>
                          <span>{editedMindmap.isPublic ? "Ano" : "Ne"}</span>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="pt-2 mt-2 border-t border-border">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Veřejná mapa:</span>
                            <Button
                              variant={editedMindmap.isPublic ? "default" : "outline"}
                              size="sm"
                              className={cn(
                                "h-6 text-xs",
                                editedMindmap.isPublic && "bg-primary",
                              )}
                              onClick={() =>
                                setEditedMindmap({
                                  ...editedMindmap,
                                  isPublic: !editedMindmap.isPublic,
                                })}
                            >
                              {editedMindmap.isPublic ? "Veřejná" : "Soukromá"}
                            </Button>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {editedMindmap.isPublic
                              ? "Myšlenková mapa je viditelná pro všechny uživatele"
                              : "Myšlenková mapa je viditelná pouze pro vás"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>

        <CardFooter className="p-4 border-t">
          <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{editedMindmap.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              <span>Poslední úprava: {formatDate(editedMindmap.updatedAt)}</span>
            </div>
          </div>
        </CardFooter>
      </Card>

      <MindMapDeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={editedMindmap.title}
        itemType="myšlenkovou mapu"
        description={`Opravdu chceš smazat myšlenkovou mapu "${editedMindmap.title}"? Tato akce je nevratná a smaže i všechny uzly a spojení.`}
        onConfirm={handleDeleteMap}
      />
    </div>
  );
}
