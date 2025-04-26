import { useState, useEffect, useCallback, useRef, MouseEvent } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  MiniMap,
  Background,
  Panel,
  MarkerType,
  Node,
  Edge,
  Connection
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toPng, toSvg } from 'html-to-image';
import { MindMap, MindMapNode as MindMapNodeType, MindMapConnection } from '~/types/knowledge';
import { TextNode } from './TextNode';
import { EdgeCreationDialog } from './EdgeCreationDialog';
import { MindMapToolbar } from './MindMapToolbar';
import { NodePanel } from './NodePanel';
import { EdgePanel } from './EdgePanel';
import { NODE_COLORS } from '~/lib/constants';
import { useToast } from '~/hooks/use-toast';

// TODO (NL): Implementovat historii změn (undo/redo)
interface InnerMindMapEditorProps {
  mindmap: MindMap;
  onSave: (updatedMindmap: MindMap) => void;
  readOnly?: boolean;
}

type TextNodeData = {
  label: string;
  color: string;
  shape: 'rectangle' | 'ellipse' | 'diamond';
};

const nodeTypes = { textNode: TextNode };

export function InnerMindMapEditor({
                                     mindmap,
                                     onSave,
                                     readOnly = false
                                   }: InnerMindMapEditorProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const { toast } = useToast();

  const initialNodes = mindmap.nodes.map((n: MindMapNodeType) => ({
    id: n.id,
    type: 'textNode',
    position: { x: n.x, y: n.y },
    data: { label: n.text, color: n.color, shape: n.shape || 'rectangle' }
  }));
  const initialEdges = mindmap.connections.map((c: MindMapConnection) => ({
    id: c.id,
    source: c.sourceId,
    target: c.targetId,
    label: c.label || '',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: {
      strokeWidth: c.thickness || 1,
      stroke: c.color || '#555',
      strokeDasharray:
          c.style === 'dashed' ? '5 5'
              : c.style === 'dotted' ? '2 2'
                  : undefined
    }
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [isCreatingNode, setIsCreatingNode] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [pendingConnection, setPendingConnection] = useState<Connection | null>(null);
  const [isEdgeDialogOpen, setIsEdgeDialogOpen] = useState(false);

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  const [newNodeName, setNewNodeName] = useState('');
  const [isEditingNodeName, setIsEditingNodeName] = useState(false);

  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
  const [shapePopoverOpen, setShapePopoverOpen] = useState(false);

  const canConnect = nodes.length > 1 && !readOnly;

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setHasUnsavedChanges(false);
  }, [mindmap.id]);

  useEffect(() => {
    if (selectedEdge) {
      const updated = edges.find(e => e.id === selectedEdge.id);
      if (updated) setSelectedEdge(updated);
    }
  }, [edges, selectedEdge]);

  const handleExport = async (format: 'png' | 'json' | 'svg') => {
    if (!reactFlowWrapper.current || !reactFlowInstance) return;

    try {
      if (format === 'json') {
        const data = {
          nodes: nodes,
          edges: edges,
        };
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${mindmap.title}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        reactFlowInstance.fitView({ duration: 0, padding: 0.2 });
        await new Promise(resolve => setTimeout(resolve, 100));

        const exportFunction = format === 'png' ? toPng : toSvg;
        const dataUrl = await exportFunction(reactFlowWrapper.current, {
          backgroundColor: '#ffffff',
          quality: 1,
          width: reactFlowWrapper.current.offsetWidth,
          height: reactFlowWrapper.current.offsetHeight,
          style: {
            width: '100%',
            height: '100%'
          },
          filter: (node) => {
            return !node.classList?.contains('react-flow__minimap');
          }
        });

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${mindmap.title}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      toast({
        title: 'Export úspěšný',
        description: `Mindmapa byla exportována ve formátu ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export selhal',
        description: 'Nepodařilo se exportovat mindmapu',
        variant: 'destructive',
      });
    }
  };

  const onAddNode = useCallback(() => {
    if (!nodeName || !reactFlowInstance) return;
    const pos = reactFlowInstance.screenToFlowPosition({
      x: reactFlowWrapper.current!.clientWidth / 2,
      y: reactFlowWrapper.current!.clientHeight / 2
    });
    const color = NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)];
    const newNode: Node<TextNodeData> = {
      id: `node-${Date.now()}`,
      type: 'textNode',
      position: pos,
      data: {
        label: nodeName,
        color,
        shape: 'rectangle'
      }
    };
    setNodes(nds => nds.concat(newNode));
    setNodeName('');
    setIsCreatingNode(false);
    setHasUnsavedChanges(true);
  }, [nodeName, reactFlowInstance]);

  const onConnect = useCallback((params: Connection) => {
    setPendingConnection(params);
    setIsEdgeDialogOpen(true);
  }, []);

  const handleConfirmEdgeCreation = useCallback((label: string, style: string, color: string) => {
    if (!pendingConnection) return;
    let dash: string | undefined;
    if (style === 'dashed') dash = '5 5';
    if (style === 'dotted') dash = '2 2';
    setEdges(eds =>
        addEdge({
          ...pendingConnection,
          id: `edge-${Date.now()}`,
          label,
          markerEnd: { type: MarkerType.ArrowClosed },
          type: 'smoothstep',
          style: { stroke: color, strokeWidth: 1, strokeDasharray: dash },
          animated: style !== 'solid'
        }, eds)
    );
    setPendingConnection(null);
    setIsEdgeDialogOpen(false);
    setHasUnsavedChanges(true);
  }, [pendingConnection]);

  const updateEdge = useCallback((edgeId: string, props: any) => {
    setEdges(eds =>
        eds.map(edge => {
          if (edge.id === edgeId) {
            if (props.style) {
              const cur = { ...edge.style };
              delete cur.strokeDasharray;
              return { ...edge, ...props, style: { ...cur, ...props.style } };
            }
            return { ...edge, ...props };
          }
          return edge;
        })
    );
    setHasUnsavedChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    const mmNodes: MindMapNodeType[] = nodes.map(n => ({
      id: n.id,
      text: n.data.label,
      x: n.position.x,
      y: n.position.y,
      color: n.data.color,
      shape: n.data.shape
    }));
    const mmConns: MindMapConnection[] = edges.map(e => {
      let s: 'solid' | 'dashed' | 'dotted' = 'solid';
      if (e.style?.strokeDasharray === '5 5') s = 'dashed';
      else if (e.style?.strokeDasharray === '2 2') s = 'dotted';
      return {
        id: e.id,
        sourceId: e.source,
        targetId: e.target,
        label: (e.label as string) || '',
        style: s,
        color: e.style?.stroke?.toString() || '#555',
        thickness: Number(e.style?.strokeWidth) || 1
      };
    });
    onSave({
      ...mindmap,
      nodes: mmNodes,
      connections: mmConns,
      nodeCount: mmNodes.length,
      updatedAt: new Date().toISOString()
    });
    setHasUnsavedChanges(false);
  }, [nodes, edges, mindmap, onSave]);

  const handleNodeClick = useCallback((_: MouseEvent, node: Node) => {
    if (readOnly) return;
    setSelectedEdge(null);
    setColorPopoverOpen(false);
    setShapePopoverOpen(false);
    setSelectedNode(node);
    setNewNodeName(node.data.label);
  }, [readOnly]);

  const handleEdgeClick = useCallback((e: MouseEvent, edge: Edge) => {
    if (readOnly) return;
    e.stopPropagation();
    setSelectedNode(null);
    setSelectedEdge(edge);
  }, [readOnly]);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  const handleDeleteNode = useCallback(() => {
    if (!selectedNode) return;
    setNodes(ns => ns.filter(n => n.id !== selectedNode.id));
    setEdges(es => es.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id));
    setSelectedNode(null);
    setHasUnsavedChanges(true);
  }, [selectedNode]);

  const handleDeleteEdge = useCallback(() => {
    if (!selectedEdge) return;
    setEdges(es => es.filter(e => e.id !== selectedEdge.id));
    setSelectedEdge(null);
    setHasUnsavedChanges(true);
  }, [selectedEdge]);

  const handleStartEditNodeName = useCallback(() => {
    if (!selectedNode) return;
    setIsEditingNodeName(true);
  }, [selectedNode]);

  const handleFinishEditNodeName = useCallback(() => {
    if (!selectedNode) return;
    setNodes(ns =>
        ns.map(n =>
            n.id === selectedNode.id
                ? { ...n, data: { ...n.data, label: newNodeName || n.data.label } }
                : n
        )
    );
    setIsEditingNodeName(false);
    setHasUnsavedChanges(true);
  }, [selectedNode, newNodeName]);

  const handleCancelEditNodeName = useCallback(() => {
    setIsEditingNodeName(false);
  }, []);

  useEffect(() => {
    function onClickOutside(e: globalThis.MouseEvent) {
      const targetEl = e.target as HTMLElement;

      const colorPop = document.querySelector<HTMLElement>('[data-color-popover]');
      const shapePop = document.querySelector<HTMLElement>('[data-shape-popover]');

      if (colorPopoverOpen && colorPop && !colorPop.contains(targetEl)) {
        setColorPopoverOpen(false);
      }
      if (shapePopoverOpen && shapePop && !shapePop.contains(targetEl)) {
        setShapePopoverOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [colorPopoverOpen, shapePopoverOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setColorPopoverOpen(false);
        setShapePopoverOpen(false);
        setIsEditingNodeName(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <MindMapToolbar
        isCreatingNode={isCreatingNode}
        nodeName={nodeName}
        onNodeNameChange={setNodeName}
        onAddNode={onAddNode}
        onCancelCreate={() => { setIsCreatingNode(!isCreatingNode); setNodeName(''); }}
        isConnecting={isConnecting}
        canConnect={canConnect}
        onToggleConnect={() => setIsConnecting(!isConnecting)}
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={handleSave}
        onExport={handleExport}
      />

      <div ref={reactFlowWrapper} className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={changes => { onNodesChange(changes); setHasUnsavedChanges(true); }}
          onEdgesChange={changes => { onEdgesChange(changes); setHasUnsavedChanges(true); }}
          onConnect={canConnect ? onConnect : undefined}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          onPaneClick={handlePaneClick}
          nodeTypes={nodeTypes}
          onInit={setReactFlowInstance}
          fitView
          attributionPosition="bottom-left"
          snapToGrid
          snapGrid={[15, 15]}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed }
          }}
          proOptions={{ hideAttribution: true }}
          selectNodesOnDrag={false}
          zoomOnDoubleClick={!readOnly}
          zoomOnScroll={!readOnly}
          panOnScroll={!readOnly}
          nodesDraggable={!readOnly}
          nodesConnectable={!readOnly && isConnecting}
          elementsSelectable={!readOnly}
          connectOnClick={isConnecting}
        >
          <Controls />
          <MiniMap />
          <Background gap={16} size={1} />
          {isConnecting && (
            <Panel position="bottom-center" className="bg-background/80 p-2 rounded-md shadow-md z-10 text-sm">
              Klikni na zdrojový uzel a poté na cílový uzel pro vytvoření spojení
            </Panel>
          )}
        </ReactFlow>
      </div>

      {selectedNode && !readOnly && (
            <NodePanel
                selectedNode={selectedNode}
                newNodeName={newNodeName}
                onNewNameChange={setNewNodeName}
                editingNodeName={isEditingNodeName}
                onStartEdit={handleStartEditNodeName}
                onFinishEdit={handleFinishEditNodeName}
                onCancelEdit={handleCancelEditNodeName}
                colorPopoverOpen={colorPopoverOpen}
                onToggleColor={() => { setColorPopoverOpen(v => !v); setShapePopoverOpen(false); }}
                onChangeColor={color => {
                  setNodes(ns => ns.map(n =>
                      n.id === selectedNode.id ? { ...n, data: { ...n.data, color } } : n
                  ));
                  setHasUnsavedChanges(true);
                  setColorPopoverOpen(false);
                }}
                shapePopoverOpen={shapePopoverOpen}
                onToggleShape={() => { setShapePopoverOpen(v => !v); setColorPopoverOpen(false); }}
                onChangeShape={shape => {
                  setNodes(ns => ns.map(n =>
                      n.id === selectedNode.id ? { ...n, data: { ...n.data, shape } } : n
                  ));
                  setHasUnsavedChanges(true);
                  setShapePopoverOpen(false);
                }}
                onDeleteNode={handleDeleteNode}
            />
        )}

        {selectedEdge && !readOnly && (
            <EdgePanel
                selectedEdge={selectedEdge}
                updateEdge={updateEdge}
                onDeleteEdge={handleDeleteEdge}
            />
        )}

        <EdgeCreationDialog
            isOpen={isEdgeDialogOpen}
            onClose={() => { setIsEdgeDialogOpen(false); setPendingConnection(null); }}
            onConfirm={handleConfirmEdgeCreation}
        />
    </div>
  );
}
