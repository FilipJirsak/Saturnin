import {getAllMdxDocuments} from "~/utils/knowledge/mdxUtils";
import {DocumentItem, Folder, MdxDocument} from "~/types/knowledge";

/**
 * Organizes MDX documents into folders based on their primary tag.
 *
 * This function creates a hierarchical structure where documents are grouped
 * into folders according to their first tag. Documents without tags are placed
 * at the root level. The function preserves document metadata and maintains
 * last modification dates for both documents and folders.
 *
 * @param mdxDocuments - Array of MDX documents to organize
 * @returns Array of DocumentItem objects representing the folder structure
 */
export function organizeDocumentsIntoFolders(mdxDocuments: MdxDocument[]) {
  const documents: DocumentItem[] = [];
  const foldersByTag: Record<string, DocumentItem> = {};
  const folderDocumentIds = new Set<string>();

  for (const doc of mdxDocuments) {
    const isFolder = doc.tags && doc.tags.includes('_system_folder');

    if (isFolder && doc.tags && doc.tags.length > 0) {
      folderDocumentIds.add(doc.id);

      const folderTag = doc.tags.find(tag => tag !== '_system_folder');

      if (folderTag && !foldersByTag[folderTag]) {
        foldersByTag[folderTag] = {
          id: folderTag,
          type: "folder" as const,
          title: doc.title,
          description: doc.frontmatter.description || doc.content.substring(0, 100).replace(/\n/g, ' '),
          lastModified: doc.lastModified || doc.createdAt || new Date().toISOString(),
          path: `/knowledge/library/folder/${folderTag}`,
          children: [],
          isExpanded: false,
          tags: doc.tags
        };
      }
    }
  }

  for (const doc of mdxDocuments) {
    if (folderDocumentIds.has(doc.id)) {
      continue;
    }

    const documentItem: DocumentItem = {
      id: doc.id,
      type: "document" as const,
      title: doc.title,
      description: doc.frontmatter.description || doc.content.substring(0, 100).replace(/\n/g, ' ') + '...',
      tags: doc.tags || [],
      author: doc.author || "Neznámý",
      lastModified: doc.lastModified || doc.createdAt || new Date().toISOString(),
      isShared: doc.isShared || false,
      path: `/knowledge/library/${doc.id}`
    };

    let assignedToFolder = false;

    if (doc.tags && doc.tags.length > 0) {
      for (const tag of doc.tags) {
        if (tag && foldersByTag[tag]) {
          foldersByTag[tag].children = foldersByTag[tag].children || [];

          foldersByTag[tag].children.push(documentItem); //TODO (NL): Opravit TS chybu

          if (new Date(documentItem.lastModified) > new Date(foldersByTag[tag].lastModified)) {
            foldersByTag[tag].lastModified = documentItem.lastModified;
          }

          assignedToFolder = true;
          break;
        }
      }
    }

    if (!assignedToFolder) {
      documents.push(documentItem);
    }
  }

  Object.values(foldersByTag).forEach(folder => {
    documents.push(folder);
  });

  return documents.sort((a, b) =>
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  );
}

/**
 * Formats a tag name by capitalizing the first letter.
 *
 * This utility function ensures consistent formatting of tag names
 * across the application by capitalizing the first letter while
 * preserving the rest of the string.
 *
 * @param tag - The original tag string to format
 * @returns The formatted tag with capitalized first letter
 */
export const formatTagName = (tag: string): string => {
  return tag.charAt(0).toUpperCase() + tag.slice(1);
};

/**
 * Returns the most recent modification date from a list of documents.
 *
 * This helper function examines all documents in the provided array
 * and returns the latest modification date. If the array is empty,
 * it returns the current date.
 *
 * @param documents - Array of document items to check
 * @returns ISO string representation of the latest modification date
 */
function getLatestModificationDate(documents: DocumentItem[]): string {
  if (documents.length === 0) {
    return new Date().toISOString();
  }

  return documents.reduce(
      (latest, doc) => new Date(doc.lastModified) > new Date(latest) ? doc.lastModified : latest,
      documents[0].lastModified
  );
}

/**
 * Loads a folder and all documents with the given tag.
 *
 * This async function retrieves all MDX documents that have the specified tag,
 * and organizes them into a Folder object. It includes document metadata and
 * calculates the folder's last modification date based on the most recently
 * modified document.
 *
 * @param tag - The tag to filter documents by
 * @returns Promise resolving to a Folder object containing matching documents
 */
export async function getFolderWithDocuments(tag: string): Promise<Folder> {
  // TODO (NL): Implementovat napojení na API místo přímého volání getAllMdxDocuments
  // TODO (NL): Přidat stránkování pro velké složky s mnoha dokumenty
  // TODO (NL): Implementovat možnost řazení dokumentů podle různých kritérií (název, datum, autor)
  // TODO (NL): Přidat kontrolu oprávnění pro přístup k dokumentům v dané složce
  const mdxDocuments = await getAllMdxDocuments();

  const documents = mdxDocuments
      .filter(doc => doc.tags && doc.tags.includes(tag))
      .map(doc => ({
        id: doc.id,
        type: "document" as const,
        title: doc.title,
        description: doc.frontmatter.description || doc.content.substring(0, 100).replace(/\n/g, ' ') + '...',
        tags: doc.tags || [],
        author: doc.author,
        lastModified: doc.lastModified || doc.createdAt || new Date().toISOString(),
        isShared: doc.isShared || false,
        path: `/knowledge/library/${doc.id}`
      }));

  if (documents.length === 0) {
    console.log(`Nenalezeny žádné dokumenty pro tag: ${tag}`);
  }

  return {
    id: `${tag}`,
    title: formatTagName(tag),
    description: `Dokumenty s tagem: ${tag}`,
    lastModified: getLatestModificationDate(documents),
    path: `/knowledge/library/folder/${tag}`,
    documents
  };
}
