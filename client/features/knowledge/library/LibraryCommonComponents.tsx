import { useState, KeyboardEvent } from "react";
import { Link } from "@remix-run/react";
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
  FilePlus
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
                                  onEdit
                                }: {
  item: DocumentItemBase,
  itemUrl: string,
  onDelete?: () => void,
  onEdit?: () => void
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    //TODO (NL): Implementovat smazání dokumentu
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete && onDelete();
    setShowDeleteConfirm(false);
  };

  return (
      <div className="flex items-center gap-2">
        {item.isShared && (
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              <Share2 className="h-3 w-3 mr-1" /> Sdíleno
            </Badge>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Akce</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={itemUrl} className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                <span>Zobrazit</span>
              </Link>
            </DropdownMenuItem>

            {onEdit ? (
                <DropdownMenuItem onClick={onEdit} className="flex items-center cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Upravit</span>
                </DropdownMenuItem>
            ) : (
                <DropdownMenuItem asChild>
                  <Link to={`${itemUrl}/edit`} className="flex items-center">
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Upravit</span>
                  </Link>
                </DropdownMenuItem>
            )}

            <DropdownMenuItem>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Sdílet</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="mr-2 h-4 w-4" />
              <span>Duplikovat</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDelete()}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Smazat</span>
            </DropdownMenuItem>

            {/*TODO (NL): Upravit!!!*/}
            {showDeleteConfirm && (
                <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Opravdu chcete smazat tento dokument?</AlertDialogTitle>
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
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
  );
}

export function DocumentIcon({ type }: { type: "document" | "folder" }) {
  if (type === "folder") {
    return <FolderOpen className="h-5 w-5 text-amber-500" />;
  }
  return <FileText className="h-5 w-5 text-blue-500" />;
}
export function DocumentDetailHeader({
                                       document,
                                       isEditing,
                                       setIsEditing,
                                       onSave,
                                       onUpdateDocument,
                                       onDelete,
                                       backUrl = "/knowledge/library"
                                     }: DocumentDetailProps & {
  backUrl?: string;
  onDelete?: () => void;
}) {
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
                >
                  <X className="h-4 w-4" />
                  <span>Zrušit</span>
                </Button>
                <Button onClick={onSave} className="gap-1">
                  <Save className="h-4 w-4" />
                  <span>Uložit změny</span>
                </Button>
              </>
          ) : (
              <>
                <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="gap-1"
                >
                  <Edit className="h-4 w-4" />
                  <span>Upravit</span>
                </Button>

                <DocumentActions
                    item={document}
                    itemUrl={document.path || `/knowledge/library/${document.id}`}
                    onDelete={onDelete}
                    onEdit={() => setIsEditing(true)}
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
                                  onUpdateDocument
                                }: Pick<DocumentDetailProps, "document" | "isEditing" | "onUpdateDocument">) {
  const [activeTab, setActiveTab] = useState("preview");

  return (
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>Náhled</span>
            </TabsTrigger>
            {isEditing && (
                <TabsTrigger value="edit" className="flex items-center gap-1">
                  <Edit className="h-4 w-4" />
                  <span>Editace</span>
                </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="preview" className="mt-0">
            <MdxRenderer
                content={document.content}
                compiledSource={document.compiledSource}
            />
          </TabsContent>

          {isEditing && (
              <TabsContent value="edit" className="mt-0">
                <Textarea
                    className="min-h-96 font-mono text-sm"
                    value={document.content}
                    onChange={(e) => {
                      const updatedDocument = { ...document, content: e.target.value };
                      onUpdateDocument(updatedDocument);
                    }}
                />
              </TabsContent>
          )}
        </Tabs>
      </div>
  );
}

export function DocumentSidebar({
                                  document,
                                  isEditing,
                                  onUpdateDocument
                                }: Pick<DocumentDetailProps, "document" | "isEditing" | "onUpdateDocument">) {
  const [newTag, setNewTag] = useState("");

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
              <span>{formatDate(document.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Aktualizováno:</span>
              <span>{formatDate(document.lastModified)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Autor:</span>
              <span>{document.author}</span>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 rounded-md p-4 space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span>Tagy</span>
          </h3>
          <div>
            <TagsList
                tags={document.tags}
                onRemoveTag={isEditing ? handleRemoveTag : undefined}
                isEditable={isEditing}
            />

            {isEditing && (
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

                        {isEditing && (
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

            {isEditing && (
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
//TODO (NL): Přidat funkcionalitu na kopírování odkazů
export function DocumentFooter({
                                 commentsCount = 0
                               }: {
  commentsCount?: number
}) {
  return (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span>Komentáře ({commentsCount})</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-xs">
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
