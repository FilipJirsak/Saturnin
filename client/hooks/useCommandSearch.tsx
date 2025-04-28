import {useState, useRef, useCallback, useEffect, DragEvent} from "react";
import { useToast } from "~/hooks/use-toast";
import { useNavigate } from "@remix-run/react";
import type { ProjectWithIssues } from "~/types";
import {
  SearchResult,
  performTextSearch,
  handleFileDropForSearch,
  extractUrlFromDrop, determineSearchType
} from "~/utils/searchUtils";
import { Link, FileText, Settings, Book, Calendar, Plus } from "lucide-react";

interface UseCommandSearchOptions {
  projects: ProjectWithIssues[];
  onClose?: () => void;
}

// TODO (NL): Upravit funkcionalitu přidání nového issue, pokud není žádné nalezeno
export function useCommandSearch({ projects, onClose }: UseCommandSearchOptions) {
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // TODO (NL): Přidat cachování výsledků vyhledávání pro lepší výkon
  const performSearch = useCallback(
      async (query: string, type: "text" | "file" | "url" = "text") => {
        setIsSearching(true);

        try {
          if (!query.trim() && type === "text") {
            setResults([]);
            return;
          }

          //TODO (NL): Nahradit simulaci síťového zpoždění skutečným API voláním
          await new Promise((resolve) => setTimeout(resolve, 150));

          let searchResults: SearchResult[] = [];

          if (type === "url") {
            toast({
              title: "Vyhledávání URL",
              description: `Vyhledávám odkazy obsahující: ${query}`,
            });

            //TODO (NL): Implementovat skutečné vyhledávání URL místo mockovaných dat
            searchResults.push({
              id: "url-result",
              type: "url",
              title: "Externí odkaz",
              subtitle: query,
              url: query,
              icon: <Link className="text-blue-500" />,
              matchScore: 1.0,
            });
          } else if (type === "file") {
            toast({
              title: "Vyhledávání souboru",
              description: `Analyzuji obsah souboru pro hledání shod`,
            });

            //TODO (NL): Implementovat skutečné vyhledávání souborů místo mockovaných dat
            searchResults.push({
              id: "file-result",
              type: "file",
              title: query,
              subtitle: "Nahraný soubor",
              icon: <FileText className="text-green-500" />,
              matchScore: 1.0,
            });
          } else {
            searchResults = performTextSearch(query, projects);

           /* //TODO (NL): Vylepšit detekci URL a přidat více metadat k výsledkům URL?
            if (isValidUrl(query)) {
              searchResults.push({
                id: "url-match",
                type: "url",
                title: "Externí odkaz",
                subtitle: query,
                url: query,
                icon: <Link className="text-blue-500" />,
                matchScore: 1.0,
              });
            }*/

            //TODO (NL): Nahradit statické vyhledávání stránek dynamickým systémem mapování klíčových slov?
            const searchQuery = query.toLowerCase().trim();
            if (
                searchQuery.includes("nastavení") ||
                searchQuery.includes("settings")
            ) {
              searchResults.push({
                id: "settings",
                type: "page",
                title: "Nastavení",
                subtitle: "Stránka",
                url: "/settings",
                icon: <Settings className="text-muted-foreground" />,
                matchScore: 0.7,
              });
            }

            if (
                searchQuery.includes("inbox") ||
                searchQuery.includes("přijaté")
            ) {
              searchResults.push({
                id: "inbox",
                type: "page",
                title: "Inbox",
                subtitle: "Stránka",
                url: "/inbox",
                icon: <Book className="text-muted-foreground" />,
                matchScore: 0.7,
              });
            }

            if (
                searchQuery.includes("kalendář") ||
                searchQuery.includes("calendar")
            ) {
              searchResults.push({
                id: "calendar",
                type: "page",
                title: "Kalendář",
                subtitle: "Stránka",
                url: "/calendar",
                icon: <Calendar className="text-muted-foreground" />,
                matchScore: 0.7,
              });
            }
          }

          setResults(searchResults);
        } catch (error) {
          console.error("Chyba při vyhledávání:", error);
          toast({
            title: "Chyba při vyhledávání",
            description: "Nepodařilo se načíst výsledky vyhledávání",
            variant: "destructive",
          });
        } finally {
          setIsSearching(false);
        }
      },
      [projects, toast]
  );

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);

    //TODO (NL): Optimalizovat logiku rušení timeoutů při vícenásobných změnách vstupu
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    //TODO (NL): Přidat nastavitelné debounce zpoždění na základě uživatelských preferencí
    searchTimeoutRef.current = setTimeout(() => {
      const searchType = determineSearchType(value);
      performSearch(value, searchType);
    }, 500);
  }, [performSearch]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSelect = useCallback((result: SearchResult) => {
    setInputValue("");
    onClose?.();

    if (result.url) {
      if (result.type === "url") {
        //TODO (NL): Přidat nastavitelné debounce zpoždění na základě uživatelských preferencí
        window.open(result.url, "_blank");
        return;
      }
      //TODO (NL): Rozšířit podporu pro různé typy interních URL včetně parametrizovaných cest
      navigate(result.url);
      return;
    }

    if (result.type === "issue" && result.projectCode && result.issueCode) {
      navigate(`/projects/${result.projectCode}/issue/${result.issueCode}`);
      return;
    }

    if (result.type === "project" && result.projectCode) {
      navigate(`/projects/${result.projectCode}`);
      return;
    }

    if (result.type === "file") {
      toast({
        title: "Soubor nalezen",
        description: "Otevírám související obsah k souboru",
      });
      return;
    }

    //TODO (NL): Implementovat logiku pro přidávání nového issue (zatím jen navigace na Inbox)
    if (result.type === "create-issue") {
      navigate("/");
      toast({
        title: "Vytváření nového issue",
        description: `Vytváření nového issue: ${inputValue}`,
      });
      return;
    }
  }, [navigate, toast, onClose, inputValue]);

  const createNewIssue = useCallback(() => {
    const createIssueResult: SearchResult = {
      id: "create-issue",
      type: "create-issue",
      title: `Vytvořit nové issue: "${inputValue}"`,
      subtitle: "Přejít na stránku vytváření",
      icon: <Plus className="text-green-500" />,
      url: "/"
    };

    handleSelect(createIssueResult);
  }, [inputValue, handleSelect]);

  const dragAndDropHandlers = {
    handleDragOver: (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    },

    handleDragLeave: (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    },

    handleDrop: async (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      //TODO (NL): Implementovat validaci souborů a omezení velikosti před zpracováním
      const fileInfo = handleFileDropForSearch(e);
      if (fileInfo) {
        setInputValue(fileInfo.fileName);
        performSearch(fileInfo.fileName, "file");
        return;
      }

      //TODO (NL): Rozšířit detekci URL?
      const url = extractUrlFromDrop(e);
      if (url) {
        setInputValue(url);
        performSearch(url, "url");
        return;
      }

      const text = e.dataTransfer.getData("text");
      if (text) {
        //TODO (NL): Implementovat pokročilejší detekci typu obsahu na základě přetaženého textu
        const searchType = determineSearchType(text);
        performSearch(text, searchType);
      }
    }
  };

  return {
    inputValue,
    setInputValue,
    isSearching,
    results,
    isDragging,
    handleInputChange,
    handleSelect,
    createNewIssue,
    dragAndDropHandlers
  };
}

