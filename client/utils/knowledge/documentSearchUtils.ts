import { DocumentItem, SearchResult } from "~/types/knowledge";

/**
 * Searches in documents and folders based on the given term.
 *
 * This function performs a recursive search through the document tree
 * to find items that match the specified search term in their title,
 * description, or tags.
 *
 * @param items - Array of document items to search through
 * @param searchTerm - The term to search for in the documents
 * @returns Array of search results containing matched items and their matching fields
 */
export function searchDocuments(
  items: DocumentItem[],
  searchTerm: string,
): SearchResult[] {
  // TODO (NL): Implementovat cachování vyhledávacích výsledků pro opakované dotazy
  // TODO (NL): Použít algoritmus pro hodnocení relevance výsledků (např. weighted scoring)
  // TODO (NL): Přidat podporu pro fulltextové vyhledávání v obsahu dokumentů (ne jen v metadatech)
  // TODO (NL): Přidat podporu pro pokročilé vyhledávání s operátory (AND, OR, NOT)
  if (!searchTerm.trim()) return [];

  const normalizedTerm = searchTerm.toLowerCase().trim();
  const results: SearchResult[] = [];

  function searchItem(item: DocumentItem) {
    const matches: SearchResult["matches"] = [];

    if (item.title.toLowerCase().includes(normalizedTerm)) {
      matches.push({
        field: "title",
        text: item.title,
        highlight: highlightMatch(item.title, normalizedTerm),
      });
    }

    if (item.description && item.description.toLowerCase().includes(normalizedTerm)) {
      matches.push({
        field: "description",
        text: item.description,
        highlight: highlightMatch(item.description, normalizedTerm),
      });
    }

    const tagMatches = item.tags.filter((tag) => tag.toLowerCase().includes(normalizedTerm));

    if (tagMatches.length > 0) {
      matches.push({
        field: "tags",
        text: tagMatches.join(", "),
        highlight: tagMatches.map((tag) => highlightMatch(tag, normalizedTerm)).join(", "),
      });
    }

    if (matches.length > 0) {
      results.push({
        item,
        matches,
      });
    }

    if (item.type === "folder" && item.children) {
      item.children.forEach(searchItem);
    }
  }

  items.forEach(searchItem);
  return results;
}

/**
 * Highlights the search term in text using the <mark> tag.
 *
 * This function wraps occurrences of the search term in the provided text
 * with HTML mark tags for visual highlighting. The function is case-insensitive
 * and handles regular expression escaping to ensure proper matching.
 *
 * @param text - The original text to process
 * @param searchTerm - The term to highlight within the text
 * @returns HTML string with highlighted occurrences of the search term
 */
function highlightMatch(text: string, searchTerm: string): string {
  // TODO (NL): Vylepšit zvýrazňování pro víceslovné výrazy a blízkost slov
  // TODO (NL): Ošetřit zvýrazňování v HTML kódu, aby nedošlo k narušení struktury
  if (!searchTerm.trim()) return text;

  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, "gi");
  return text.replace(regex, '<mark style="background: hsl(265 100% 90%)!important">$1</mark>');
}

/**
 * Escapes special characters in regular expressions.
 *
 * This utility function ensures that special characters in the search term
 * are properly escaped so they don't interfere with regular expression syntax.
 * Characters like ., *, +, ?, ^, $, {, }, (, ), |, [, ] and \ are escaped.
 *
 * @param string - The string to escape for use in a regular expression
 * @returns The escaped string safe for regex operations
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Filters document collection based on search term.
 *
 * This function filters a collection of documents to include only those
 * that match the provided search term, while preserving the hierarchical
 * structure of folders. Folders are included in the result if they or any
 * of their children match the search criteria. Matching folders are automatically
 * expanded in the UI.
 *
 * @param documents - The complete document collection to filter
 * @param searchTerm - The term to use for filtering documents
 * @returns Filtered tree of document items matching the search term
 */
export function filterDocumentsBySearchTerm(
  documents: DocumentItem[],
  searchTerm: string,
): DocumentItem[] {
  // TODO (NL): Optimalizovat pro velké kolekce dokumentů - implementovat postupné načítání výsledků
  // TODO (NL): Přidat možnost filtrování podle dalších kritérií (autor, datum, tagy)
  // TODO (NL): Implementovat našeptávač pro vyhledávání na základě historických vyhledávání
  if (!searchTerm.trim()) return documents;

  const searchResults = searchDocuments(documents, searchTerm);
  const matchedIds = new Set(searchResults.map((result) => result.item.id));

  function filterItem(item: DocumentItem): DocumentItem | null {
    if (item.type === "folder" && item.children) {
      const filteredChildren = item.children
        .map(filterItem)
        .filter(Boolean) as DocumentItem[];

      if (matchedIds.has(item.id) || filteredChildren.length > 0) {
        return {
          ...item,
          children: filteredChildren,
          isExpanded: true,
        };
      }
      return null;
    }

    return matchedIds.has(item.id) ? item : null;
  }

  return documents
    .map(filterItem)
    .filter((item): item is DocumentItem => item !== null);
}
