import {
  type Activity,
  type ActivityType
} from '~/types/dashboard';
import {
  ACTIVITY_TYPES,
  ACTIVITY_TABS
} from '~/lib/constants';

/**
 * Filters activities based on a search query.
 *
 * This function filters the provided activities array by checking if the search query
 * is included in the activity's title, description, or user name. The search is case-insensitive.
 * If no search query is provided, all activities are returned.
 *
 * @param activities - Array of activities to filter
 * @param searchQuery - The search query string to filter by
 */
export function filterActivitiesBySearch(
    activities: Activity[],
    searchQuery: string
): Activity[] {
  if (!searchQuery) return activities;

  const query = searchQuery.toLowerCase();
  return activities.filter(activity =>
      activity.title.toLowerCase().includes(query) ||
      activity.description.toLowerCase().includes(query) ||
      activity.user.name.toLowerCase().includes(query)
  );
}

/**
 * Filters activities based on the selected dashboard tab.
 *
 * This function filters activities according to the currently selected tab:
 * - Issues tab: Returns only issue-type activities
 * - Knowledge tab: Returns document, concept, and mindmap type activities
 * - Messages tab: Returns only message-type activities
 * - Recent tab (default): Returns all activities without filtering
 *
 * @param activities - Array of activities to filter
 * @param selectedTab - The currently selected dashboard tab
 */
export function filterActivitiesByTab(
    activities: Activity[],
    selectedTab: string
): Activity[] {
  switch (selectedTab) {
    case ACTIVITY_TABS.ISSUES:
      return activities.filter(activity => activity.type === ACTIVITY_TYPES.ISSUE);
    case ACTIVITY_TABS.KNOWLEDGE:
      return activities.filter(activity =>
          [ACTIVITY_TYPES.DOCUMENT, ACTIVITY_TYPES.CONCEPT, ACTIVITY_TYPES.MINDMAP].includes(activity.type as ActivityType)
      );
    case ACTIVITY_TABS.MESSAGES:
      return activities.filter(activity => activity.type === ACTIVITY_TYPES.MESSAGE);
    case ACTIVITY_TABS.RECENT:
    default:
      return activities;
  }
}

/**
 * Sorts activities by date in descending order (newest first).
 *
 * This function creates a new array with sorted activities based on their timestamps,
 * returning the most recent activities first.
 *
 * @param activities - Array of activities to sort
 */
export function sortActivitiesByDate(activities: Activity[]): Activity[] {
  return [...activities].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Gets the most recent issues from the activities array.
 *
 * This function filters for activities of type ISSUE, sorts them by timestamp
 * in descending order, and returns up to the specified limit.
 *
 * @param activities - Array of activities to filter and sort
 * @param limit - Maximum number of issues to return (default: 3)
 */
export function getLatestIssues(activities: Activity[], limit: number = 3): Activity[] {
  return activities
      .filter(a => a.type === ACTIVITY_TYPES.ISSUE)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
}

/**
 * Creates a consistent tooltip style object for charts.
 *
 * This function returns an object with styling properties for tooltips used in
 * dashboard charts, using CSS variables for theme consistency.
 */
export function createTooltipStyle() {
  return {
    backgroundColor: 'hsl(var(--background))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '6px',
    fontSize: '12px'
  };
}

/**
 * Returns configuration for chart axes.
 *
 * This function provides standardized styling for chart axes with
 * consistent colors, font sizes, and spacing.
 */
export function getAxisConfig() {
  return {
    stroke: 'hsl(var(--muted-foreground))',
    fontSize: 12,
    tickMargin: 8
  };
}

/**
 * Returns configuration for chart grids.
 *
 * This function provides standardized styling for chart grid lines with
 * consistent colors and dashed line styling.
 */
export function getGridConfig() {
  return {
    strokeDasharray: '3 3',
    stroke: 'hsl(var(--border))'
  };
}
