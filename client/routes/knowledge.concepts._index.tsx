import { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { type LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Grid2X2, List, Network, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { requireAuth } from "~/utils/authGuard";
import { typedJson } from "~/utils/typedJson";
import { useSearch } from "~/features/knowledge/KnowledgeLayout";
import { useConcepts } from "~/hooks/useConcepts";
import { ConceptCard } from "~/features/knowledge/concepts/ConceptCard";
import { ConceptListItem } from "~/features/knowledge/concepts/ConceptListItem";
import { ConceptEmptyState } from "~/features/knowledge/concepts/ConceptEmptyState";
import { ConceptCreationSidebar } from "~/features/knowledge/concepts/ConceptCreationSidebar";
import { MOCK_CONCEPTS } from "~/lib/data";
import { filterConcepts, getConceptsFromLocalStorage } from "~/utils/knowledge/conceptUtils";

export const meta: MetaFunction = () => {
  return [
    { title: "Znalosti - Koncepty | Saturnin" },
    { name: "description", content: "Tvá znalostní báze" },
  ];
};

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuth(args);
  const concepts = getConceptsFromLocalStorage();

  if (concepts.length === 0) {
    return typedJson({ concepts: MOCK_CONCEPTS });
  }

  return typedJson({ concepts });
};

export default function KnowledgeConceptsPage() {
  const { concepts: initialConcepts } = useLoaderData<typeof loader>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { searchTerm } = useSearch();
  const [currentUser] = useState("Nela Letochová"); // TODO (NL): Získat aktuálního uživatele z API
  const {
    concepts,
    setConcepts,
    isCreatingConcept,
    setIsCreatingConcept,
    isLoading,
    toggleConceptExpand,
    handleCreateConcept,
  } = useConcepts({
    initialConcepts,
    currentUser,
  });

  useEffect(() => {
    const refreshConcepts = () => {
      const storedConcepts = getConceptsFromLocalStorage();
      if (storedConcepts.length > 0) {
        setConcepts(storedConcepts);
      }
    };

    refreshConcepts();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshConcepts();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [setConcepts]);

  const filteredConcepts = filterConcepts(concepts, searchTerm);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          Koncepty
        </h2>

        <div className="flex justify-between items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
            <TabsList className="h-9">
              <TabsTrigger value="grid" className="px-3">
                <Grid2X2 className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="list" className="px-3">
                <List className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            className="flex items-center gap-1"
            onClick={() => setIsCreatingConcept(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Nový koncept</span>
          </Button>
        </div>
      </div>

      {filteredConcepts.length === 0
        ? (
          <ConceptEmptyState
            searchTerm={searchTerm}
            onCreateClick={() => setIsCreatingConcept(true)}
          />
        )
        : (
          <div>
            {viewMode === "grid"
              ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredConcepts.map((concept) => <ConceptCard key={concept.id} concept={concept} />)}
                </div>
              )
              : (
                <div className="space-y-2">
                  {filteredConcepts.map((concept) => (
                    <ConceptListItem
                      key={concept.id}
                      concept={concept}
                      onToggleExpand={toggleConceptExpand}
                    />
                  ))}
                </div>
              )}
          </div>
        )}

      <ConceptCreationSidebar
        isOpen={isCreatingConcept}
        onClose={() => setIsCreatingConcept(false)}
        onSave={handleCreateConcept}
        currentUser={currentUser}
        isLoading={isLoading}
      />
    </div>
  );
}
