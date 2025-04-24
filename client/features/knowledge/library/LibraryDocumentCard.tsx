import { useMemo, useEffect } from "react";
import { Link } from "@remix-run/react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "~/utils/helpers";
import { formatDate } from "~/utils/dateUtils";
import { DocumentItem } from "~/types/knowledge";
import { TagsList, DocumentIcon, DocumentActions } from "./LibraryCommonComponents";

const DOCUMENT_DND_TYPE = "DOCUMENT_ITEM";

interface DragItem {
  id: string;
  type: "document" | "folder";
  index: number;
  title?: string;
}

interface ExtendedDocumentItem extends DocumentItem {
  recentlyMoved?: boolean;
}

interface Props {
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
                                      onDrop,
                                    }: Props) {
  const isFolder = item.type === "folder";
  const hasChildren = isFolder && item.children && item.children.length > 0;
  const itemUrl = isFolder
      ? `/knowledge/library/folder/${item.id}`
      : `/knowledge/library/${item.id}`;

  const [{ isDragging }, dragRef, preview] = useDrag<DragItem, any, { isDragging: boolean }>({
    type: DOCUMENT_DND_TYPE,
    item: () => ({
      id: item.id,
      type: item.type,
      index,
      title: item.title,
    }),
    canDrag: () => isDraggable && item.type === "document",
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const [{ isOver, canDrop }, dropRef] = useDrop<DragItem, any, { isOver: boolean; canDrop: boolean }>({
    accept: DOCUMENT_DND_TYPE,
    canDrop: (dragged) => isFolder && dragged.id !== item.id,
    drop: (dragged) => {
      if (onDrop && dragged.id !== item.id) {
        onDrop(dragged.id, item.id);
      }
      return { id: item.id };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActiveDrop = isOver && canDrop;

  const wrapperRef = useMemo(() => dropRef, [dropRef]);

  return (
      <div
          ref={wrapperRef}
          className={cn(
              "mb-3",
              level > 0 && "pl-6 border-l border-border",
              isActiveDrop && "ring-2 ring-primary-200 bg-primary/10 rounded"
          )}
      >
        <Card
            ref={dragRef}
            className={cn(
                "transition-all hover:shadow-md",
                level > 0 && "border-l-primary",
                isDragging && "opacity-50 border-dashed",
                item.recentlyMoved && "border-primary/40 bg-primary/5 shadow-sm"
            )}
        >
          <CardHeader className={cn("p-4 pb-2", isFolder ? "pt-3" : "pt-4")}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {isFolder && hasChildren && onToggleFolder && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => onToggleFolder(item.id)}
                    >
                      <ChevronRight
                          className={cn(
                              "h-4 w-4 transition-transform",
                              item.isExpanded && "transform rotate-90"
                          )}
                      />
                    </Button>
                )}
                {isFolder && !hasChildren && (
                    <div className="w-6" />
                )}

                <DocumentIcon type={isFolder ? "folder" : "document"} />

                <div>
                  <Link to={itemUrl} className="hover:underline">
                    <CardTitle
                        className={cn(
                            "text-base font-medium",
                            item.recentlyMoved && "text-primary/90"
                        )}
                    >
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
              />
            </div>
          </CardHeader>

          <CardFooter className="p-4 pt-2 text-xs text-muted-foreground flex justify-between">
            <TagsList tags={item.tags} />
            <div>{formatDate(item.lastModified)}</div>
          </CardFooter>
        </Card>

        {isFolder && item.isExpanded && item.children && (
            <div className="mt-2">
              {item.children.map((child, idx) => (
                  <LibraryDocumentCard
                      key={child.id}
                      item={child}
                      level={level + 1}
                      onToggleFolder={onToggleFolder}
                      onEdit={onEdit}
                      isDraggable={isDraggable}
                      index={idx}
                      onDrop={onDrop}
                  />
              ))}
            </div>
        )}
      </div>
  );
}
