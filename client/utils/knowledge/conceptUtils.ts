import { Concept, RelatedConcept } from "~/types/knowledge";
import { RELATION_TYPES } from "~/lib/constants";
import { MOCK_CONCEPTS } from "~/lib/data";

const CONCEPTS_STORAGE_KEY = "concepts";
const isServer = typeof window === "undefined";

/**
 * Populate browser storage with mock data if it’s currently empty.
 *
 * Does nothing on the server side. Checks in-memory cache (`window.__CONCEPTS_DATA`),
 * then `sessionStorage`/`localStorage`. If no concepts are found, writes `MOCK_CONCEPTS`
 * to both storages and caches them on `window`.
 */
export const initializeConceptsIfEmpty = () => {
  if (isServer) return;

  const concepts = getConceptsFromLocalStorage();
  if (concepts.length === 0) {
    localStorage.setItem(CONCEPTS_STORAGE_KEY, JSON.stringify(MOCK_CONCEPTS));
    sessionStorage.setItem(CONCEPTS_STORAGE_KEY, JSON.stringify(MOCK_CONCEPTS));
    if (typeof window !== 'undefined') {
      (window as any).__CONCEPTS_DATA = MOCK_CONCEPTS;
    }
  }
};

/**
 * Add or update a Concept in browser storage.
 *
 * Reads the current list (defaults to `[]` on parse errors), inserts or replaces
 * the provided concept, then writes the updated array back to both `localStorage`
 * and `sessionStorage`, and updates `window.__CONCEPTS_DATA`.
 *
 * @param concept – the Concept object to save
 */
export const saveConceptToLocalStorage = (concept: Concept) => {
  if (isServer) return;

  let storedConcepts = [];
  const storedJson = localStorage.getItem(CONCEPTS_STORAGE_KEY);

  if (storedJson) {
    try {
      storedConcepts = JSON.parse(storedJson);
    } catch (err) {
      console.error("Error parsing data from localStorage:", err);
      storedConcepts = [];
    }
  }

  if (!Array.isArray(storedConcepts)) {
    console.warn("Data in localStorage is not an array, resetting...");
    storedConcepts = [];
  }

  const existingIndex = storedConcepts.findIndex(c => c.id === concept.id);

  if (existingIndex >= 0) {
    storedConcepts[existingIndex] = concept;
  } else {
    storedConcepts.unshift(concept);
  }

  localStorage.setItem(CONCEPTS_STORAGE_KEY, JSON.stringify(storedConcepts));
  sessionStorage.setItem(CONCEPTS_STORAGE_KEY, JSON.stringify(storedConcepts));
  if (typeof window !== 'undefined') {
    (window as any).__CONCEPTS_DATA = storedConcepts;
  }
};

/**
 * Retrieve all Concept objects from browser storage.
 *
 * Lookup order:
 * 1. In-memory cache (`window.__CONCEPTS_DATA`)
 * 2. `sessionStorage`
 * 3. `localStorage`
 * Falls back to `MOCK_CONCEPTS` if none found.
 */
export const getConceptsFromLocalStorage = (): Concept[] => {
  if (isServer) return MOCK_CONCEPTS;

  if (typeof window !== 'undefined' && (window as any).__CONCEPTS_DATA) {
    return (window as any).__CONCEPTS_DATA;
  }

  const sessionData = sessionStorage.getItem(CONCEPTS_STORAGE_KEY);
  if (sessionData) {
    try {
      const parsed = JSON.parse(sessionData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (err) {
      console.error("Error parsing sessionStorage data:", err);
    }
  }

  const stored = localStorage.getItem(CONCEPTS_STORAGE_KEY);
  const storedConcepts = stored ? JSON.parse(stored) : [];

  return storedConcepts.length > 0 ? storedConcepts : MOCK_CONCEPTS;
};

/**
 * Fetch a single Concept by its ID.
 *
 * Searches stored concepts first; if not found, falls back to `MOCK_CONCEPTS`.
 *
 * @param id – unique identifier of the Concept
 */
export const getConceptFromLocalStorage = (id: string): Concept | null => {
  if (isServer) {
    return MOCK_CONCEPTS.find(c => c.id === id) || null;
  }

  const concepts = getConceptsFromLocalStorage();
  const concept = concepts.find(c => c.id === id);

  if (!concept) {
    return MOCK_CONCEPTS.find(c => c.id === id) || null;
  }

  return concept;
};

/**
 * Remove a Concept by ID from storage.
 *
 * Filters out the matching ID, then writes the new array to both
 * `localStorage` and `sessionStorage`, and updates the in-memory cache.
 *
 * @param id – unique identifier of the Concept to delete
 */
export const deleteConceptFromLocalStorage = (id: string) => {
  if (isServer) return;

  const concepts = getConceptsFromLocalStorage();
  const filtered = concepts.filter(c => c.id !== id);

  localStorage.setItem(CONCEPTS_STORAGE_KEY, JSON.stringify(filtered));
  sessionStorage.setItem(CONCEPTS_STORAGE_KEY, JSON.stringify(filtered));
  if (typeof window !== 'undefined') {
    (window as any).__CONCEPTS_DATA = filtered;
  }
};

/**
 * Retrieve a human-readable label for a given relation key.
 *
 * Looks up the relation key in the RELATION_TYPES constant
 * and returns its corresponding label. If no matching entry
 * is found, returns the original relation string.
 *
 * @param relation - The relation key to look up (e.g. "is_a", "has_a").
 * @returns The label for the relation (e.g. "Is a") or the key itself if not found.
 */
export const getRelationLabel = (relation: string) => {
  const rel = RELATION_TYPES.find(r => r.value === relation);
  return rel ? rel.label : relation;
};

/**
 * Get a color for a relation type
 */
export const getRelationColor = (relation: string) => {
  const colors: Record<string, string> = {
    is_a: "#3b82f6",
    has_a: "#10b981",
    related_to: "#8b5cf6",
    depends_on: "#f59e0b",
    part_of: "#ec4899"
  };
  return colors[relation] || "#6b7280";
};

/**
 * Filter a list of concepts by a search term.
 *
 * Performs a case-insensitive search against each concept's
 * title, description, and tags. If the searchTerm is an empty
 * string, the original array is returned unmodified.
 *
 * @param concepts - Array of Concept objects to filter.
 * @param searchTerm - The term to search for.
 * @returns A new array of Concept objects that match the search term.
 */
export const filterConcepts = (concepts: Concept[], searchTerm: string): Concept[] => {
  if (!searchTerm) return concepts;

  return concepts.filter(concept =>
      concept.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concept.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
};

/**
 * Group related concepts by their relation type.
 *
 * Organizes a flat array of RelatedConcept into an object
 * keyed by each relation type, making it easier to render
 * or process grouped relationships.
 *
 * @param relations - Array of RelatedConcept entries.
 * @returns An object with keys for each relation type pointing
 *          to arrays of RelatedConcepts of that type.
 */
export const categorizeRelations = (relations: RelatedConcept[]) => {
  return {
    is_a: relations.filter(r => r.relation === "is_a"),
    has_a: relations.filter(r => r.relation === "has_a"),
    part_of: relations.filter(r => r.relation === "part_of"),
    depends_on: relations.filter(r => r.relation === "depends_on"),
    related_to: relations.filter(r => r.relation === "related_to"),
  };
};

/**
 * Create and initialize a new Concept object.
 *
 * Takes partial input from the caller, fills in default values
 * for missing fields, generates a unique id based on the current
 * timestamp, and stamps both createdAt and lastModified with
 * the current ISO date string.
 *
 * @param newConcept - Partial fields for the new concept.
 * @param currentUser - Username or identifier of the creator.
 * @returns A fully populated Concept object ready for storage.
 */
export const createNewConcept = (newConcept: Partial<Concept>, currentUser: string): Concept => {
  const currentDate = new Date().toISOString();
  const concept = {
    id: `concept-${Date.now()}`,
    title: newConcept.title || "Nový koncept",
    description: newConcept.description || "",
    tags: newConcept.tags || [],
    related: newConcept.related || [],
    createdAt: currentDate,
    lastModified: currentDate,
    author: newConcept.author || currentUser,
  };

  saveConceptToLocalStorage(concept);
  return concept;
};
