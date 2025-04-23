import { useState } from "react";
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
import { NewDocument, NewFolder } from "~/types/knowledge";
import { useToast } from "~/hooks/use-toast";
import { useSearch } from "~/features/knowledge/KnowledgeLayout";
import { KnowledgeSearchResults } from "~/features/knowledge/KnowledgeSearchResults";
import { filterDocumentsBySearchTerm } from "~/utils/knowledge/documentSearchUtils";
import { getAllMdxDocuments } from "~/utils/knowledge/mdxUtils";
import { LibraryDocumentCard } from "~/features/knowledge/library/LibraryDocumentCard";
import { useLibraryDocuments } from "~/hooks/useLibraryDocuments";

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
export default function KnowledgeLibraryPage() {
  const { documents: initialDocuments } = useLoaderData<typeof loader>();
  const [isNewDocumentDialogOpen, setIsNewDocumentDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [currentUser] = useState("Nela Letochová"); // TODO (NL): Získat aktuálního uživatele z API
  const [isLoading, setIsLoading] = useState({
    createDocument: false,
    createFolder: false,
  });
  const { searchTerm, isSearching } = useSearch();
  const { toast } = useToast();

  const {
    documents,
    handleToggleFolder,
    handleDocumentDrop
  } = useLibraryDocuments({
    initialDocuments,
    isSearching
  });

  const filteredDocuments = isSearching
      ? filterDocumentsBySearchTerm(documents, searchTerm)
      : documents;

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
