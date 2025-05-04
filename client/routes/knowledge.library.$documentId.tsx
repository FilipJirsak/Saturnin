import { useEffect, useRef, useState } from "react";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { ActionFunction, LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { requireAuth } from "~/utils/authGuard";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { FileText } from "lucide-react";
import { Input } from "~/components/ui/input";
import { typedJson } from "~/utils/typedJson";
import { deleteMdxDocument, getMdxDocumentBySlug, mdxToDocument, updateMdxDocument } from "~/utils/knowledge/mdxUtils";
import {
  DocumentContent,
  DocumentDetailHeader,
  DocumentFooter,
  DocumentSidebar,
} from "~/features/knowledge/library/LibraryCommonComponents";

type LoaderData = {
  title: string;
  content: string;
  author: string;
  tags: string[];
  relatedIssues: string[];
  isShared: boolean;
  compiledSource: string;
  path: string;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Knihovna - ${data?.title || "Dokument"} (dokument) | Saturnin` },
    { name: "description", content: "Detailní zobrazení dokumentu" },
  ];
};

export const loader: LoaderFunction = async ({ request, params, context }) => {
  await requireAuth({ request, params, context });
  const documentId = params.documentId;
  if (!documentId) throw new Response("Document ID je vyžadováno", { status: 400 });
  const mdx = await getMdxDocumentBySlug(documentId);
  if (!mdx) throw new Response("Dokument nenalezen", { status: 404 });
  const document = {
    ...mdxToDocument(mdx),
    compiledSource: mdx.compiledSource,
    path: `/knowledge/library/${documentId}`,
  };
  return typedJson(document);
};

export const action: ActionFunction = async ({ request, params, context }) => {
  await requireAuth({ request, params, context });
  const documentId = params.documentId!;
  const formData = await request.formData();
  const actionType = formData.get("action");

  if (actionType === "update") {
    const updated = await updateMdxDocument(documentId, {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      author: formData.get("author") as string,
      tags: JSON.parse((formData.get("tags") as string) || "[]"),
      relatedIssues: JSON.parse((formData.get("relatedIssues") as string) || "[]"),
      isShared: formData.get("isShared") === "true",
    });
    if (!updated) {
      return typedJson(
        { success: false, error: "Nepodařilo se aktualizovat dokument" },
        { status: 500 },
      );
    }
    return redirect(`/knowledge/library/${updated.id}`);
  }

  if (actionType === "delete") {
    const ok = await deleteMdxDocument(documentId);
    if (!ok) {
      return typedJson(
        { success: false, error: "Nepodařilo se smazat dokument" },
        { status: 500 },
      );
    }
    return redirect("/knowledge/library");
  }

  return typedJson({ success: false, error: "Neznámá akce" }, { status: 400 });
};

// TODO (NL): Přidat systém pro verzování dokumentů
// TODO (NL): Implementovat real-time spolupráci
// TODO (NL): Přidat kontrolu oprávnění pro editaci/mazání
// TODO (NL): Doplnit funkčnost pro relatedIssues - napojení na Issues API
export default function KnowledgeDocumentDetailPage() {
  const loaderData = useLoaderData<typeof loader>();
  const [editedDocument, setEditedDocument] = useState(loaderData);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const navigation = useNavigation();

  const updateFormRef = useRef<HTMLFormElement>(null);
  const deleteFormRef = useRef<HTMLFormElement>(null);
  const lastActionRef = useRef<"update" | "delete" | null>(null);

  const isSaving = (navigation.state === "submitting" && navigation.formData?.get("action") === "update") ||
    (navigation.state === "loading" && lastActionRef.current === "update");
  const isDeleting = (navigation.state === "submitting" && navigation.formData?.get("action") === "delete") ||
    (navigation.state === "loading" && lastActionRef.current === "delete");

  useEffect(() => {
    setEditedDocument(loaderData);
    setIsEditing(false);
    lastActionRef.current = null;
  }, [loaderData]);

  const handleSave = () => {
    lastActionRef.current = "update";
    updateFormRef.current?.requestSubmit();
    setIsEditing(false);
  };

  const handleDelete = () => {
    lastActionRef.current = "delete";
    deleteFormRef.current?.requestSubmit();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setActiveTab("edit");
  };

  return (
    <div className="space-y-6">
      <DocumentDetailHeader
        document={editedDocument}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onSave={handleSave}
        onDelete={handleDelete}
        isSaving={isSaving}
        isDeleting={isDeleting}
        onEdit={handleEdit}
      />

      <Card>
        <CardHeader className="p-4 pb-0">
          {isEditing
            ? (
              <Input
                value={editedDocument.title}
                onChange={(e) => setEditedDocument({ ...editedDocument, title: e.target.value })}
                className="text-xl font-bold"
              />
            )
            : (
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
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <DocumentSidebar
              document={editedDocument}
              isEditing={isEditing}
              onUpdateDocument={setEditedDocument}
              activeTab={activeTab}
            />
          </div>
        </CardContent>

        <CardFooter className="p-4 border-t text-sm">
          <DocumentFooter commentsCount={0} />
        </CardFooter>
      </Card>

      <Form method="post" id="update-form" ref={updateFormRef} className="hidden">
        <input type="hidden" name="action" value="update" />
        <input type="hidden" name="title" value={editedDocument.title} />
        <input type="hidden" name="content" value={editedDocument.content} />
        <input type="hidden" name="author" value={editedDocument.author || ""} />
        <input type="hidden" name="tags" value={JSON.stringify(editedDocument.tags || [])} />
        <input type="hidden" name="relatedIssues" value={JSON.stringify(editedDocument.relatedIssues || [])} />
        <input type="hidden" name="isShared" value={editedDocument.isShared ? "true" : "false"} />
      </Form>

      <Form method="post" id="delete-form" ref={deleteFormRef} className="hidden">
        <input type="hidden" name="action" value="delete" />
      </Form>
    </div>
  );
}
