/*LIBRARY*/

// TODO (NL): Sjednotit typy Document, DocumentItem a MdxDocument pro konzistentnější práci
// TODO (NL): Revidovat datový model pro lepší konzistenci
// TODO (NL): Přidat validační schémata
export interface DocumentItemBase {
  id: string;
  title: string;
  tags: string[];
  isShared?: boolean;
  path: string;
}

export interface DocumentItem extends DocumentItemBase {
  type: "document" | "folder";
  description?: string;
  author?: string;
  lastModified: string;
  children?: DocumentItem[];
  isExpanded?: boolean;
  recentlyMoved?: boolean;
}

export interface Folder {
  id: string;
  title: string;
  description?: string;
  lastModified: string;
  path: string;
  documents: DocumentItem[];
}

export interface Document extends DocumentItemBase {
  content: string;
  lastModified: string;
  createdAt: string;
  author: string;
  relatedIssues?: string[];
  compiledSource?: string;
  type?: "document" | "folder";
  description?: string;
  children?: DocumentItem[];
  isExpanded?: boolean;
}

export interface DocumentDetailProps {
  document: Document;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  onSave: () => void;
  onUpdateDocument: (document: Document) => void;
}

export interface MdxDocument {
  id: string;
  slug: string;
  title: string;
  content: string;
  author?: string;
  tags?: string[];
  lastModified?: string;
  createdAt?: string;
  relatedIssues?: string[];
  isShared?: boolean;
  frontmatter: Record<string, any>;
  compiledSource?: string
}

export interface SearchResult {
  item: DocumentItem;
  matches: {
    field: string;
    text: string;
    highlight: string;
  }[];
}

export interface NewDocument {
  title: string;
  summary: string;
  content: string;
  tags: string[];
  author: string;
}

export interface NewFolder {
  title: string;
  description: string;
  tag: string;
}

/*CONCEPTS*/

export interface RelatedConcept {
  id: string;
  title: string;
  relation: "is_a" | "has_a" | "related_to" | "depends_on" | "part_of";
}

export interface Concept {
  id: string;
  title: string;
  description: string;
  icon?: string;
  tags: string[];
  related: RelatedConcept[];
  lastModified: string;
  createdAt: string;
  author: string;
  isExpanded?: boolean;
}

export interface ConceptDetailProps {
  concept: Concept;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  onSave: () => void;
  onUpdateConcept: (concept: Concept) => void;
  availableConcepts?: Array<{id: string, title: string}>;
}

/*MINDMAPS*/

export interface MindMapConnection {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  style?: 'solid' | 'dashed' | 'dotted';
  color?: string;
  thickness?: number;
}

export interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  color?: string;
  shape?: 'rectangle' | 'ellipse' | 'diamond';
  fontSize?: number;
  width?: number;
  height?: number;
}

export interface MindMap {
  id: string;
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  nodeCount: number;
  nodes: MindMapNode[];
  connections: MindMapConnection[];
  color: string;
  isPublic: boolean;
  viewMode: 'tree' | 'network' | 'free';
}

export interface NewMindMap {
  title: string;
  description: string;
  tags: string[];
  author: string;
}

/*TAGS*/

export interface KnowledgeTag {
  id: string;
  name: string;
  description?: string;
  color?: string;
  count: {
    documents: number;
    concepts: number;
    mindmaps: number;
  };
  createdAt: string;
}

export interface TagFormProps {
  tag: Partial<KnowledgeTag>;
  onSave: (tag: Partial<KnowledgeTag>) => void;
  onCancel: () => void;
  editMode?: boolean;
}
