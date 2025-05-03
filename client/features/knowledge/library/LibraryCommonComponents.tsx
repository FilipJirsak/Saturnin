import {useState, KeyboardEvent, useRef} from "react";
import {Form, Link} from "@remix-run/react";
import {
  Card
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Share2,
  Copy,
  Eye,
  FileText,
  FolderOpen,
  X,
  Plus,
  MessageSquare,
  LinkIcon,
  Tag,
  Link2,
  Clock,
  ChevronLeft,
  Save,
  FilePlus, Loader2
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { MdxRenderer } from "~/components/mdx/MdxRenderer";
import { formatDate } from "~/utils/dateUtils";
import {DocumentDetailProps, DocumentItemBase} from "~/types/knowledge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import { useToast } from "~/hooks/use-toast";

export function TagsList({
                           tags,
                           onRemoveTag,
                           isEditable = false
                         }: {
  tags?: string[],
  onRemoveTag?: (tag: string) => void,
  isEditable?: boolean
}) {
  if (!tags || tags.length === 0) return null;

  return (
      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
            <Badge
                key={tag}
                variant="secondary"
                className="px-2 py-0 h-5 flex items-center gap-1"
            >
              {tag}
              {isEditable && onRemoveTag && (
                  <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => onRemoveTag(tag)}
                  />
              )}
            </Badge>
        ))}
      </div>
  );
}

export function DocumentActions({
                                  item,
                                  itemUrl,
                                  onDelete,
                                  onEdit,
                                  isDeleting = false
                                }: {
  item: DocumentItemBase,
  itemUrl: string,
  onDelete?: () => void,
  onEdit?: () => void,
  isDeleting?: boolean
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteFormRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete();
    } else {
      deleteFormRef.current?.requestSubmit();
    }
    setShowDeleteConfirm(false);
  };

  const handleShare = () => {
    toast({
      title: "Sdílení dokumentu",
      description: "Funkce sdílení bude brzy dostupná",
      variant: "default"
    });
  };

  const isFolder = item.tags && item.tags.includes('_system_folder');

  return (
      <div className="flex items-center gap-2">
        {item.isShared && (
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              <Share2 className="h-3 w-3 mr-1" /> Sdíleno
            </Badge>
        )}

        {!isFolder && <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4"/>
              <span className="sr-only">Akce</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4"/>
              <span>Sdílet</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Copy className="mr-2 h-4 w-4"/>
              <span>Duplikovat</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleDeleteClick}
            >
              {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    <span>Mazání...</span>
                  </>
              ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4"/>
                    <span>Smazat</span>
                  </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>}

        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Opravdu chceš smazat tento dokument?</AlertDialogTitle>
              <AlertDialogDescription>
                Tato akce je nevratná a dokument bude trvale odstraněn.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Zrušit</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive">
                Smazat
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Form method="post" className="hidden" ref={deleteFormRef}>
          <input type="hidden" name="documentId" value={item.id} />
          <input type="hidden" name="action" value="delete" />
        </Form>
      </div>
  );
}

interface ExtendedDocumentDetailHeaderProps extends Partial<DocumentDetailProps> {
  backUrl?: string;
  onDelete?: () => void;
  isSaving?: boolean;
  isDeleting?: boolean;
}


export function DocumentIcon({ type }: { type: "document" | "folder" }) {
  if (type === "folder") {
    return <FolderOpen className="h-5 w-5 text-amber-500" />;
  }
  return <FileText className="h-5 w-5 text-blue-500" />;
}

interface ExtendedDocumentDetailHeaderProps extends Partial<DocumentDetailProps> {
  backUrl?: string;
  onDelete?: () => void;
  isSaving?: boolean;
  isDeleting?: boolean;
  onEdit?: () => void;
}

export function DocumentDetailHeader({
                                       document,
                                       isEditing,
                                       setIsEditing,
                                       onSave,
                                       onUpdateDocument,
                                       onDelete,
                                       onEdit,
                                       backUrl = "/knowledge/library",
                                       isSaving = false,
                                       isDeleting = false
                                     }: ExtendedDocumentDetailHeaderProps) {
  if (!document || !setIsEditing) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      setIsEditing(true);
    }
  };

  return (
      <div className="flex items-center justify-between">
        <Button
            variant="ghost"
            size="sm"
            asChild
            className="flex items-center gap-1"
        >
          <Link to={backUrl}>
            <ChevronLeft className="h-4 w-4" />
            <span>Zpět do knihovny</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {isEditing ? (
              <>
                <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="gap-1"
                    disabled={isSaving}
                >
                  <X className="h-4 w-4" />
                  <span>Zrušit</span>
                </Button>
                <Button
                    onClick={onSave}
                    className="gap-1"
                    disabled={isSaving}
                >
                  {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        <span>Ukládání...</span>
                      </>
                  ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Uložit změny</span>
                      </>
                  )}
                </Button>
              </>
          ) : (
              <>
                <Button
                    variant="outline"
                    onClick={handleEdit}
                    className="gap-1"
                    disabled={isDeleting}
                >
                  <Edit className="h-4 w-4" />
                  <span>Upravit</span>
                </Button>

                <DocumentActions
                    item={document as DocumentItemBase}
                    itemUrl={document.path || `/knowledge/library/${document.id}`}
                    onEdit={handleEdit}
                    onDelete={onDelete}
                    isDeleting={isDeleting}
                />
              </>
          )}
        </div>
      </div>
  );
}

export function DocumentContent({
                                  document,
                                  isEditing,
                                  onUpdateDocument,
                                  activeTab,
                                  setActiveTab
                                }: Pick<DocumentDetailProps, "document" | "isEditing" | "onUpdateDocument"> & {
  activeTab: "edit" | "preview",
  setActiveTab: (tab: "edit" | "preview") => void
}) {
  if (!isEditing) {
    return (
        <div className="flex-1">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>Náhled dokumentu</span>
          </div>

          <MdxRenderer
              content={document.content}
              compiledSource={document.compiledSource}
          />
        </div>
    );
  }

  return (
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "preview")}>
          <TabsList className="mb-4">
            <TabsTrigger value="edit" className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              <span>Editace</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>Náhled</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-0">
            <Textarea
                className="min-h-96 font-mono text-sm"
                value={document.content}
                onChange={(e) => {
                  const updatedDocument = { ...document, content: e.target.value };
                  onUpdateDocument(updatedDocument);
                }}
                autoFocus
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <MdxRenderer
                content={document.content}
                compiledSource={document.compiledSource}
            />
          </TabsContent>
        </Tabs>
      </div>
  );
}

export function DocumentSidebar({
                                  document,
                                  isEditing,
                                  onUpdateDocument,
                                  activeTab
                                }: Pick<DocumentDetailProps, "document" | "isEditing" | "onUpdateDocument"> & {
  activeTab: "edit" | "preview"
}) {
  const [newTag, setNewTag] = useState("");

  const canEdit = isEditing && activeTab === "edit";

  function handleAddTag() {
    if (newTag.trim() && !document.tags.includes(newTag.trim())) {
      const updatedDocument = {
        ...document,
        tags: [...document.tags, newTag.trim()],
      };
      onUpdateDocument(updatedDocument);
      setNewTag("");
    }
  }

  function handleRemoveTag(tagToRemove: string) {
    const updatedDocument = {
      ...document,
      tags: document.tags.filter((tag: string) => tag !== tagToRemove),
    };
    onUpdateDocument(updatedDocument);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  }

  function handleRemoveIssue(issueCode: string) {
    const updatedDocument = {
      ...document,
      relatedIssues: document.relatedIssues?.filter((code: string) => code !== issueCode) || []
    };
    onUpdateDocument(updatedDocument);
  }

  return (
      <div className="lg:w-72 space-y-6">
        <div className="bg-muted/30 rounded-md p-4 space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Informace</span>
          </h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vytvořeno:</span>
              <span>{formatDate(document.createdAt || 'Neznámé datum')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Aktualizováno:</span>
              <span>{formatDate(document.lastModified || 'Neznámé datum')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Autor:</span>
              <span>{document.author}</span>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 rounded-md p-4 space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground"/>
            <span>Tagy</span>
          </h3>
          <div>
            {document.tags && document.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {document.tags.map(tag => (
                      <Badge
                          key={tag}
                          variant="secondary"
                          className="px-2 py-0 h-5 flex items-center gap-1"
                      >
                        {tag}
                        {canEdit && (
                            <X
                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                onClick={() => handleRemoveTag(tag)}
                            />
                        )}
                      </Badge>
                  ))}
                </div>
            ) : (
                <div className="text-sm text-muted-foreground text-center py-2">
                  Žádné tagy
                </div>
            )}

            {canEdit && (
                <div className="flex gap-2 mt-3">
                  <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Nový tag"
                      className="h-8 text-xs"
                  />
                  <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs px-2"
                      onClick={handleAddTag}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Přidat
                  </Button>
                </div>
            )}
          </div>
        </div>

        <div className="bg-muted/30 rounded-md p-4 space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Link2 className="h-4 w-4 text-muted-foreground" />
            <span>Propojené issues</span>
          </h3>
          <div>
            {document.relatedIssues && document.relatedIssues.length > 0 ? (
                <div className="space-y-2">
                  {document.relatedIssues.map((issueCode: string) => (
                      <div key={issueCode} className="flex items-center justify-between text-sm">
                        <Link
                            to={`/projects/${issueCode.split('-')[0]}/issue/${issueCode}`}
                            className="flex items-center gap-1 hover:text-primary"
                        >
                          <span className="font-mono">{issueCode}</span>
                        </Link>

                        {canEdit && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => handleRemoveIssue(issueCode)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                        )}
                      </div>
                  ))}
                </div>
            ) : (
                <div className="text-sm text-muted-foreground text-center py-2">
                  Žádné propojené issues
                </div>
            )}

            {canEdit && (
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Plus className="h-3 w-3 mr-1" />
                  Propojit issue
                </Button>
            )}
          </div>
        </div>
      </div>
  );
}

//TODO (NL): Přidat počítadlo komentářů
export function DocumentFooter({
                                 commentsCount = 0
                               }: {
  commentsCount?: number
}) {
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Odkaz zkopírován",
      description: "Odkaz byl uložen do schránky",
      variant: "success"
    });
  };

  return (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span>Komentáře ({commentsCount})</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={handleCopyLink}
          >
            <LinkIcon className="h-3 w-3 mr-1" />
            Kopírovat odkaz
          </Button>
        </div>
      </div>
  );
}

export function EmptyState({
                             message = "Žádné dokumenty",
                             description = "Zatím nebyly přidány žádné dokumenty. Začni vytvořením nového dokumentu.",
                             buttonLabel = "Vytvořit dokument",
                             onCreateNew
                           }: {
  message?: string,
  description?: string,
  buttonLabel?: string,
  onCreateNew: () => void
}) {
  return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <FileText className="h-12 w-12 text-muted-foreground/50" />
          <div>
            <h3 className="text-lg font-semibold">{message}</h3>
            <p className="text-muted-foreground mt-1">
              {description}
            </p>
          </div>
          <Button className="mt-2" onClick={onCreateNew}>
            <FilePlus className="h-4 w-4 mr-2" />
            {buttonLabel}
          </Button>
        </div>
      </Card>
  );
}
