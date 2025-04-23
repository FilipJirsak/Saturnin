import { useState, useEffect, useCallback } from "react";
import { DocumentItem } from "~/types/knowledge";
import { useToast } from "~/hooks/use-toast";

interface UseLibraryDocumentsProps {
  initialDocuments: DocumentItem[];
  isSearching?: boolean;
}

interface UseLibraryDocumentsReturn {
  documents: DocumentItem[];
  handleToggleFolder: (folderId: string) => void;
  handleDocumentDrop: (draggedId: string, targetId: string) => void;
  resetFolderState: () => void;
}

export function useLibraryDocuments({
                                      initialDocuments,
                                      isSearching = false,
                                    }: UseLibraryDocumentsProps): UseLibraryDocumentsReturn {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const { toast } = useToast();

  useEffect(() => {
    if (!isSearching) {
      resetFolderState();
    }
  }, [isSearching]);

  const resetFolderState = useCallback(() => {
    setDocuments(prevDocs =>
        prevDocs.map(doc => {
          if (doc.type === "folder") {
            return { ...doc, isExpanded: false };
          }
          return doc;
        })
    );
  }, []);

  const handleToggleFolder = useCallback((folderId: string) => {
    setDocuments(prevDocs =>
        prevDocs.map(doc => {
          if (doc.id === folderId && doc.type === "folder") {
            return { ...doc, isExpanded: !doc.isExpanded };
          }

          if (doc.type === "folder" && doc.children) {
            const updatedChildren = doc.children.map(child =>
                child.id === folderId && child.type === "folder"
                    ? { ...child, isExpanded: !child.isExpanded }
                    : child
            );

            return { ...doc, children: updatedChildren };
          }

          return doc;
        })
    );
  }, []);

  const handleDocumentDrop = useCallback((draggedId: string, targetId: string) => {
    const findDocument = (items: DocumentItem[], docId: string, parentId: string | null = null): [DocumentItem | null, string | null] => {
      for (const item of items) {
        if (item.id === docId) {
          return [{ ...item }, parentId];
        }

        if (item.type === "folder" && item.children) {
          const [found, foundParentId] = findDocument(item.children, docId, item.id);
          if (found) return [found, foundParentId];
        }
      }

      return [null, null];
    };

    const findFolder = (items: DocumentItem[], folderId: string): DocumentItem | null => {
      for (const item of items) {
        if (item.id === folderId) {
          return item;
        }

        if (item.type === "folder" && item.children) {
          const found = findFolder(item.children, folderId);
          if (found) return found;
        }
      }

      return null;
    };

    const processItems = (items: DocumentItem[]): DocumentItem[] => {
      const newItems = items.filter(item => item.id !== draggedId).map(item => {
        if (item.type === "folder" && item.children) {
          return {
            ...item,
            children: processItems(item.children),
            isExpanded: item.id === targetId ? true : item.isExpanded
          };
        }
        return item;
      });

      return newItems.map(item => {
        if (item.id === targetId && item.type === "folder") {
          return {
            ...item,
            children: [...item.children, { ...draggedDocument!, recentlyMoved: true }],
            isExpanded: true
          };
        }
        return item;
      });
    };

    const removeHighlight = (items: DocumentItem[]): DocumentItem[] => {
      return items.map(item => {
        const newItem = { ...item };
        if ('recentlyMoved' in newItem) {
          delete newItem.recentlyMoved;
        }

        if (newItem.type === "folder" && newItem.children) {
          newItem.children = removeHighlight(newItem.children);
        }

        return newItem;
      });
    };

    let [draggedDocument, draggedParentId] = findDocument(documents, draggedId);

    if (!draggedDocument) {
      console.error("Přesouvaný dokument nebyl nalezen");
      return;
    }

    const targetFolder = findFolder(documents, targetId);

    if (!targetFolder || targetFolder.type !== "folder") {
      console.error("Cílová složka nebyla nalezena nebo není složkou");
      return;
    }

    const updatedDocuments = processItems(documents);
    setDocuments(updatedDocuments);

    setTimeout(() => {
      setDocuments(currentDocs => removeHighlight(currentDocs));
    }, 2000);

    toast({
      title: "Dokument přesunut",
      description: `Dokument "${draggedDocument.title}" byl přesunut do složky "${targetFolder.title}".`,
      variant: "success"
    });
  }, [documents, toast]);

  return {
    documents,
    handleToggleFolder,
    handleDocumentDrop,
    resetFolderState,
  };
}
