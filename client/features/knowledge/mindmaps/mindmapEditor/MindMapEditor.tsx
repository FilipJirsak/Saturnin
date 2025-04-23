import { ReactFlowProvider } from 'reactflow';
import { InnerMindMapEditor } from './InnerMindMapEditor';
import { MindMap } from '~/types/knowledge';

interface MindMapEditorProps {
  mindmap: MindMap;
  onSave: (updated: MindMap) => void;
  readOnly?: boolean;
}

export function MindMapEditor({ mindmap, onSave, readOnly }: MindMapEditorProps) {
  return (
      <ReactFlowProvider>
        <InnerMindMapEditor mindmap={mindmap} onSave={onSave} readOnly={readOnly} />
      </ReactFlowProvider>
  );
}
