import { useMemo, useRef, useState } from "react";
import { Link } from "@remix-run/react";
import { useDrag, useDrop } from "react-dnd";
import {
  Card, CardFooter, CardHeader, CardTitle, CardDescription
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  ChevronRight,
} from "lucide-react";
import { cn } from "~/utils/helpers";
import { formatDate } from "~/utils/dateUtils";
import { DocumentItem } from "~/types/knowledge";
import { TagsList, DocumentIcon, DocumentActions } from "./LibraryCommonComponents";

const DOCUMENT_DND_TYPE = 'DOCUMENT_ITEM';

interface DragItem {
  id: string;
  type: "document" | "folder";
  index: number;
}

interface ExtendedDocumentItem extends DocumentItem {
  recentlyMoved?: boolean;
}

interface LibraryDocumentCardProps {
  item: ExtendedDocumentItem;
  level?: number;
  onToggleFolder?: (id: string) => void;
  onEdit?: () => void;
  isDraggable?: boolean;
  index?: number;
  onDrop?: (draggedId: string, targetId: string) => void;
}

export function LibraryDocumentCard({
                                      item,
                                      level = 0,
                                      onToggleFolder,
                                      onEdit,
                                      isDraggable = false,
                                      index = 0,
                                      onDrop
                                    }: LibraryDocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const isFolder = item.type === "folder";
  const itemUrl = isFolder ? `/knowledge/library/folder/${item.id}` : `/knowledge/library/${item.id}`;
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, dragRef] = useDrag({
    type: DOCUMENT_DND_TYPE,
    item: () => ({
      id: item.id,
      type: item.type,
      index
    }),
    canDrag: () => isDraggable && item.type === "document",
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: DOCUMENT_DND_TYPE,
    canDrop: (draggedItem: DragItem) => {
      return isFolder && draggedItem.id !== item.id && item.type === "folder";
    },
    drop: (draggedItem: DragItem) => {
      if (onDrop && draggedItem.id !== item.id) {
        onDrop(draggedItem.id, item.id);
      }
      return { id: item.id };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const combinedRef = useMemo(() => {
    if (isDraggable) {
      return (element: HTMLDivElement | null) => {
        dragRef(element);
        dropRef(element);
      };
    }
    return (_element: HTMLDivElement | null) => {
      // Pro non-draggable elementy není třeba nic dělat
    };
  }, [dragRef, dropRef, isDraggable]);

  const isActive = isOver && canDrop;

  return (
      <div
          className={cn("mb-3", level > 0 && "pl-6 border-l border-border")}
          ref={combinedRef}
      >
        <Card
            className={cn(
                "transition-all",
                "hover:shadow-md",
                level > 0 && "border-l-primary",
                isDraggable && isDragging && "opacity-50 border-dashed",
                isDraggable && isActive && "ring-2 ring-primary bg-primary/5",
                item.recentlyMoved && "border-primary/40 bg-primary/5 shadow-sm"
            )}
        >
          <CardHeader className={cn("p-4 pb-2", isFolder ? "pt-3" : "pt-4")}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {isFolder && onToggleFolder && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => onToggleFolder(item.id)}
                    >
                      <ChevronRight className={cn(
                          "h-4 w-4 transition-transform",
                          item.isExpanded && "transform rotate-90"
                      )} />
                    </Button>
                )}

                <DocumentIcon type={isFolder ? "folder" : "document"} />

                <div>
                  <Link to={itemUrl} className="hover:underline">
                    <CardTitle className={cn("text-base font-medium",
                        item.recentlyMoved && "text-primary/90"
                    )}>
                      {item.title}
                    </CardTitle>
                  </Link>
                  {item.description && (
                      <CardDescription className="text-xs mt-1">
                        {item.description}
                      </CardDescription>
                  )}
                </div>
              </div>

              <DocumentActions
                  item={item}
                  itemUrl={itemUrl}
                  onEdit={onEdit}
                  isDeleting={isDeleting}
              />
            </div>
          </CardHeader>

          <CardFooter className="p-4 pt-2 text-xs text-muted-foreground flex justify-between">
            <TagsList tags={item.tags} />
            <div>
              {formatDate(item.lastModified)}
            </div>
          </CardFooter>
        </Card>

        {isFolder && item.isExpanded && item.children && onToggleFolder && (
            <div className="mt-2">
              {item.children.map((child, childIndex) => (
                  <LibraryDocumentCard
                      key={child.id}
                      item={child}
                      level={level + 1}
                      onToggleFolder={onToggleFolder}
                      onEdit={onEdit}
                      isDraggable={isDraggable}
                      index={childIndex}
                      onDrop={onDrop}
                  />
              ))}
            </div>
        )}
      </div>
  );
}
