import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { EDGE_COLORS, LINE_STYLES } from "~/lib/constants";

interface EdgeCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (label: string, style: string, color: string) => void;
}

export function EdgeCreationDialog({
  isOpen,
  onClose,
  onConfirm,
}: EdgeCreationDialogProps) {
  const [edgeLabel, setEdgeLabel] = useState("");
  const [edgeStyle, setEdgeStyle] = useState("solid");
  const [edgeColor, setEdgeColor] = useState("#555555");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Vlastnosti propojení</DialogTitle>
          <DialogDescription>
            Nastav vlastnosti nového propojení mezi uzly.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edgeLabel" className="text-right">Popisek</Label>
            <Input
              id="edgeLabel"
              value={edgeLabel}
              onChange={(e) => setEdgeLabel(e.target.value)}
              placeholder="např. používá, obsahuje"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edgeStyle" className="text-right">Styl čáry</Label>
            <Select value={edgeStyle} onValueChange={setEdgeStyle}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Vyber styl čáry" />
              </SelectTrigger>
              <SelectContent>
                {LINE_STYLES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edgeColor" className="text-right">Barva</Label>
            <div className="col-span-3 flex items-center gap-2">
              <Select value={edgeColor} onValueChange={setEdgeColor}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Vyber barvu" />
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
              <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: edgeColor }} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Zrušit</Button>
          <Button onClick={() => onConfirm(edgeLabel, edgeStyle, edgeColor)}>
            Vytvořit propojení
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
