import { Concept, RelatedConcept } from "~/types/knowledge";
import { RELATION_TYPES } from "~/lib/constants";

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
 * Get the CSS background-color class for a specific relation type.
 *
 * Maps relation keys to Tailwind CSS background-color utility classes.
 * Provides a default gray background if the relation is unrecognized.
 *
 * @param relation - The relation key (e.g. "depends_on").
 * @returns A Tailwind CSS class for the background color.
 */
export const getRelationColor = (relation: string) => {
  switch(relation) {
    case "is_a": return "bg-blue-500";
    case "has_a": return "bg-green-500";
    case "part_of": return "bg-purple-500";
    case "depends_on": return "bg-amber-500";
    case "related_to": return "bg-slate-500";
    default: return "bg-gray-500";
  }
};

/**
 * Filter a list of concepts by a search term.
 *
 * Performs a case-insensitive search against each concept’s
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
  return {
    id: `concept-${Date.now()}`,
    title: newConcept.title || "Nový koncept",
    description: newConcept.description || "",
    tags: newConcept.tags || [],
    related: newConcept.related || [],
    createdAt: currentDate,
    lastModified: currentDate,
    author: newConcept.author || currentUser,
  };
};
