import { useState, useEffect } from "react";
import { useParams, useNavigate, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { requireAuth } from "~/utils/authGuard";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { FileText } from "lucide-react";
import { Input } from "~/components/ui/input";
import { typedJson } from "~/utils/typedJson";
import { getMdxDocumentBySlug, mdxToDocument } from "~/utils/knowledge/mdxUtils";
import {
  DocumentDetailHeader,
  DocumentContent,
  DocumentSidebar,
  DocumentFooter
} from "~/features/knowledge/library/LibraryCommonComponents";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  await requireAuth({ request, params } as LoaderFunctionArgs);

  const documentId = params.documentId;
  if (!documentId) {
    throw new Response("Document ID je vyžadováno", { status: 400 });
  }

  try {
    const mdxDocument = await getMdxDocumentBySlug(documentId);

    if (!mdxDocument) {
      throw new Response("Dokument nenalezen", { status: 404 });
    }

    const document: Document = {
      ...mdxToDocument(mdxDocument),
      compiledSource: mdxDocument.compiledSource,
      path: `/knowledge/library/${documentId}`
    };

    return typedJson(document);
  } catch (error) {
    console.error(`Chyba při načítání dokumentu ${documentId}:`, error);
    throw new Response(
        error instanceof Response ? error.statusText : "Došlo k chybě při načítání dokumentu",
        { status: error instanceof Response ? error.status : 500 }
    );
  }
};

// TODO (NL): Implementovat ukládání změn v dokumentu do backendu
// TODO (NL): Přidat systém pro verzování dokumentů
// TODO (NL): Implementovat real-time spolupráci
// TODO (NL): Přidat kontrolu oprávnění pro editaci/mazání
// TODO (NL): Doplnit funkčnost pro relatedIssues - napojení na Issues API
export default function KnowledgeDocumentDetailPage() {
  const document = useLoaderData<typeof loader>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedDocument, setEditedDocument] = useState(document);
  const { documentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setEditedDocument(document);
  }, [document]);

  const handleSave = async () => {
    // TODO (NL): Implementovat ukládání změn zpět do MDX souboru
    console.log("Ukládám dokument:", editedDocument);
    setIsEditing(false);
  };

  const handleDelete = () => {
    // TODO (NL): Implementovat mazání dokumentu
    console.log("Mažu dokument:", document.id);
    navigate("/knowledge/library");
  };

  return (
      <div className="space-y-6">
        <DocumentDetailHeader
            document={editedDocument}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onSave={handleSave}
            onUpdateDocument={setEditedDocument}
            onDelete={handleDelete}
        />

        <Card>
          <CardHeader className="p-4 pb-0">
            {isEditing ? (
                <Input
                    value={editedDocument.title}
                    onChange={(e) =>
                        setEditedDocument({ ...editedDocument, title: e.target.value })
                    }
                    className="text-xl font-bold"
                />
            ) : (
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  {editedDocument.title}
                </CardTitle>
            )}
          </CardHeader>

          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-8">
              <DocumentContent
                  document={editedDocument}
                  isEditing={isEditing}
                  onUpdateDocument={setEditedDocument}
              />

              <DocumentSidebar
                  document={editedDocument}
                  isEditing={isEditing}
                  onUpdateDocument={setEditedDocument}
              />
            </div>
          </CardContent>

          <CardFooter className="p-4 border-t text-sm">
            <DocumentFooter commentsCount={0} />
          </CardFooter>
        </Card>
      </div>
  );
}

