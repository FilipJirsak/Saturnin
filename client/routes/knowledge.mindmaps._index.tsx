import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { ActionFunction, LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { requireAuth } from "~/utils/authGuard";
import { typedJson } from "~/utils/typedJson";
import { useSearch } from "~/features/knowledge/KnowledgeLayout";
import { MindMap, NewMindMap } from "~/types/knowledge";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Brain, Plus, SearchX } from "lucide-react";
import { MindMapCreationSidebar } from "~/features/knowledge/mindmaps/MindMapCreationSidebar";
import { createMindMap, getMindMapFromLocalStorage, getMindMapsFromLocalStorage } from "~/utils/knowledge/mindmapUtils";
import { useToast } from "~/hooks/use-toast";
import { useMindMapActions } from "~/hooks/useMindMapActions";
import { MindMapCard } from "~/features/knowledge/mindmaps/MindMapCard";
import { MOCK_MINDMAPS } from "~/lib/data";

export const meta: MetaFunction = () => {
  return [
    { title: "Znalosti - Mindmapy | Saturnin" },
    { name: "description", content: "Tvá znalostní báze" },
  ];
};

// TODO (NL): Implementovat načítání dat z API
export const loader: LoaderFunction = async ({ request, params, context }) => {
  await requireAuth({ request, params, context });
  return typedJson({ mindmaps: MOCK_MINDMAPS });
};

export const action: ActionFunction = async ({ request, params, context }) => {
  await requireAuth({ request, params, context });

  const form = await request.formData();
  const title = form.get("title") as string;
  const description = form.get("description") as string;
  const tags = form.getAll("tags") as string[];
  const author = form.get("author") as string;

  const newMap = await createMindMap({ title, description, tags, author });
  if (!newMap) {
    throw new Response("Nepodařilo se vytvořit mindmapu", { status: 500 });
  }

  MOCK_MINDMAPS.unshift(newMap);

  return redirect(`/knowledge/mindmaps/${newMap.id}`);
};

export default function KnowledgeMindMapsPage() {
  const { searchTerm, isSearching } = useSearch();
  const navigate = useNavigate();
  const { mindmaps: serverMaps } = useLoaderData<typeof loader>();

  const { toast } = useToast();
  const [currentUser] = useState("Nela Letochová"); //TODO (NL): Získat aktuálního uživatele z API
  const [isCreatingMindMap, setIsCreatingMindMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mindmaps, setMindmaps] = useState<MindMap[]>([]);

  //TODO (NL): Zkusit zařídit, aby se MOCK_MINDMAPS uložily do localStorage a pak už se mazaly stejně, jako nově vytvořené mapy
  useEffect(() => {
    const local = getMindMapsFromLocalStorage();
    const ids = new Set(local.map((m) => m.id));
    const uniqueServer = serverMaps.filter((m: { id: string }) => !ids.has(m.id));
    setMindmaps([...local, ...uniqueServer]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  }, [serverMaps]);

  const {
    handleDeleteMindMap,
    handleDuplicateMindMap,
    handleShareMindMap,
  } = useMindMapActions((action, updatedMap) => {
    if (action === "delete" && updatedMap) {
      setMindmaps((prev) => prev.filter((m) => m.id !== updatedMap.id));
    } else if (action === "share" && updatedMap) {
      setMindmaps((prev) => prev.map((m) => m.id === updatedMap.id ? { ...m, isPublic: updatedMap.isPublic } : m));
    } else if (action === "duplicate" && updatedMap) {
      const newMap = updatedMap.title ? updatedMap : getMindMapFromLocalStorage(updatedMap.id);

      if (newMap) {
        setMindmaps((prev) => [newMap, ...prev]);
      }

      navigate(`/knowledge/mindmaps/${updatedMap.id}`);
    }
  });

  // TODO (NL): Implementovat filtrování podle tagů a dalších vlastností
  const filteredMindmaps = isSearching
    ? mindmaps.filter((mindmap) =>
      mindmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mindmap.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mindmap.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    : mindmaps;

  const handleCreateMindMap = async (newMindMap: NewMindMap) => {
    setIsLoading(true);

    try {
      const createdMindMap = await createMindMap(newMindMap);

      if (createdMindMap) {
        setMindmaps((prev) => [createdMindMap, ...prev]);

        toast({
          title: "Myšlenková mapa vytvořena",
          description: `Myšlenková mapa "${newMindMap.title}" byla úspěšně vytvořena.`,
          variant: "success",
        });

        setIsCreatingMindMap(false);

        setTimeout(() => {
          navigate(`/knowledge/mindmaps/${createdMindMap.id}`);
        }, 300);

        navigate(`/knowledge/mindmaps/${createdMindMap.id}`);
      } else {
        toast({
          title: "Chyba při vytváření mapy",
          description: "Nepodařilo se vytvořit myšlenkovou mapu. Zkus to prosím znovu.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Chyba při vytváření myšlenkové mapy:", error);
      toast({
        title: "Chyba při vytváření mapy",
        description: "Nepodařilo se vytvořit myšlenkovou mapu. Zkus to prosím znovu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Myšlenkové mapy
          {isSearching && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              {filteredMindmaps.length} výsledků
            </span>
          )}
        </h2>

        <Button
          className="flex items-center gap-1"
          onClick={() => setIsCreatingMindMap(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Nová myšlenková mapa</span>
        </Button>
      </div>

      {isSearching && filteredMindmaps.length === 0
        ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <SearchX className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-1">Žádné výsledky</h3>
            <p className="text-muted-foreground mb-4">
              Pro vyhledávání "{searchTerm}" nebyly nalezeny žádné myšlenkové mapy.
            </p>
          </div>
        )
        : filteredMindmaps.length === 0
        ? (
          <Alert>
            <AlertDescription>
              Zatím nemáš žádné myšlenkové mapy. Vytvoř novou pomocí tlačítka "Nová myšlenková mapa".
            </AlertDescription>
          </Alert>
        )
        : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMindmaps.map((mindmap) => (
              <MindMapCard
                key={mindmap.id}
                mindmap={mindmap}
                onDelete={handleDeleteMindMap}
                onDuplicate={handleDuplicateMindMap}
                onShare={() => handleShareMindMap(mindmap.id, mindmap.isPublic || false)}
              />
            ))}
          </div>
        )}

      <MindMapCreationSidebar
        isOpen={isCreatingMindMap}
        onClose={() => setIsCreatingMindMap(false)}
        onSave={handleCreateMindMap}
        currentUser={currentUser}
        isLoading={isLoading}
      />
    </div>
  );
}
