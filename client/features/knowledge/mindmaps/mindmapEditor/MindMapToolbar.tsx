import { useRef, KeyboardEvent } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Plus, Link2, Save, Download, X, Share2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface MindMapToolbarProps {
  isCreatingNode: boolean;
  nodeName: string;
  onNodeNameChange: (v: string) => void;
  onAddNode: () => void;
  onCancelCreate: () => void;
  isConnecting: boolean;
  canConnect: boolean;
  onToggleConnect: () => void;
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onExport?: (format: 'png' | 'json' | 'svg') => void;
  onShare?: () => void;
  isPublic?: boolean;
}

export function MindMapToolbar({
  isCreatingNode,
  nodeName,
  onNodeNameChange,
  onAddNode,
  onCancelCreate,
  isConnecting,
  canConnect,
  onToggleConnect,
  hasUnsavedChanges,
  onSave,
  onExport,
  onShare,
  isPublic
}: MindMapToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onAddNode();
    } else if (e.key === 'Escape') {
      onCancelCreate();
    }
  };

  return (
    <div className="p-2 border-b flex items-center gap-2">
      {isCreatingNode ? (
        <>
          <Input
            ref={inputRef}
            value={nodeName}
            onChange={(e) => onNodeNameChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Název uzlu..."
            className="w-48"
            autoFocus
          />
          <Button size="sm" onClick={onAddNode} disabled={!nodeName}>
            <Plus className="h-4 w-4 mr-1" />
            Přidat
          </Button>
          <Button size="sm" variant="ghost" onClick={onCancelCreate}>
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button size="sm" onClick={() => { onCancelCreate(); inputRef.current?.focus(); }}>
          <Plus className="h-4 w-4 mr-1" />
          Nový uzel
        </Button>
      )}

      <div className="h-6 w-px bg-border mx-1" />

      <Button
        size="sm"
        variant={isConnecting ? "secondary" : "outline"}
        onClick={onToggleConnect}
        disabled={!canConnect}
      >
        <Link2 className="h-4 w-4 mr-1" />
        Propojit
      </Button>

      <div className="h-6 w-px bg-border mx-1" />

      <Button size="sm" variant="outline" onClick={onSave} disabled={!hasUnsavedChanges}>
        <Save className="h-4 w-4 mr-1" />
        Uložit
      </Button>

      {onExport && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-1" />
              Exportovat
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onExport('png')}>
              Exportovat jako PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('svg')}>
              Exportovat jako SVG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('json')}>
              Exportovat jako JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {onShare && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onShare}
          className="ml-auto"
        >
          <Share2 className="h-4 w-4 mr-1" />
          {isPublic ? 'Sdíleno' : 'Sdílet'}
        </Button>
      )}
    </div>
  );
}
