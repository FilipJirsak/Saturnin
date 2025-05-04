import { describe, expect, it } from "vitest";
import {
  determineSearchType,
  extractAllIssues,
  extractUrlFromDrop,
  handleFileDropForSearch,
  isLikelyFilePath,
  isValidUrl,
  performTextSearch,
} from "~/utils/searchUtils";
import type { IssueFull, ProjectWithIssues } from "~/types";

describe("searchUtils", () => {
  describe("extractAllIssues", () => {
    const mockProjects: ProjectWithIssues[] = [
      {
        code: "PROJ1",
        title: "Project 1",
        initial_issue_state: "",
        issues: [
          { code: "ISSUE-1", title: "Issue 1", summary: "Summary 1" } as IssueFull,
          { code: "ISSUE-2", title: "Issue 2", summary: "Summary 2" } as IssueFull,
        ],
      },
      {
        code: "PROJ2",
        title: "Project 2",
        initial_issue_state: "",
        issues: [
          { code: "ISSUE-3", title: "Issue 3", summary: "Summary 3" } as IssueFull,
        ],
      },
    ];

    it("should extract all issues with project codes", () => {
      const issues = extractAllIssues(mockProjects);
      expect(issues).toHaveLength(3);
      expect(issues[0].projectCode).toBe("PROJ1");
      expect(issues[1].projectCode).toBe("PROJ1");
      expect(issues[2].projectCode).toBe("PROJ2");
    });

    it("should handle empty projects array", () => {
      expect(extractAllIssues([])).toHaveLength(0);
    });

    it("should handle projects without issues", () => {
      const projectsWithoutIssues = [
        { code: "PROJ1", title: "Project 1" },
        { code: "PROJ2", title: "Project 2" },
      ];
      expect(extractAllIssues(projectsWithoutIssues as ProjectWithIssues[])).toHaveLength(0);
    });
  });

  describe("isValidUrl", () => {
    it("should validate correct URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://localhost:3000")).toBe(true);
      expect(isValidUrl("ftp://files.example.com")).toBe(true);
    });

    it("should reject invalid URLs", () => {
      expect(isValidUrl("not-a-url")).toBe(false);
      expect(isValidUrl("http://")).toBe(false);
      expect(isValidUrl("")).toBe(false);
    });
  });

  describe("isLikelyFilePath", () => {
    it("should identify file paths with extensions", () => {
      expect(isLikelyFilePath("document.pdf")).toBe(true);
      expect(isLikelyFilePath("image.jpg")).toBe(true);
      expect(isLikelyFilePath("script.js")).toBe(true);
    });

    it("should reject non-file paths", () => {
      expect(isLikelyFilePath("not-a-file")).toBe(false);
      expect(isLikelyFilePath("http://example.com")).toBe(false);
      expect(isLikelyFilePath("")).toBe(false);
    });
  });

  describe("determineSearchType", () => {
    it("should identify URL search type", () => {
      expect(determineSearchType("https://example.com")).toBe("url");
    });

    it("should identify file path search type", () => {
      expect(determineSearchType("document.pdf")).toBe("file");
    });

    it("should default to text search type", () => {
      expect(determineSearchType("regular text")).toBe("text");
      expect(determineSearchType("")).toBe("text");
    });
  });

  describe("performTextSearch", () => {
    const mockProjects: ProjectWithIssues[] = [
      {
        code: "PROJ1",
        title: "Test Project",
        initial_issue_state: "",
        issues: [
          { code: "ISSUE-1", title: "Test Issue", summary: "Test summary" } as IssueFull,
          { code: "ISSUE-2", title: "Another Issue", summary: "Another summary" } as IssueFull,
        ],
      },
    ];

    it("should find matching issues", () => {
      const results = performTextSearch("Test", mockProjects);
      expect(results).toHaveLength(2);
      expect(results[0].type).toBe("issue");
      expect(results[1].type).toBe("project");
    });

    it("should respect result limits", () => {
      const results = performTextSearch("Test", mockProjects, { issueLimit: 1, projectLimit: 1 });
      expect(results).toHaveLength(2);
    });

    it("should return empty array for empty query", () => {
      expect(performTextSearch("", mockProjects)).toHaveLength(0);
    });

    it("should search in multiple fields", () => {
      const results = performTextSearch("summary", mockProjects);
      expect(results).toHaveLength(2);
    });
  });

  describe("handleFileDropForSearch", () => {
    it("should extract file information from drop event", () => {
      const mockEvent = {
        dataTransfer: {
          files: [
            {
              name: "test.pdf",
              type: "application/pdf",
              size: 1024,
            },
          ],
        },
      } as any as DragEvent;

      const result = handleFileDropForSearch(mockEvent as any);
      expect(result).toEqual({
        fileName: "test.pdf",
        fileType: "application/pdf",
        fileSize: 1024,
      });
    });

    it("should return null for empty drop event", () => {
      const mockEvent = {
        dataTransfer: {
          files: [],
        },
      } as any as DragEvent;

      expect(handleFileDropForSearch(mockEvent as any)).toBeNull();
    });
  });

  describe("extractUrlFromDrop", () => {
    it("should extract valid URL from drop event", () => {
      const mockEvent = {
        dataTransfer: {
          getData: () => "https://example.com",
        },
      } as any as DragEvent;

      expect(extractUrlFromDrop(mockEvent as any)).toBe("https://example.com");
    });

    it("should return null for invalid URL", () => {
      const mockEvent = {
        dataTransfer: {
          getData: () => "not-a-url",
        },
      } as any as DragEvent;

      expect(extractUrlFromDrop(mockEvent as any)).toBeNull();
    });
  });
});
