import { IssueFull } from "~/types";

//TODO (NL): Refactor!!!

/**
 * Represents a calendar event derived from an issue
 */
export type CalendarEvent = {
  /** Unique identifier for the event */
  id: string;
  /** Display name of the event */
  name: string;
  /** Formatted time string (e.g. "14:30") */
  time: string;
  /** ISO datetime string */
  datetime: string;
  /** URL or anchor reference for the event */
  href: string;
  /** CSS class string for styling based on event state */
  colorClass: string;
};

/**
 * Represents a single day in the calendar
 */
export type CalendarDay = {
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  /** Whether this day is in the currently displayed month */
  isCurrentMonth?: boolean;
  /** Whether this day is today */
  isToday?: boolean;
  /** Whether this day is currently selected */
  isSelected?: boolean;
  /** Events scheduled for this day */
  events: CalendarEvent[];
};

/**
 * Helper function to get local date string in YYYY-MM-DD format
 * This function returns a date in the local timezone without UTC conversion
 *
 * @param date - The date object to convert to local date string
 * @returns A string in YYYY-MM-DD format representing the date in local timezone
 */
export function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

//TODO (NL): Upravit, aby se používalo datum vytvoření issue
/**
 * Converts an issue to a calendar event
 *
 * @param issue - The issue to convert
 * @returns A calendar event representation of the issue
 */
export function issueToEvent(issue: IssueFull): CalendarEvent {
  const stateColorMap: Record<string, string> = {
    'new': 'bg-blue-50 text-blue-700 hover:bg-blue-100 group-hover:text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30 dark:group-hover:text-blue-200',
    'to_do': 'bg-amber-50 text-amber-700 hover:bg-amber-100 group-hover:text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/30 dark:group-hover:text-amber-200',
    'in_progress': 'bg-purple-50 text-purple-700 hover:bg-purple-100 group-hover:text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/30 dark:group-hover:text-purple-200',
    'done': 'bg-green-50 text-green-700 hover:bg-green-100 group-hover:text-green-700 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30 dark:group-hover:text-green-200',
  };

  try {
    let date;
    let time;

    if (issue.last_modified && !isNaN(new Date(issue.last_modified).getTime())) {
      date = new Date(issue.last_modified);

      const fixedHour = 9;
      const fixedMinute = 0;

      time = `${fixedHour.toString().padStart(2, '0')}:${fixedMinute.toString().padStart(2, '0')}`;

      date.setHours(fixedHour, fixedMinute, 0, 0);
    } else {
      date = new Date();
      date.setHours(9, 0, 0, 0);
      time = "09:00";
    }

    return {
      id: issue.code,
      name: issue.title || issue.summary || "Bez názvu",
      time: time,
      datetime: date.toISOString(),
      href: `#issue-${issue.code}`,
      colorClass: stateColorMap[issue.state] || 'bg-surface-50 text-surface-700 hover:bg-surface-100 group-hover:text-surface-900 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700 dark:group-hover:text-surface-100'
    };
  } catch (error) {
    console.warn("Chyba při zpracování data pro issue:", issue.code, error);
    const date = new Date();
    date.setHours(9, 0, 0, 0);

    return {
      id: issue.code,
      name: issue.title || issue.summary || "Bez názvu",
      time: "09:00",
      datetime: date.toISOString(),
      href: `#issue-${issue.code}`,
      colorClass: stateColorMap[issue.state] || 'bg-surface-50 text-surface-700 hover:bg-surface-100 group-hover:text-surface-900 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700 dark:group-hover:text-surface-100'
    };
  }
}

/**
 * Generates an array of days for the month containing the specified date
 *
 * @param currentDate - The date for which to generate the month view
 * @param calendarEvents - Array of events to distribute among the days
 * @returns Array of CalendarDay objects representing the days in the month view
 */
export function getDaysInMonth(currentDate: Date, calendarEvents: CalendarEvent[]): CalendarDay[] {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const dayOfWeek = firstDay.getDay();
  const startOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const startDay = new Date(year, month, 1 - startOffset);

  const lastDay = new Date(year, month + 1, 0);
  const endDayOfWeek = lastDay.getDay();
  const endOffset = endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek;
  const endDay = new Date(year, month + 1, endOffset);

  const days: CalendarDay[] = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = getLocalDateString(today);

  const currentDateString = getLocalDateString(currentDate);

  const currentDay = new Date(startDay);
  while (currentDay <= endDay) {
    const dateString = getLocalDateString(currentDay);

    const dayEvents = calendarEvents.filter(event => {
      try {
        const eventDate = new Date(event.datetime);
        if (isNaN(eventDate.getTime())) {
          return false;
        }
        return getLocalDateString(eventDate) === dateString;
      } catch (error) {
        console.warn("Invalid date format:", event.datetime);
        return false;
      }
    });

    days.push({
      date: dateString,
      isCurrentMonth: currentDay.getMonth() === month,
      isToday: dateString === todayString,
      isSelected: dateString === currentDateString,
      events: dayEvents
    });

    currentDay.setDate(currentDay.getDate() + 1);
  }

  return days;
}

/**
 * Formats the current date based on the view type
 *
 * @param viewType - The current calendar view (month, week, or day)
 * @param currentDate - The date to format
 * @returns Formatted date string appropriate for the view type
 */
export function formatCurrentDate(viewType: 'month' | 'week' | 'day', currentDate: Date): string {
  if (viewType === 'month') {
    return currentDate.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' });
  } else if (viewType === 'week') {
    const day = currentDate.getDay() || 7;
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() - day + 1);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const mondayFormat = monday.toLocaleDateString('cs-CZ', { day: 'numeric' });
    const sundayFormat = sunday.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

    return `${mondayFormat} - ${sundayFormat}`;
  } else {
    return currentDate.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}

/**
 * Gets an array representing days of the week for the week containing the specified date
 *
 * @param currentDate - The date for which to get the week days
 * @returns Array of objects representing each day of the week
 */
export function getWeekDays(currentDate: Date) {
  const weekDays = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
  const weekDaysFull = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'];

  const currentDayOfWeek = currentDate.getDay();
  const mondayOffset = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  const monday = new Date(currentDate);
  monday.setDate(currentDate.getDate() - mondayOffset);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = getLocalDateString(today);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateString = getLocalDateString(date);

    return {
      date: dateString,
      day: weekDays[i],
      dayFull: weekDaysFull[i],
      isToday: dateString === todayString
    };
  });
}

/**
 * Navigates to a new date based on the current view type and direction
 *
 * @param currentDate - The current date
 * @param viewType - The current view type (month, week, or day)
 * @param direction - Direction to navigate (previous or next)
 * @returns A new Date object representing the target date
 */
export function navigateDate(currentDate: Date, viewType: 'month' | 'week' | 'day', direction: 'prev' | 'next'): Date {
  const newDate = new Date(currentDate);

  if (viewType === 'month') {
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
  } else if (viewType === 'week') {
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
  } else {
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
  }

  return newDate;
}
