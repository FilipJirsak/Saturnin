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
  handleDocumentDropAction: (draggedId: string, targetId: string) => void;
  resetFolderState: () => void;
}

export function useLibraryDocuments({
                                      initialDocuments,
                                      isSearching = false,
                                    }: UseLibraryDocumentsProps): UseLibraryDocumentsReturn {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const { toast } = useToast();

  useEffect(() => {
    setDocuments(initialDocuments);
  }, [initialDocuments]);

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
            children: item.children.filter(child => child.id !== draggedId),
            isExpanded: item.id === targetId ? true : item.isExpanded
          };
        }
        return item;
      });

      return newItems.map(item => {
        if (item.id === targetId && item.type === "folder") {
          return {
            ...item,
            children: [...(item.children || []), { ...draggedDocument!, recentlyMoved: true }],
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
  }, [documents]);

  const handleDocumentDropAction = useCallback(async (draggedId: string, targetId: string) => {
    handleDocumentDrop(draggedId, targetId);

    try {
      const folderTag = targetId.replace(/^folder-/, '');

      // console.log(`Přesouvám dokument ${draggedId} do složky s tagem ${folderTag}`);

      const docResponse = await fetch(`/api/knowledge/documents/${draggedId}`);
      if (!docResponse.ok) {
        throw new Error(`Nepodařilo se načíst dokument (status: ${docResponse.status})`);
      }

      const docData = await docResponse.json();
      if (!docData.ok) {
        throw new Error(docData.error || "Nepodařilo se načíst dokument");
      }

      const doc = docData.document;

      let updatedTags = [...(doc.frontmatter.tags || [])];
      updatedTags = updatedTags.filter(tag => tag !== folderTag);
      updatedTags.unshift(folderTag);

      const updateResponse = await fetch(`/api/knowledge/documents/${draggedId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          tags: updatedTags,
          content: doc.content
        })
      });

      if (updateResponse.ok) {
        const updateData = await updateResponse.json();

        if (updateData.ok) {
          toast({
            title: "Dokument přesunut",
            description: `Dokument byl úspěšně přesunut do složky.`,
            variant: "success"
          });
        } else {
          throw new Error(updateData.error || "Nepodařilo se přesunout dokument");
        }
      } else {
        throw new Error(`Server vrátil chybu (${updateResponse.status})`);
      }
    } catch (error) {
      console.error("Chyba při přesouvání dokumentu:", error);
      toast({
        title: "Chyba při přesouvání dokumentu",
        description: error instanceof Error ? error.message : "Dokument se nepodařilo přesunout. Zkus to prosím znovu.",
        variant: "destructive"
      });

      resetFolderState();
    }
  }, [documents, handleDocumentDrop, resetFolderState, toast]);

  return {
    documents,
    handleToggleFolder,
    handleDocumentDropAction,
    resetFolderState,
  };
}
