import { format, formatDistance, isAfter, subDays, isValid } from "date-fns";
import { cs } from "date-fns/locale";

/**
 * Formats a date string into a localized full date format.
 *
 * @param dateString - ISO string date to format
 * @param locale - Optional locale object for formatting (defaults to Czech)
 * @returns Formatted date string (e.g. "23. března 2025")
 */
export const formatDate = (dateString: string | undefined | null, locale = cs): string => {
  if (!dateString) return "Není nastaveno";
  const date = new Date(dateString);
  if (!isValid(date)) return "Neplatné datum";
  return format(date, "d. MMMM yyyy", { locale });
};

/**
 * Formats a date string into a relative time format with suffix.
 *
 * @param dateString - ISO string date to format
 * @param locale - Optional locale object for formatting (defaults to Czech)
 * @returns Formatted relative time (e.g. "před 2 dny", "před 5 minutami")
 */
export const formatRelativeTime = (dateString: string | undefined | null, locale = cs): string => {
  if (!dateString) return "Není nastaveno";
  const date = new Date(dateString);
  if (!isValid(date)) return "Neplatné datum";
  return formatDistance(date, new Date(), { addSuffix: true, locale });
};

/**
 * Checks if a given date is within the last N days.
 *
 * @param dateString - ISO string date to check
 * @param days - Number of days to look back (defaults to 7)
 * @returns Boolean indicating if the date is within the specified period
 */
export const isWithinLastDays = (dateString: string | undefined | null, days = 7): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (!isValid(date)) return false;
  const cutoffDate = subDays(new Date(), days);
  return isAfter(date, cutoffDate);
};

/**
 * Filters an array of objects that have a last_modified date property
 * to only those modified within the last N days.
 *
 * @param items - Array of objects with a last_modified property
 * @param days - Number of days to look back (defaults to 7)
 * @returns Filtered array containing only recent items
 */
export const filterRecentItems = <T extends { last_modified: string }>(
    items: T[],
    days = 7
): T[] => {
  return items.filter(item => isWithinLastDays(item.last_modified, days));
};
