import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {BreadcrumbItem} from "~/types/navigation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const getNavItemTitle = (path: string, navItems: any[]): string | null => {
  if (path === '') return 'Dashboard';

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

export const getBreadcrumbs = (pathname: string, navItems: any[]): BreadcrumbItem[] => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  breadcrumbs.push({
    label: 'Dashboard',
    path: '/',
    isLast: paths.length === 0
  });

  let currentPath = '';
  for (let i = 0; i < paths.length; i++) {
    currentPath += '/' + paths[i];
    const title = getNavItemTitle(paths.slice(0, i + 1).join('/'), navItems);

    breadcrumbs.push({
      label: title || paths[i].charAt(0).toUpperCase() + paths[i].slice(1),
      path: currentPath,
      isLast: i === paths.length - 1
    });
  }

  return breadcrumbs;
};
