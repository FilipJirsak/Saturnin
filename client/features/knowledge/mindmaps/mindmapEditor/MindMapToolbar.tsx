import { useRef, KeyboardEvent } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Plus, Link2, Save, Download, X } from 'lucide-react';

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
}

export function MindMapToolbar({
                                 isCreatingNode, nodeName, onNodeNameChange,
                                 onAddNode, onCancelCreate, isConnecting, canConnect,
                                 onToggleConnect, hasUnsavedChanges, onSave
                               }: MindMapToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
      <div className="p-2 border-b bg-muted/20 flex items-center gap-2 flex-wrap">
        {isCreatingNode ? (
            <div className="flex items-center gap-2">
              <Input
                  ref={inputRef}
                  value={nodeName}
                  onChange={e => onNodeNameChange(e.target.value)}
                  placeholder="Název uzlu"
                  className="w-48"
                  autoFocus
                  onKeyDown={(e: KeyboardEvent) => e.key === 'Enter' && onAddNode()}
              />
              <Button size="sm" variant="default" onClick={onAddNode} disabled={!nodeName}>
                <Plus className="h-4 w-4 mr-1" /> Přidat
              </Button>
              <Button size="sm" variant="ghost" onClick={onCancelCreate}>
                <X className="h-4 w-4" />
              </Button>
            </div>
        ) : (
            <Button size="sm" variant="outline" onClick={onCancelCreate}>
              <Plus className="h-4 w-4 mr-1" /> Přidat uzel
            </Button>
        )}

        <Button
            size="sm"
            variant={isConnecting ? 'default' : 'outline'}
            onClick={onToggleConnect}
            disabled={!canConnect}
            className={!canConnect ? 'opacity-50 cursor-not-allowed' : ''}
        >
          <Link2 className="h-4 w-4 mr-1" />
          Propojit uzly {isConnecting && '(aktivní)'}
        </Button>

        <Button
            size="sm"
            variant="outline"
            onClick={onSave}
            className="ml-auto"
            disabled={!hasUnsavedChanges}
        >
          <Save className="h-4 w-4 mr-1" /> Uložit {hasUnsavedChanges && '*'}
        </Button>

        <Button size="sm" variant="outline" onClick={() => console.log('Export diagramu')}>
          <Download className="h-4 w-4 mr-1" /> Export
        </Button>
      </div>
  );
}
