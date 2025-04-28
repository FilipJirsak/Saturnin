import { IssueFull } from "~/types";
import { ISSUE_STATES } from "~/lib/constants";

/**
 * Gets the human-readable label for an issue state
 *
 * @param stateValue - The state value code (e.g., 'new', 'to_do', 'in_progress', 'done')
 */
export const getStateLabel = (stateValue: string): string => {
  const stateObj = ISSUE_STATES.find(s => s.value === stateValue);
  return stateObj ? stateObj.label : stateValue;
};

/**
 * Determines the UI variant for a component based on the issue state
 *
 * @param state - The state value code (e.g., 'new', 'to_do', 'in_progress', 'done')
 * @returns The appropriate UI variant for displaying the state
 */
export const getStateVariant = (state: string): 'outline' | 'secondary' | 'default' | 'success' => {
  switch (state) {
    case 'new':
      return 'outline';
    case 'to_do':
      return 'secondary';
    case 'in_progress':
      return 'default';
    case 'done':
      return 'success';
    default:
      return 'outline';
  }
};

/**
 * Gets the appropriate CSS classes for visualizing an issue state
 *
 * Returns classes for both the status indicator circle and text elements
 * to maintain consistent styling across the application.
 *
 * @param state - The state value code (e.g., 'new', 'to_do', 'in_progress', 'done')
 */
export const getStateColorClasses = (state: string): { circle: string; text: string } => {
  switch (state) {
    case 'new':
      return {
        circle: 'bg-background border-slate-400',
        text: 'text-slate-700'
      };
    case 'to_do':
      return {
        circle: 'bg-secondary border-secondary-foreground/30',
        text: 'text-secondary-foreground font-medium'
      };
    case 'in_progress':
      return {
        circle: 'bg-primary border-primary-600',
        text: 'text-primary-700 font-medium'
      };
    case 'done':
      return {
        circle: 'bg-emerald-500 border-emerald-600',
        text: 'text-emerald-700 font-medium'
      };
    default:
      return {
        circle: 'bg-slate-200 border-slate-300',
        text: 'text-muted-foreground'
      };
  }
};

/**
 * Filters and sorts issues based on provided criteria
 *
 * This utility function handles all the data manipulation logic for issue lists,
 * including search term filtering, state filtering, assignee filtering, and
 * custom sorting by any issue property.
 *
 * @param issues - The array of issues to filter and sort
 * @param searchTerm - The search string to filter by (matched against title, summary, and code)
 * @param filters - Object containing filter criteria for state and assignee
 * @param sortConfig - Configuration for sorting, including the property key and direction
 */
export const filterAndSortIssues = (
    issues: IssueFull[],
    searchTerm: string,
    filters: { state: string | null; assignee: string | null },
    sortConfig: { key: keyof IssueFull | null; direction: 'asc' | 'desc' }
): IssueFull[] => {
  // TODO (NL): Implementovat validaci vstupních dat
  // TODO (NL): Implementovat error handling pro API volání
  // TODO (NL): Implementovat loading stavy pro asynchronní operace
  // TODO (NL): Implementovat offline podporu
  // TODO (NL): Implementovat real-time aktualizace
  // TODO (NL): Implementovat optimalizaci pro velké množství issues
  // TODO (NL): Implementovat lazy loading pro dlouhé seznamy
  // TODO (NL): Implementovat caching pro často používaná data
  // TODO (NL): Implementovat debouncing pro vyhledávání a filtrování

  let filteredIssues = [...issues];

  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    filteredIssues = filteredIssues.filter(issue =>
        (issue.title?.toLowerCase().includes(lowerSearchTerm) ||
            issue.summary?.toLowerCase().includes(lowerSearchTerm) ||
            issue.code.toLowerCase().includes(lowerSearchTerm))
    );
  }

  if (filters.state) {
    filteredIssues = filteredIssues.filter(issue => issue.state === filters.state);
  }

  if (filters.assignee) {
    filteredIssues = filteredIssues.filter(issue => issue.assignee === filters.assignee);
  }

  if (sortConfig.key) {
    filteredIssues.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof IssueFull];
      const bValue = b[sortConfig.key as keyof IssueFull];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;

      const aStr = String(aValue);
      const bStr = String(bValue);

      if (aStr < bStr) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aStr > bStr) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  return filteredIssues;
};

/**
 * Checks if there are any active filters applied
 *
 * @param filters - The current filter object
 */
export const hasActiveFilters = (filters: { state: string | null; assignee: string | null }): boolean => {
  return filters.state !== null || filters.assignee !== null;
};
