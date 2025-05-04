import { MouseEvent, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Check, Edit, Palette, SquareAsterisk, Trash, X } from "lucide-react";
import { NODE_COLORS } from "~/lib/constants";

interface NodePanelProps {
  selectedNode: any;
  newNodeName: string;
  onNewNameChange: (v: string) => void;
  editingNodeName: boolean;
  onStartEdit: () => void;
  onFinishEdit: () => void;
  onCancelEdit: () => void;
  colorPopoverOpen: boolean;
  onToggleColor: () => void;
  onChangeColor: (color: string) => void;
  shapePopoverOpen: boolean;
  onToggleShape: () => void;
  onChangeShape: (shape: "rectangle" | "ellipse" | "diamond") => void;
  onDeleteNode: () => void;
}

export function NodePanel({
  selectedNode,
  newNodeName,
  onNewNameChange,
  editingNodeName,
  onStartEdit,
  onFinishEdit,
  onCancelEdit,
  colorPopoverOpen,
  onToggleColor,
  onChangeColor,
  shapePopoverOpen,
  onToggleShape,
  onChangeShape,
  onDeleteNode,
}: NodePanelProps) {
  const stopPropagation = useCallback((e: MouseEvent) => e.stopPropagation(), []);

  return (
    <div className="p-2 border-t bg-muted/10">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium">Vybraný uzel:</span>
        {editingNodeName
          ? (
            <div className="flex items-center gap-1">
              <Input
                value={newNodeName}
                onChange={(e) => onNewNameChange(e.target.value)}
                className="h-8 text-xs w-48"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && onFinishEdit()}
              />
              <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={onFinishEdit}>
                <Check className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={onCancelEdit}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          )
          : (
            <div className="flex items-center gap-1">
              <div
                className="px-2 py-1 bg-background border rounded-md text-xs"
                style={{
                  backgroundColor: selectedNode.data.color || "white",
                  color: selectedNode.data.color ? "white" : "inherit",
                }}
              >
                {selectedNode.data.label}
              </div>
              <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={onStartEdit}>
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          )}

        <div className="flex gap-2">
          <Popover open={colorPopoverOpen} onOpenChange={onToggleColor}>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={stopPropagation}>
                <Palette className="h-3 w-3 mr-1" /> Barva
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start" onClick={stopPropagation} data-color-popover>
              <div className="text-sm font-medium mb-2">Změnit barvu</div>
              <div className="grid grid-cols-4 gap-1">
                {NODE_COLORS.map((c) => (
                  <button
                    key={c}
                    className="w-6 h-6 rounded-full border border-gray-200 transition-transform hover:scale-110"
                    style={{ backgroundColor: c }}
                    onClick={() => onChangeColor(c)}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={shapePopoverOpen} onOpenChange={onToggleShape}>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={stopPropagation}>
                <SquareAsterisk className="h-3 w-3 mr-1" /> Tvar
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start" onClick={stopPropagation} data-shape-popover>
              <div className="text-sm font-medium mb-2">Změnit tvar</div>
              <div className="flex gap-2">
                <button
                  className="w-10 h-10 border rounded-md flex items-center justify-center hover:bg-gray-100"
                  onClick={() => onChangeShape("rectangle")}
                >
                  <div className="w-6 h-6 border border-gray-600 rounded-md" />
                </button>
                <button
                  className="w-10 h-10 border rounded-md flex items-center justify-center hover:bg-gray-100"
                  onClick={() => onChangeShape("ellipse")}
                >
                  <div className="w-6 h-6 border border-gray-600 rounded-full" />
                </button>
                <button
                  className="w-10 h-10 border rounded-md flex items-center justify-center hover:bg-gray-100"
                  onClick={() => onChangeShape("diamond")}
                >
                  <div className="w-6 h-6 border border-gray-600 transform rotate-45" />
                </button>
              </div>
            </PopoverContent>
          </Popover>

          <Button size="sm" variant="outline" className="h-8 text-xs text-destructive" onClick={onDeleteNode}>
            <Trash className="h-3 w-3 mr-1" /> Smazat
          </Button>
        </div>
      </div>
    </div>
  );
}
