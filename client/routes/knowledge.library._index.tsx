import { useState, useEffect } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/utils/authGuard";
import { Button } from "~/components/ui/button";
import { FilePlus, FolderPlus, Book, SearchX } from "lucide-react";
import { typedJson } from "~/utils/typedJson";
import { organizeDocumentsIntoFolders } from "~/utils/knowledge/libraryUtils";
import { EmptyState } from "~/features/knowledge/library/LibraryCommonComponents";
import { LibraryCreateDocumentSidebar } from "~/features/knowledge/library/LibraryCreateDocumentSidebar";
import { LibraryCreateFolderSidebar } from "~/features/knowledge/library/LibraryCreateFolderSidebar";
import { DocumentItem, NewDocument, NewFolder } from "~/types/knowledge";
import {useToast} from "~/hooks/use-toast";
import {useSearch} from "~/features/knowledge/KnowledgeLayout";
import {KnowledgeSearchResults} from "~/features/knowledge/KnowledgeSearchResults";
import {filterDocumentsBySearchTerm} from "~/utils/knowledge/documentSearchUtils";
import {getAllMdxDocuments} from "~/utils/knowledge/mdxUtils";
import {LibraryDocumentCard} from "~/features/knowledge/library/LibraryDocumentCard";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAuth({ request } as LoaderFunctionArgs);

  try {
    const mdxDocuments = await getAllMdxDocuments();

    return typedJson({
      documents: organizeDocumentsIntoFolders(mdxDocuments)
    });
  } catch (error) {
    console.error("Chyba při načítání dokumentů:", error);
    return typedJson({ documents: [], error: "Nepodařilo se načíst dokumenty" });
  }
};

// TODO (NL): Implementovat skutečné ukládání dokumentů a složek do backend API
// TODO (NL): Přidat možnost hromadných operací (výběr více dokumentů)
// TODO (NL): Implementovat lazy loading pro velké množství dokumentů
// TODO (NL): Přidat filtrování dokumentů podle dalších kritérií (autor, datum, atd.)
// TODO (NL): Přesunout funkcionalitu do samostatného hooku pro lepší přehlednost
export default function KnowledgeLibraryPage() {
  const { documents: initialDocuments } = useLoaderData<typeof loader>();
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [isNewDocumentDialogOpen, setIsNewDocumentDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [currentUser] = useState("Nela Letochová"); // TODO (NL): Získat aktuálního uživatele z API
  const [isLoading, setIsLoading] = useState({
    createDocument: false,
    createFolder: false,
  });
  const { searchTerm, isSearching } = useSearch();
  const {toast} = useToast();

  const filteredDocuments = isSearching
      ? filterDocumentsBySearchTerm(documents, searchTerm)
      : documents;

  useEffect(() => {
    if (!isSearching) {
      setDocuments(prevDocs =>
          prevDocs.map(doc => {
            if (doc.type === "folder") {
              return { ...doc, isExpanded: false };
            }
            return doc;
          })
      );
    }
  }, [isSearching]);

  const handleToggleFolder = (folderId: string) => {
    setDocuments(prevDocs =>
        prevDocs.map(doc => {
          if (doc.id === folderId && doc.type === "folder") {
            return { ...doc, isExpanded: !doc.isExpanded };
          }

          if (doc.type === "folder" && doc.children) {
            const updatedChildren = doc.children.map(child =>
                child.id === folderId && child.type === "folder"
                    ? { ...child, isExpanded: !child.isExpanded }
                    : child
            );

            return { ...doc, children: updatedChildren };
          }

          return doc;
        })
    );
  };

  const handleCreateDocument = async (newDocument: NewDocument) => {
    setIsLoading(prev => ({ ...prev, createDocument: true }));

    try {
      console.log("Vytvářím nový dokument:", newDocument);
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Dokument vytvořen",
        description: `Dokument "${newDocument.title}" byl úspěšně vytvořen.`,
        variant: "success"
      });

      setIsNewDocumentDialogOpen(false);
    } catch (error) {
      console.error("Chyba při vytváření dokumentu:", error);
      toast({
        title: "Chyba při vytváření dokumentu",
        description: "Dokument se nepodařilo vytvořit. Zkuste to prosím znovu.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, createDocument: false }));
    }
  };

  const handleCreateFolder = async (newFolder: NewFolder) => {
    setIsLoading(prev => ({ ...prev, createFolder: true }));

    try {
      // TODO (NL): Implementovat skutečné ukládání složky na server
      console.log("Vytvářím novou složku:", newFolder);
      await new Promise(resolve => setTimeout(resolve, 800));

      toast({
        title: "Složka vytvořena",
        description: `Složka "${newFolder.title}" byla úspěšně vytvořena.`,
        variant: "success"
      });

      setIsNewFolderDialogOpen(false);
    } catch (error) {
      console.error("Chyba při vytváření složky:", error);
      toast({
        title: "Chyba při vytváření složky",
        description: "Složku se nepodařilo vytvořit. Zkuste to prosím znovu.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, createFolder: false }));
    }
  };

  const handleDocumentDrop = (draggedId: string, targetId: string) => {
    let draggedDocument: DocumentItem | null = null;
    let draggedParentId: string | null = null;

    const findDocument = (items: DocumentItem[], docId: string, parentId: string | null = null): [DocumentItem | null, string | null] => {
      for (const item of items) {
        if (item.id === docId) {
          return [{ ...item }, parentId];
        }

        if (item.type === "folder" && item.children) {
          const [found, foundParentId] = findDocument(item.children, docId, item.id);
          if (found) return [found, foundParentId];
        }
      }

      return [null, null];
    };

    [draggedDocument, draggedParentId] = findDocument(documents, draggedId);

    if (!draggedDocument) {
      console.error("Přesouvaný dokument nebyl nalezen");
      return;
    }

    const findFolder = (items: DocumentItem[], folderId: string): DocumentItem | null => {
      for (const item of items) {
        if (item.id === folderId) {
          return item;
        }

        if (item.type === "folder" && item.children) {
          const found = findFolder(item.children, folderId);
          if (found) return found;
        }
      }

      return null;
    };

    const targetFolder = findFolder(documents, targetId);

    if (!targetFolder || targetFolder.type !== "folder") {
      console.error("Cílová složka nebyla nalezena nebo není složkou");
      return;
    }

    const processItems = (items: DocumentItem[]): DocumentItem[] => {
      const newItems = items.filter(item => item.id !== draggedId).map(item => {
        if (item.type === "folder" && item.children) {
          return {
            ...item,
            children: processItems(item.children),
            isExpanded: item.id === targetId ? true : item.isExpanded
          };
        }
        return item;
      });

      return newItems.map(item => {
        if (item.id === targetId && item.type === "folder") {
          return {
            ...item,
            children: [...item.children, { ...draggedDocument!, recentlyMoved: true }],
            isExpanded: true
          };
        }
        return item;
      });
    };

    const updatedDocuments = processItems(documents);

    setDocuments(updatedDocuments);

    setTimeout(() => {
      setDocuments(currentDocs => {
        const removeHighlight = (items: DocumentItem[]): DocumentItem[] => {
          return items.map(item => {
            const newItem = { ...item };
            if ('recentlyMoved' in newItem) {
              delete newItem.recentlyMoved;
            }

            if (newItem.type === "folder" && newItem.children) {
              newItem.children = removeHighlight(newItem.children);
            }

            return newItem;
          });
        };

        return removeHighlight(currentDocs);
      });
    }, 2000);

    toast({
      title: "Dokument přesunut",
      description: `Dokument "${draggedDocument.title}" byl přesunut do složky "${targetFolder.title}".`,
      variant: "success"
    });
  };

  return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" />
              Knihovna dokumentů
              {isSearching && filteredDocuments.length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                {filteredDocuments.length} výsledků
              </span>
              )}
            </h2>

            <div className="flex gap-2">
              <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setIsNewFolderDialogOpen(true)}
              >
                <FolderPlus className="h-4 w-4" />
                <span>Nová složka</span>
              </Button>
              <Button
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setIsNewDocumentDialogOpen(true)}
              >
                <FilePlus className="h-4 w-4" />
                <span>Nový dokument</span>
              </Button>
            </div>
          </div>

          {isSearching && filteredDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <SearchX className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-1">Žádné výsledky</h3>
                <p className="text-muted-foreground mb-4">
                  Pro vyhledávání "{searchTerm}" nebyly nalezeny žádné dokumenty.
                </p>
              </div>
          ) : isSearching ? (
              <KnowledgeSearchResults
                  documents={filteredDocuments}
                  searchTerm={searchTerm}
                  onToggleFolder={handleToggleFolder}
              />
          ) : documents.length === 0 ? (
              <EmptyState onCreateNew={() => setIsNewDocumentDialogOpen(true)} />
          ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredDocuments.map((doc, index) => (
                    <LibraryDocumentCard
                        key={doc.id}
                        item={doc}
                        index={index}
                        onToggleFolder={handleToggleFolder}
                        isDraggable={true}
                        onDrop={handleDocumentDrop}
                    />
                ))}
              </div>
          )}

          <LibraryCreateDocumentSidebar
              isOpen={isNewDocumentDialogOpen}
              onClose={() => setIsNewDocumentDialogOpen(false)}
              onSave={handleCreateDocument}
              currentUser={currentUser}
              isLoading={isLoading.createDocument}
          />
          <LibraryCreateFolderSidebar
              isOpen={isNewFolderDialogOpen}
              onClose={() => setIsNewFolderDialogOpen(false)}
              onSave={handleCreateFolder}
              isLoading={isLoading.createFolder}
          />
        </div>
  );
}
