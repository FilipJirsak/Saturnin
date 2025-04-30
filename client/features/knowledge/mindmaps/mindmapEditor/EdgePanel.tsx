import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Trash } from "lucide-react";
import { EDGE_COLORS, LINE_STYLES } from "~/lib/constants";

interface EdgePanelProps {
  selectedEdge: any;
  updateEdge: (edgeId: string, props: any) => void;
  onDeleteEdge: () => void;
}

export function EdgePanel({ selectedEdge, updateEdge, onDeleteEdge }: EdgePanelProps) {
  const currentDash = selectedEdge.style?.strokeDasharray;
  const currentStyle = currentDash === "5 5" ? "dashed" : currentDash === "2 2" ? "dotted" : "solid";
  const currentColor = selectedEdge.style?.stroke?.toString() || "#555";

  return (
    <div className="p-2 border-t bg-muted/10">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium">Vybrané propojení:</span>
        <div className="flex gap-2 flex-wrap flex-1">
          <Input
            value={selectedEdge.label || ""}
            onChange={(e) => updateEdge(selectedEdge.id, { label: e.target.value })}
            className="h-8 text-xs w-48"
            placeholder="Popisek propojení"
          />

          <Select
            value={currentStyle}
            onValueChange={(value) => {
              let dashArray: string | undefined;
              if (value === "dashed") dashArray = "5 5";
              else if (value === "dotted") dashArray = "2 2";
              updateEdge(selectedEdge.id, {
                animated: value !== "solid",
                style: { ...selectedEdge.style, strokeDasharray: dashArray },
              });
            }}
          >
            <SelectTrigger className="h-8 text-xs w-32">
              <SelectValue placeholder="Styl čáry" />
            </SelectTrigger>
            <SelectContent>
              {LINE_STYLES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select
            value={currentColor}
            onValueChange={(value) =>
              updateEdge(selectedEdge.id, {
                style: { ...selectedEdge.style, stroke: value },
              })}
          >
            <SelectTrigger className="h-8 text-xs w-32">
              <SelectValue placeholder="Barva" />
            </SelectTrigger>
            <SelectContent>
              {EDGE_COLORS.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.value }} />
                    <span>{c.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button size="sm" variant="outline" className="h-8 text-xs text-destructive ml-auto" onClick={onDeleteEdge}>
            <Trash className="h-3 w-3 mr-1" /> Smazat propojení
          </Button>
        </div>
      </div>
    </div>
  );
}
