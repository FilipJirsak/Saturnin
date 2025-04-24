import { CSSProperties, memo } from 'react';
import { useDragLayer, XYCoord } from 'react-dnd';
import { FileText } from 'lucide-react';

interface DragItem {
  id: string;
  title: string;
  type: 'document' | 'folder';
}

const layerStyles: CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 9999,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
};

function getItemStyles(
    initialOffset: XYCoord | null,
    currentOffset: XYCoord | null
): CSSProperties {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    };
  }

  const { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y - 20}px)`;

  return {
    transform,
    WebkitTransform: transform
  };
}

const DragPreview = ({ item }: { item: DragItem }) => {
  return (
      <div className="bg-background border rounded-md shadow-md p-2 flex items-center space-x-2 w-40">
        <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
        <span className="text-sm font-medium truncate">{item.title}</span>
      </div>
  );
};

export const LibraryCustomDragLayer = memo(() => {
  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    currentOffset
  } = useDragLayer((monitor) => ({
    item: monitor.getItem() as DragItem,
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  if (!isDragging || itemType !== 'DOCUMENT_ITEM') {
    return null;
  }

  return (
      <div style={layerStyles}>
        <div style={getItemStyles(initialOffset, currentOffset)}>
          <DragPreview item={item} />
        </div>
      </div>
  );
});

LibraryCustomDragLayer.displayName = 'LibraryCustomDragLayer';
