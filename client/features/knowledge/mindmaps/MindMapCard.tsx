import { MindMap } from "~/types/knowledge";
import { MouseEvent, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Brain, CalendarDays, Copy, Edit, ExternalLink, MoreHorizontal, Share2, Trash2, User } from "lucide-react";
import { Link } from "@remix-run/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { formatDate } from "~/utils/dateUtils";
import { MindMapDeleteConfirmationDialog } from "~/features/knowledge/mindmaps/MindMapDeleteConfirmationDialog";
import {cn, truncateText} from "~/utils/helpers";

export function MindMapCard ({ mindmap, onDelete, onDuplicate, onShare }: {
  mindmap: MindMap,
  onDelete: (id: string) => void,
  onDuplicate: (id: string) => void,
  onShare: (id: string, isPublic: boolean) => void,
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const mapColor = mindmap.thumbnail;

  const handleDelete = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    onDelete(mindmap.id);
  };

  const handleShare = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare(mindmap.id, mindmap.isPublic);
  };

  const handleDuplicate = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDuplicate(mindmap.id);
  };

  return (
      <>
        <Card className="overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
          <div
              className="aspect-video overflow-hidden flex items-center justify-center border-b flex-shrink-0"
              style={{ backgroundColor: `${mapColor}15` }}
          >
            <div
                className="flex items-center justify-center w-24 h-24 rounded-full"
                style={{ backgroundColor: `${mapColor}30` }}
            >
              <div
                  className="w-16 h-16 flex items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: mapColor }}
              >
                <Brain className="h-7 w-7" />
              </div>
            </div>
          </div>

          <CardHeader className="p-4 pb-2 flex-shrink-0">
            <div className="flex justify-between items-start">
              <div className="mr-2">
                <Link to={`/knowledge/mindmaps/${mindmap.id}`} className="hover:text-primary">
                  <CardTitle className="text-base font-medium line-clamp-1">
                    {mindmap.title}
                  </CardTitle>
                </Link>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Akce</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/knowledge/mindmaps/${mindmap.id}`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      <span>Otevřít</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/knowledge/mindmaps/${mindmap.id}`} state={{ editing: true }}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Upravit</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    <span>Sdílet</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDuplicate}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Duplikovat</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={handleDelete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Smazat</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-0 flex-grow flex flex-col">
            <CardDescription className={cn("line-clamp-2 min-h-[2.5rem] mb-3", !mindmap.description && "italic")}>
              {mindmap.description || "Bez popisu"}
            </CardDescription>

            <div className="flex flex-wrap gap-1.5 mb-auto min-h-[1.75rem]">
              {mindmap.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="px-2 py-0 h-5 text-xs">
                    {truncateText(tag, 12)}
                  </Badge>
              ))}
              {mindmap.tags.length > 3 && (
                  <Badge variant="outline" className="px-2 py-0 h-5 text-xs">
                    +{mindmap.tags.length - 3}
                  </Badge>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground mt-4">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate max-w-[150px]">{mindmap.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{formatDate(mindmap.updatedAt)}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-3 border-t text-xs text-muted-foreground mt-auto flex-shrink-0">
            <div className="flex justify-between w-full">
            <span className="flex items-center">
              <Brain className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              {mindmap.nodeCount} {mindmap.nodeCount === 1 ? "uzel" : mindmap.nodeCount > 1 && mindmap.nodeCount < 5 ? "uzly" : "uzlů"}
            </span>
              <span>{mindmap.viewMode === "network" ? "Síť" : mindmap.viewMode === "tree" ? "Strom" : "Free"}</span>
            </div>
          </CardFooter>
        </Card>

        <MindMapDeleteConfirmationDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            title={mindmap.title}
            onConfirm={handleConfirmDelete}
        />
      </>
  );
}
