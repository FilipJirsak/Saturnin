import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BreadcrumbItem } from "~/types/navigation";
import {PATH_TRANSLATIONS} from "~/lib/constants";

/**
 * Merges Tailwind CSS classes using clsx and tailwind-merge.
 *
 * @param inputs - Array of class values to be merged
 * @returns String of merged and optimized Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Gets the title of a navigation item based on path.
 *
 * @param path - Current path to match against navigation items
 * @param navItems - Array of navigation items to search through
 * @returns The title of the matching navigation item or null if not found
 */
const getNavItemTitle = (path: string, navItems: any[]): string | null => {
  if (path === '') return 'Inbox';

  const lastSegment = path.split('/').pop() || '';
  if (PATH_TRANSLATIONS[lastSegment]) {
    return PATH_TRANSLATIONS[lastSegment];
  }

  for (const item of navItems) {
    if (item.url === '/' + path) {
      return item.title;
    }

    if (item.items) {
      for (const subItem of item.items) {
        const urlPath = subItem.url.slice(1);
        if (urlPath === path) {
          return subItem.title;
        }
      }
    }
  }

  return null;
}

/**
 * Checks if the current path belongs to the "Dashboard" section.
 * Returns true only for Statistics and Activities pages.
 *
 * @param path - The current application path to check
 * @returns A boolean indicating whether the path is part of the Dashboard section
 */
const isPathUnderDashboard = (path: string): boolean => {
  return path === '/statistics' || path === '/activities';
}

/**
 * Checks if the current path is in the profile settings section.
 *
 * @param path - The current application path to check
 * @returns A boolean indicating whether the path is in the profile settings section
 */
const isPathUnderProfileSettings = (path: string): boolean => {
  return path.startsWith('/settings/profile/');
}

/**
 * Generates breadcrumb navigation items based on the current pathname.
 *
 * @param pathname - Current pathname from router
 * @param navItems - Array of navigation items to generate breadcrumbs from
 * @returns Array of BreadcrumbItem objects representing the navigation path
 */
export const getBreadcrumbs = (pathname: string, navItems: any[]): BreadcrumbItem[] => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  if (pathname === '/') {
    breadcrumbs.push({
      label: 'Inbox',
      path: '/',
      isLast: true
    });
    return breadcrumbs;
  }

  else if (isPathUnderDashboard(pathname)) {
    breadcrumbs.push({
      label: PATH_TRANSLATIONS['dashboard'] || 'Přehled',
      path: '/dashboard',
      isLast: false
    });

    const title = getNavItemTitle(paths[0], navItems);
    breadcrumbs.push({
      label: title || paths[0].charAt(0).toUpperCase() + paths[0].slice(1),
      path: pathname,
      isLast: true
    });
  }

  else if (isPathUnderProfileSettings(pathname)) {
    breadcrumbs.push({
      label: PATH_TRANSLATIONS['settings'] || 'Nastavení',
      path: '/settings',
      isLast: false
    });

    breadcrumbs.push({
      label: PATH_TRANSLATIONS['profile'] || 'Profil',
      path: '/settings/profile',
      isLast: false
    });

    if (paths.length > 2) {
      const sectionKey = paths[2];
      const sectionLabel = PATH_TRANSLATIONS[sectionKey] ||
          sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);

      breadcrumbs.push({
        label: sectionLabel,
        path: pathname,
        isLast: true
      });
    }
  }

  else {
    let currentPath = '';

    for (let i = 0; i < paths.length; i++) {
      currentPath += '/' + paths[i];

      let segmentLabel = '';

      if (PATH_TRANSLATIONS[paths[i]]) {
        segmentLabel = PATH_TRANSLATIONS[paths[i]];
      }
      else {
        const navTitle = getNavItemTitle(currentPath.slice(1), navItems);
        if (navTitle) {
          segmentLabel = navTitle;
        } else {
          segmentLabel = paths[i].charAt(0).toUpperCase() + paths[i].slice(1);
        }
      }

      breadcrumbs.push({
        label: segmentLabel,
        path: currentPath,
        isLast: i === paths.length - 1
      });
    }
  }

  return breadcrumbs;
};

/**
 * Gets the initials of a name.
 *
 * @param name - Name to get initials from
 * @returns Initials of the name
 */
export const getInitials = (name: string): string => {
  return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
};

/**
 * Truncates text to a specified length and adds ellipsis if necessary.
 *
 * @param text
 * @param maxLength
 */
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
