import { useState } from "react";
import { useNavigate, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { requireAuth } from "~/utils/authGuard";
import { Button } from "~/components/ui/button";
import { ChevronLeft, FolderOpen, FilePlus } from "lucide-react";
import { typedJson } from "~/utils/typedJson";
import { EmptyState} from "~/features/knowledge/library/LibraryCommonComponents";
import {getFolderWithDocuments} from "~/utils/knowledge/libraryUtils";
import {LibraryCreateDocumentSidebar} from "~/features/knowledge/library/LibraryCreateDocumentSidebar";
import {DocumentItem, NewDocument} from "~/types/knowledge";
import {LibraryDocumentCard} from "~/features/knowledge/library/LibraryDocumentCard";

export const loader = async ({params, request}: LoaderFunctionArgs) => {
  await requireAuth({request, params} as LoaderFunctionArgs);

  const folderId = params.folderId;
  if (!folderId) {
    throw new Response("Folder ID je vyžadováno", {status: 400});
  }

  try {
    const tag = folderId.replace('folder-', '');
    const folder = await getFolderWithDocuments(tag);

    return typedJson({folder});
  } catch (error) {
    console.error(`Chyba při načítání složky ${folderId}:`, error);
    throw new Response("Došlo k chybě při načítání složky", {status: 500});
  }
};

// TODO (NL): Implementovat ukládání nových dokumentů ve složce
// TODO (NL): Přidat možnost přejmenování a úpravy vlastností složky
// TODO (NL): Implementovat správu oprávnění pro složku
// TODO (NL): Doplnit drag & drop v rámci složky
export default function KnowledgeFolderDetailPage() {
  const {folder} = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const [isNewDocumentDialogOpen, setIsNewDocumentDialogOpen] = useState(false);
  const [currentUser] = useState("Nela Letochová"); // TODO (NL): Získat aktuálního uživatele z autentizace

  //TODO (NL): Implementovat ukládání nového dokumentu
  const handleCreateDocument = async (newDocument: NewDocument) => {
    console.log("Vytvářím nový dokument:", newDocument);

    try {
      console.log("Dokument byl vytvořen (dummy)");

      navigate(`/knowledge/library/folder/${folder.id}`);
    } catch (error) {
      console.error("Chyba při vytváření dokumentu:", error);
    }
  };

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/knowledge/library")}
              className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4"/>
            <span>Zpět do knihovny</span>
          </Button>

          <Button
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setIsNewDocumentDialogOpen(true)}
          >
            <FilePlus className="h-4 w-4"/>
            <span>Nový dokument</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <FolderOpen className="h-6 w-6 text-amber-500"/>
          <h2 className="text-xl font-semibold">{folder.title}</h2>
        </div>

        {folder.description && (
            <p className="text-muted-foreground mb-6">{folder.description}</p>
        )}

        <div className="grid grid-cols-1 gap-4">
          {folder.documents.length > 0 ? (
              folder.documents.map((document: DocumentItem) => (
                  <LibraryDocumentCard key={document.id} item={document} />
              ))
          ) : (
              <EmptyState
                  message={`Složka ${folder.title} je prázdná`}
                  description="Vytvořte nový dokument pomocí tlačítka 'Nový dokument' výše."
                  onCreateNew={() => setIsNewDocumentDialogOpen(true)}
              />
          )}
        </div>

        <LibraryCreateDocumentSidebar
            isOpen={isNewDocumentDialogOpen}
            onClose={() => setIsNewDocumentDialogOpen(false)}
            onSave={handleCreateDocument}
            currentUser={currentUser}
            initialTag={folder.title.toLowerCase()}
        />
      </div>
  );
}
