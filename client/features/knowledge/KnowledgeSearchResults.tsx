import { useState } from "react";
import { Link } from "@remix-run/react";
import { FileText, MessageSquare, SearchX, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { DocumentItem, SearchResult } from "~/types/knowledge";
import { formatDate } from "~/utils/dateUtils";
import { searchDocuments } from "~/utils/knowledge/documentSearchUtils";
import { cn } from "~/utils/helpers";
import { DocumentIcon, TagsList } from "./library/LibraryCommonComponents";

interface SearchResultsProps {
  documents: DocumentItem[];
  searchTerm: string;
  onToggleFolder?: (folderId: string) => void;
}

// TODO (NL): Implementovat pokročilé vyhledávání s filtry
// TODO (NL): Přidat našeptávač pro vyhledávání
// TODO (NL): Zlepšit algoritmus pro relevanci výsledků
// TODO (NL): Implementovat cachování vyhledávacích výsledků pro opakované dotazy
// TODO (NL): Přidat podporu pro řazení výsledků podle různých kritérií
// TODO (NL): Přidat podporu pro stránkování výsledků

interface SearchResultCardProps {
  result: SearchResult;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function SearchResultCard({ result, isExpanded, onToggleExpand }: SearchResultCardProps) {
  const { item, matches } = result;

  const itemUrl = item.type === "folder" ? `/knowledge/library/folder/${item.id}` : `/knowledge/library/${item.id}`;

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md overflow-hidden cursor-pointer",
        isExpanded && "ring-2 ring-primary/20",
      )}
      onClick={onToggleExpand}
    >
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start gap-3">
          <div className="pt-1">
            <DocumentIcon type={item.type} />
          </div>

          <div className="flex-1">
            <Link
              to={itemUrl}
              className="hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <CardTitle className="text-base font-medium">
                <span
                  dangerouslySetInnerHTML={{
                    __html: matches.find((m) => m.field === "title")?.highlight || item.title,
                  }}
                />
              </CardTitle>
            </Link>

            {item.description && (
              <p className="text-sm text-muted-foreground mt-1">
                <span
                  dangerouslySetInnerHTML={{
                    __html: matches.find((m) => m.field === "description")?.highlight || item.description,
                  }}
                />
              </p>
            )}

            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {item.type === "folder" ? "Složka" : "Dokument"}
              </Badge>

              {item.type === "document" && (
                <div className="text-xs text-muted-foreground">
                  Autor: {item.author}
                </div>
              )}

              <div className="text-xs text-muted-foreground ml-auto">
                {formatDate(item.lastModified)}
              </div>
            </div>

            <div className="mt-2">
              <TagsList tags={item.tags} />
            </div>
          </div>
        </div>
      </CardHeader>

      {isExpanded && matches.some((m) => m.field === "content" || m.field === "tags") && (
        <CardContent className="bg-muted/30 pt-3 pb-4 px-4 border-t">
          <div className="space-y-3">
            {matches.find((m) => m.field === "content") && (
              <div>
                <div className="flex items-center gap-1 text-xs font-medium mb-1">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Obsah dokumentu</span>
                </div>
                <div className="text-sm p-2 bg-background rounded-md">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: matches.find((m) => m.field === "content")?.highlight || "",
                    }}
                  />
                </div>
              </div>
            )}

            {matches.find((m) => m.field === "tags") && (
              <div>
                <div className="flex items-center gap-1 text-xs font-medium mb-1">
                  <Tag className="h-3.5 w-3.5" />
                  <span>Tagy</span>
                </div>
                <div className="text-sm">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: matches.find((m) => m.field === "tags")?.highlight || "",
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end mt-2">
              <Link
                to={itemUrl}
                className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageSquare className="h-3 w-3" />
                Otevřít {item.type === "folder" ? "složku" : "dokument"}
              </Link>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export function KnowledgeSearchResults({ documents, searchTerm, onToggleFolder }: SearchResultsProps) {
  const [expandedResult, setExpandedResult] = useState<string | null>(null);

  const searchResults = searchDocuments(documents, searchTerm);

  if (searchResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <SearchX className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-1">Žádné výsledky</h3>
        <p className="text-muted-foreground mb-4">
          Pro vyhledávání "{searchTerm}" nebyly nalezeny žádné dokumenty.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Nalezeno {searchResults.length} výsledků pro "{searchTerm}"
      </p>

      <div className="grid grid-cols-1 gap-4">
        {searchResults.map((result) => (
          <SearchResultCard
            key={result.item.id}
            result={result}
            isExpanded={expandedResult === result.item.id}
            onToggleExpand={() => {
              setExpandedResult(expandedResult === result.item.id ? null : result.item.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}
