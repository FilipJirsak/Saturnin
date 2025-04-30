import { createContext, useContext, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "@remix-run/react";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import { Book, Brain, Network, Search, Tag, X } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ToastProvider } from "~/components/ui/toast";

// TODO (NL): Zvážit přidání breadcrumbs navigace pro lepší orientaci ve složkách
// TODO (NL): Přidat animace pro přechody mezi záložkami, aby byl UI experience plynulejší
// TODO (NL): Přidat podporu pro klávesové zkratky pro navigaci mezi záložkami
interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearching: boolean;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType>({
  searchTerm: "",
  setSearchTerm: () => {},
  isSearching: false,
  clearSearch: () => {},
});

export const useSearch = () => useContext(SearchContext);

export function KnowledgeLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  let activeTab = "library";
  if (location.pathname.includes("/knowledge/concepts")) activeTab = "concepts";
  if (location.pathname.includes("/knowledge/mindmaps")) activeTab = "mindmaps";
  if (location.pathname.includes("/knowledge/tags")) activeTab = "tags";

  const isSearching = Boolean(searchTerm.trim());

  const clearSearch = () => {
    setSearchTerm("");
  };

  const searchContextValue = useMemo(
    () => ({
      searchTerm,
      setSearchTerm,
      isSearching,
      clearSearch,
    }),
    [searchTerm, isSearching],
  );

  const handleTabChange = (tab: string) => {
    if (isSearching) {
      clearSearch();
    }

    switch (tab) {
      case "library":
        navigate("/knowledge/library");
        break;
      case "concepts":
        navigate("/knowledge/concepts");
        break;
      case "mindmaps":
        navigate("/knowledge/mindmaps");
        break;
      case "tags":
        navigate("/knowledge/tags");
        break;
    }
  };

  return (
    <SearchContext.Provider value={searchContextValue}>
      <ToastProvider>
        <div className="container mx-auto py-4">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold font-display flex items-center gap-2">
                  <Brain className="h-7 w-7 text-primary" />
                  Znalosti
                </h1>
                <p className="text-muted-foreground">
                  Tvoje znalostní báze, dokumenty, koncepty a myšlenkové mapy
                </p>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Hledat znalosti..."
                  className="pl-8 pr-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {isSearching && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-9 w-9"
                    onClick={clearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {isSearching && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-2 py-0.5">
                  <Search className="h-3 w-3 mr-1" />
                  Vyhledávání: "{searchTerm}"
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7"
                  onClick={clearSearch}
                >
                  Zrušit vyhledávání
                </Button>
              </div>
            )}

            <Separator />

            <Tabs value={activeTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger
                  value="library"
                  onClick={() => handleTabChange("library")}
                  className="flex items-center gap-2"
                >
                  <Book className="h-4 w-4" />
                  <span>Knihovna</span>
                </TabsTrigger>
                <TabsTrigger
                  value="concepts"
                  onClick={() => handleTabChange("concepts")}
                  className="flex items-center gap-2"
                >
                  <Network className="h-4 w-4" />
                  <span>Koncepty</span>
                </TabsTrigger>
                <TabsTrigger
                  value="mindmaps"
                  onClick={() => handleTabChange("mindmaps")}
                  className="flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  <span>Mind mapy</span>
                </TabsTrigger>
                <TabsTrigger
                  value="tags"
                  onClick={() => handleTabChange("tags")}
                  className="flex items-center gap-2"
                >
                  <Tag className="h-4 w-4" />
                  <span>Tagy</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Outlet />
          </div>
        </div>
      </ToastProvider>
    </SearchContext.Provider>
  );
}
