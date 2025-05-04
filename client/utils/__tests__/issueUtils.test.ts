import { describe, expect, it } from "vitest";
import {
  filterAndSortIssues,
  getStateColorClasses,
  getStateLabel,
  getStateVariant,
  hasActiveFilters,
} from "~/utils/issueUtils";
import { ISSUE_STATES } from "~/lib/constants";
import type { IssueFull } from "~/types";

describe("issueUtils", () => {
  describe("getStateLabel", () => {
    it("should return correct label for valid state", () => {
      const state = ISSUE_STATES[0].value;
      expect(getStateLabel(state)).toBe(ISSUE_STATES[0].label);
    });

    it("should return state value for unknown state", () => {
      const unknownState = "unknown_state";
      expect(getStateLabel(unknownState)).toBe(unknownState);
    });
  });

  describe("getStateVariant", () => {
    it("should return correct variant for each state", () => {
      expect(getStateVariant("new")).toBe("outline");
      expect(getStateVariant("to_do")).toBe("secondary");
      expect(getStateVariant("in_progress")).toBe("default");
      expect(getStateVariant("done")).toBe("success");
    });

    it("should return outline for unknown state", () => {
      expect(getStateVariant("unknown_state")).toBe("outline");
    });
  });

  describe("getStateColorClasses", () => {
    it("should return correct classes for each state", () => {
      const newState = getStateColorClasses("new");
      expect(newState.circle).toBe("bg-background border-slate-400");
      expect(newState.text).toBe("text-slate-700");

      const todoState = getStateColorClasses("to_do");
      expect(todoState.circle).toBe("bg-secondary border-secondary-foreground/30");
      expect(todoState.text).toBe("text-secondary-foreground font-medium");

      const inProgressState = getStateColorClasses("in_progress");
      expect(inProgressState.circle).toBe("bg-primary border-primary-600");
      expect(inProgressState.text).toBe("text-primary-700 font-medium");

      const doneState = getStateColorClasses("done");
      expect(doneState.circle).toBe("bg-emerald-500 border-emerald-600");
      expect(doneState.text).toBe("text-emerald-700 font-medium");
    });

    it("should return default classes for unknown state", () => {
      const unknownState = getStateColorClasses("unknown_state");
      expect(unknownState.circle).toBe("bg-slate-200 border-slate-300");
      expect(unknownState.text).toBe("text-muted-foreground");
    });
  });

  describe("filterAndSortIssues", () => {
    const mockIssues: IssueFull[] = [
      {
        code: "TEST-1",
        title: "Test Issue 1",
        summary: "First test issue",
        state: "new",
        assignee: "user1",
        last_modified: "2024-01-01T00:00:00Z",
      },
      {
        code: "TEST-2",
        title: "Test Issue 2",
        summary: "Second test issue",
        state: "in_progress",
        assignee: "user2",
        last_modified: "2024-01-02T00:00:00Z",
      },
      {
        code: "TEST-3",
        title: "Another Issue",
        summary: "Third test issue",
        state: "done",
        assignee: "user1",
        last_modified: "2024-01-03T00:00:00Z",
      },
    ];

    it("should filter by search term", () => {
      const result = filterAndSortIssues(
        mockIssues,
        "Another",
        { state: null, assignee: null },
        { key: null, direction: "asc" },
      );
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe("TEST-3");
    });

    it("should filter by state", () => {
      const result = filterAndSortIssues(
        mockIssues,
        "",
        { state: "new", assignee: null },
        { key: null, direction: "asc" },
      );
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe("TEST-1");
    });

    it("should filter by assignee", () => {
      const result = filterAndSortIssues(
        mockIssues,
        "",
        { state: null, assignee: "user1" },
        { key: null, direction: "asc" },
      );
      expect(result).toHaveLength(2);
      expect(result.map((i) => i.code)).toEqual(["TEST-1", "TEST-3"]);
    });

    it("should sort by title ascending", () => {
      const result = filterAndSortIssues(
        mockIssues,
        "",
        { state: null, assignee: null },
        { key: "title", direction: "asc" },
      );
      expect(result.map((i) => i.code)).toEqual(["TEST-3", "TEST-1", "TEST-2"]);
    });

    it("should sort by last_modified descending", () => {
      const result = filterAndSortIssues(
        mockIssues,
        "",
        { state: null, assignee: null },
        { key: "last_modified", direction: "desc" },
      );
      expect(result.map((i) => i.code)).toEqual(["TEST-3", "TEST-2", "TEST-1"]);
    });
  });

  describe("hasActiveFilters", () => {
    it("should return false when no filters are active", () => {
      expect(hasActiveFilters({ state: null, assignee: null })).toBe(false);
    });

    it("should return true when state filter is active", () => {
      expect(hasActiveFilters({ state: "new", assignee: null })).toBe(true);
    });

    it("should return true when assignee filter is active", () => {
      expect(hasActiveFilters({ state: null, assignee: "user1" })).toBe(true);
    });

    it("should return true when both filters are active", () => {
      expect(hasActiveFilters({ state: "new", assignee: "user1" })).toBe(true);
    });
  });
});
