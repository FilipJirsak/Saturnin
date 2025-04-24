import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Network, Plus, Search } from "lucide-react";
import { Input } from "~/components/ui/input";
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
import {filterConcepts} from "~/utils/knowledge/conceptUtils";

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuth(args);
  return typedJson({ concepts: MOCK_CONCEPTS });
};

export default function KnowledgeConceptsPage() {
  const { concepts: initialConcepts } = useLoaderData<typeof loader>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const { searchTerm } = useSearch();
  const [currentUser] = useState("Nela Letochová"); // TODO (NL): Získat aktuálního uživatele z API
  const {
    concepts,
    isCreatingConcept,
    setIsCreatingConcept,
    isLoading,
    toggleConceptExpand,
    handleCreateConcept
  } = useConcepts({
    initialConcepts,
    currentUser
  });

  const effectiveSearchTerm = searchTerm || localSearchQuery;
  const filteredConcepts = filterConcepts(concepts, effectiveSearchTerm);

  return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Koncepty
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            {!searchTerm && (
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                      placeholder="Hledat koncepty..."
                      value={localSearchQuery}
                      onChange={(e) => setLocalSearchQuery(e.target.value)}
                      className="pl-8"
                  />
                </div>
            )}

            <div className="flex gap-2">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
                <TabsList className="h-9">
                  <TabsTrigger value="grid" className="px-3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                    >
                      <rect width="7" height="7" x="3" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="14" rx="1" />
                      <rect width="7" height="7" x="3" y="14" rx="1" />
                    </svg>
                  </TabsTrigger>
                  <TabsTrigger value="list" className="px-3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                    >
                      <line x1="8" x2="21" y1="6" y2="6" />
                      <line x1="8" x2="21" y1="12" y2="12" />
                      <line x1="8" x2="21" y1="18" y2="18" />
                      <line x1="3" x2="3.01" y1="6" y2="6" />
                      <line x1="3" x2="3.01" y1="12" y2="12" />
                      <line x1="3" x2="3.01" y1="18" y2="18" />
                    </svg>
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
        </div>

        {filteredConcepts.length === 0 ? (
            <ConceptEmptyState
                searchTerm={effectiveSearchTerm}
                onCreateClick={() => setIsCreatingConcept(true)}
            />
        ) : (
            <div>
              {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredConcepts.map(concept => (
                        <ConceptCard key={concept.id} concept={concept} />
                    ))}
                  </div>
              ) : (
                  <div className="space-y-2">
                    {filteredConcepts.map(concept => (
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
