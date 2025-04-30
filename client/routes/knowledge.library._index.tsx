import { useState } from "react";
import {ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, redirect} from "@remix-run/node";
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
import {getAllMdxDocuments, createMdxDocument, deleteMdxDocument} from "~/utils/knowledge/mdxUtils";
import { LibraryDocumentCard } from "~/features/knowledge/library/LibraryDocumentCard";
import { useLibraryDocuments } from "~/hooks/useLibraryDocuments";
import { moveDocumentToFolder } from "~/utils/knowledge/mdxUtils";
import {LibraryCustomDragLayer} from "~/features/knowledge/library/LibraryCustomDragLayer";

export const meta: MetaFunction = () => {
  return [
    { title: "Znalosti - Knihovna | Saturnin" },
    { name: "description", content: "Tvá znalostní báze" },
  ];
};

//TODO (NL): Vyčistit!!!
export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuth(args);

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

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
  await requireAuth({ request, params, context });

  const formData = await request.formData();
  const actionType = formData.get("action");

  if (actionType === "delete") {
    const documentId = formData.get("documentId") as string;

    if (!documentId) {
      return new Response("Document ID je vyžadováno", { status: 400 });
    }

    const ok = await deleteMdxDocument(documentId);

    if (!ok) {
      return new Response("Nepodařilo se smazat dokument", { status: 500 });
    }

    return redirect("/knowledge/library");
  }

  if (actionType === "move") {
    const documentId = formData.get("documentId") as string;
    const targetFolderId = formData.get("targetFolderId") as string;
    const keepTags = formData.get("keepTags") === "true";

    if (!documentId) {
      return typedJson({ ok: false, error: "Document ID je vyžadováno" }, { status: 400 });
    }

    if (!targetFolderId) {
      return typedJson({ ok: false, error: "Target Folder ID je vyžadováno" }, { status: 400 });
    }

    // console.log(`Zpracovávám požadavek na přesun dokumentu ${documentId} do složky ${targetFolderId}`);

    try {
      const updatedDoc = await moveDocumentToFolder(documentId, targetFolderId, keepTags);

      if (!updatedDoc) {
        return typedJson({
          ok: false,
          error: "Nepodařilo se přesunout dokument"
        }, { status: 500 });
      }

      return typedJson({
        ok: true,
        message: "Dokument byl úspěšně přesunut",
        document: updatedDoc
      });
    } catch (error) {
      console.error("Chyba při přesouvání dokumentu:", error);
      return typedJson({
        ok: false,
        error: "Došlo k chybě při přesouvání dokumentu"
      }, { status: 500 });
    }
  }

  if (actionType === "create-folder") {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const tag = formData.get("tag") as string;
    const systemTag = formData.get("systemTag") as string || "_system_folder";

    if (!title || !tag) {
      return typedJson({ ok: false, error: "Název a tag složky jsou vyžadovány" }, { status: 400 });
    }

    const folderDocument = {
      title,
      content: `# ${title}\n\n${description || 'Složka pro organizaci dokumentů.'}\n\n_Toto je systémový dokument reprezentující složku. Do této složky můžeš přetahovat další dokumenty v knihovně._`,
      tags: [tag, systemTag],
      author: "Systém",
      summary: description
    };

    try {
      const createdDocument = await createMdxDocument(folderDocument);

      if (!createdDocument) {
        return typedJson({
          ok: false,
          error: "Nepodařilo se vytvořit složku"
        }, { status: 500 });
      }

      return typedJson({
        ok: true,
        message: "Složka byla úspěšně vytvořena",
        folder: {
          id: tag,
          title,
          description,
          documentId: createdDocument.id
        }
      });
    } catch (error) {
      console.error("Chyba při vytváření složky:", error);
      return typedJson({
        ok: false,
        error: "Došlo k chybě při vytváření složky"
      }, { status: 500 });
    }
  }

  return typedJson({ ok: false, error: "Neznámá akce" }, { status: 400 });
};

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
    handleDocumentDropAction,
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
      const createdDocument = await createMdxDocument(newDocument);

      if (createdDocument) {
        toast({
          title: "Dokument vytvořen",
          description: `Dokument "${newDocument.title}" byl úspěšně vytvořen.`,
          variant: "success"
        });

        setIsNewDocumentDialogOpen(false);

      } else {
        toast({
          title: "Chyba při vytváření dokumentu",
          description: "Dokument se nepodařilo vytvořit. Zkus to prosím znovu.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Chyba při vytváření dokumentu:", error);
      toast({
        title: "Chyba při vytváření dokumentu",
        description: "Dokument se nepodařilo vytvořit. Zkus to prosím znovu.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, createDocument: false }));
    }
  };

  const handleCreateFolder = async (newFolder: NewFolder) => {
    setIsLoading(prev => ({ ...prev, createFolder: true }));

    try {
      const formattedTag = newFolder.tag.toLowerCase().replace(/\s+/g, '-');

      const folderData = {
        title: newFolder.title,
        content: `# ${newFolder.title}\n\n${newFolder.description || 'Složka pro organizaci dokumentů.'}\n\n_Toto je systémový dokument reprezentující složku._`,
        author: "Systém",
        tags: [formattedTag, "_system_folder"]
      };

      const response = await fetch("/api/knowledge/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(folderData)
      });

      if (response.ok) {
        const data = await response.json();

        if (data.ok) {
          toast({
            title: "Složka vytvořena",
            description: `Složka "${newFolder.title}" byla úspěšně vytvořena.`,
            variant: "success"
          });

          setIsNewFolderDialogOpen(false);
          window.location.reload();
        } else {
          toast({
            title: "Chyba při vytváření složky",
            description: data.error || "Složku se nepodařilo vytvořit. Zkus to prosím znovu.",
            variant: "destructive"
          });
        }
      } else {
        try {
          const errorData = await response.json();
          toast({
            title: "Chyba při vytváření složky",
            description: errorData.error || `Server vrátil chybu (${response.status}). Zkus to prosím znovu.`,
            variant: "destructive"
          });
        } catch (e) {
          toast({
            title: "Chyba při vytváření složky",
            description: `Server vrátil chybu (${response.status}). Zkus to prosím znovu.`,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Chyba při vytváření složky:", error);
      toast({
        title: "Chyba při vytváření složky",
        description: "Složku se nepodařilo vytvořit. Zkus to prosím znovu.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, createFolder: false }));
    }
  };

  return (
      <div className="space-y-6">
        <LibraryCustomDragLayer />

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
                      onDrop={handleDocumentDropAction}
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
