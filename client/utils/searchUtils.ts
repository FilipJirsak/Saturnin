import type { ProjectWithIssues, IssueFull } from "~/types";
import {ReactNode, DragEvent} from "react";

/**
 * Interface representing a search result with consistent structure
 * regardless of the source type (issue, project, page, file, URL, or create-issue).
 */
// TODO (NL): Rozšířit typ SearchResult o další metadata pro lepší vyhledávání
export interface SearchResult {
  id: string;
  type: "issue" | "project" | "page" | "file" | "url" | "create-issue";
  title: string;
  subtitle?: string;
  url?: string;
  projectCode?: string;
  issueCode?: string;
  icon?: ReactNode;
  matchScore?: number;
}

/**
 * Extracts all issues from all projects and attaches project code to each issue.
 * This flattens the project-issue hierarchy for easier searching.
 *
 * @param projects - Array of projects with nested issues
 * @returns Flattened array of issues with project code attached
 */
// TODO (NL): Optimalizovat výkon při velkém množství issues
export function extractAllIssues(projects: ProjectWithIssues[]): (IssueFull & { projectCode: string })[] {
  return projects.reduce<(IssueFull & { projectCode: string })[]>((acc, project) => {
    if (project.issues && Array.isArray(project.issues)) {
      const issuesWithProject = project.issues.map(issue => ({
        ...issue,
        projectCode: project.code
      }));
      return [...acc, ...issuesWithProject];
    }
    return acc;
  }, []);
}

/**
 * Validates if a string is a properly formatted URL.
 *
 * @param urlString - The string to validate as URL
 * @returns Boolean indicating if the string is a valid URL
 */
export function isValidUrl(urlString: string): boolean {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
}

/**
 * Determines if the input is likely a file path.
 * This is a simple heuristic that checks for file extensions.
 *
 * @param input - The string to check
 * @returns Boolean indicating if the string looks like a file path
 */
// TODO (NL): Rozšířit seznam podporovaných přípon souborů
export function isLikelyFilePath(input: string): boolean {
  const fileExtensions = [
    '.txt', '.pdf', '.doc', '.docx', '.xls', '.xlsx',
    '.ppt', '.pptx', '.csv', '.json', '.xml', '.html',
    '.js', '.ts', '.jsx', '.tsx', '.css', '.scss',
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.mp4', '.mp3'
  ];

  return fileExtensions.some(ext => input.toLowerCase().endsWith(ext));
}

/**
 * Determines the search type based on input content.
 * Classifies the input as either text, URL, or potential file path.
 *
 * @param input - The search input to classify
 * @returns The determined search type ('text', 'url', or 'file')
 */
// TODO (NL): Implementovat pokročilou detekci typu vyhledávání
export function determineSearchType(input: string): 'text' | 'url' | 'file' {
  if (!input || input.trim().length === 0) {
    return 'text';
  }

  if (isValidUrl(input)) {
    return 'url';
  }

  if (isLikelyFilePath(input)) {
    return 'file';
  }

  return 'text';
}

/**
 * Performs text-based search within projects and issues.
 * This is a client-side implementation that should eventually be replaced
 * with a backend API call for full-text search functionality.
 *
 * @param query - The search query
 * @param projects - Array of projects to search within
 * @param options - Search options including limit counts
 * @returns Array of search results matching the query
 */
// TODO (NL): Implementovat fulltextové vyhledávání na backendu
export function performTextSearch(
    query: string,
    projects: ProjectWithIssues[],
    options: {
      issueLimit?: number,
      projectLimit?: number
    } = { issueLimit: 5, projectLimit: 3 }
): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  const searchQuery = query.toLowerCase().trim();
  const allIssues = extractAllIssues(projects);
  const results: SearchResult[] = [];

  const matchingIssues = allIssues.filter(issue =>
      (issue.title && issue.title.toLowerCase().includes(searchQuery)) ||
      issue.code.toLowerCase().includes(searchQuery) ||
      (issue.description && issue.description.toLowerCase().includes(searchQuery)) ||
      (issue.summary && issue.summary.toLowerCase().includes(searchQuery))
  ).slice(0, options.issueLimit);

  matchingIssues.forEach(issue => {
    const project = projects.find(p => p.code === issue.projectCode);
    results.push({
      id: issue.code,
      type: "issue",
      title: issue.title || issue.summary || issue.code,
      subtitle: `${project?.title || issue.projectCode} • ${issue.code}`,
      issueCode: issue.code,
      projectCode: issue.projectCode,
      matchScore: 0.9 // TODO (NL): Zatím pouze simulace relevance skóre
    });
  });

  const matchingProjects = projects.filter(project =>
      project.title.toLowerCase().includes(searchQuery) ||
      project.code.toLowerCase().includes(searchQuery)
  ).slice(0, options.projectLimit);

  matchingProjects.forEach(project => {
    results.push({
      id: project.code,
      type: "project",
      title: project.title,
      subtitle: `Projekt • ${project.code}`,
      projectCode: project.code,
      matchScore: 0.8 // TODO (NL): Zatím pouze simulace relevance skóre
    });
  });

  return results;
}

/**
 * Handles file drop events and extracts relevant information.
 * This function processes files dropped by the user for search purposes.
 *
 * @param event - The drop event containing files
 * @returns Information about the dropped file for search
 */
// TODO (NL): Přidat podporu pro více souborů najednou
export function handleFileDropForSearch(event: DragEvent): {
  fileName: string,
  fileType: string,
  fileSize: number
} | null {
  if (!event.dataTransfer.files || event.dataTransfer.files.length === 0) {
    return null;
  }

  const file = event.dataTransfer.files[0];
  return {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size
  };
}

/**
 * Extracts URL from drop event data.
 * This function checks if the drop event contains a valid URL.
 *
 * @param event - The drop event to extract URL from
 * @returns The URL if found and valid, otherwise null
 */
// TODO (NL): Přidat podporu pro více formátů URL
export function extractUrlFromDrop(event: DragEvent): string | null {
  const text = event.dataTransfer.getData("text");

  if (text && isValidUrl(text)) {
    return text;
  }

  return null;
}
