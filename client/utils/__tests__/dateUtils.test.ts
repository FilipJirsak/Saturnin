import { describe, expect, it } from "vitest";
import { filterRecentItems, formatDate, formatRelativeTime, isWithinLastDays } from "~/utils/dateUtils";

describe("dateUtils", () => {
  describe("formatDate", () => {
    it("should format valid date correctly", () => {
      const date = "2024-01-01T00:00:00Z";
      expect(formatDate(date)).toBe("1. ledna 2024");
    });

    it("should handle undefined date", () => {
      expect(formatDate(undefined)).toBe("Není nastaveno");
    });

    it("should handle null date", () => {
      expect(formatDate(null)).toBe("Není nastaveno");
    });

    it("should handle invalid date", () => {
      expect(formatDate("invalid-date")).toBe("Neplatné datum");
    });
  });

  describe("formatRelativeTime", () => {
    it("should format recent date correctly", () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const result = formatRelativeTime(oneHourAgo.toISOString());
      expect(result).toContain("před");
      expect(result).toContain("hodinou");
    });

    it("should handle undefined date", () => {
      expect(formatRelativeTime(undefined)).toBe("Není nastaveno");
    });

    it("should handle null date", () => {
      expect(formatRelativeTime(null)).toBe("Není nastaveno");
    });

    it("should handle invalid date", () => {
      expect(formatRelativeTime("invalid-date")).toBe("Neplatné datum");
    });
  });

  describe("isWithinLastDays", () => {
    it("should return true for date within last 7 days", () => {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      expect(isWithinLastDays(threeDaysAgo.toISOString())).toBe(true);
    });

    it("should return false for date older than 7 days", () => {
      const now = new Date();
      const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
      expect(isWithinLastDays(tenDaysAgo.toISOString())).toBe(false);
    });

    it("should handle custom number of days", () => {
      const now = new Date();
      const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
      expect(isWithinLastDays(fiveDaysAgo.toISOString(), 4)).toBe(false);
      expect(isWithinLastDays(fiveDaysAgo.toISOString(), 6)).toBe(true);
    });

    it("should handle undefined date", () => {
      expect(isWithinLastDays(undefined)).toBe(false);
    });

    it("should handle null date", () => {
      expect(isWithinLastDays(null)).toBe(false);
    });

    it("should handle invalid date", () => {
      expect(isWithinLastDays("invalid-date")).toBe(false);
    });
  });

  describe("filterRecentItems", () => {
    const mockItems = [
      { last_modified: new Date().toISOString() },
      { last_modified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { last_modified: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    ];

    it("should filter items within last 7 days by default", () => {
      const recentItems = filterRecentItems(mockItems);
      expect(recentItems).toHaveLength(2);
    });

    it("should filter items within custom number of days", () => {
      const recentItems = filterRecentItems(mockItems, 5);
      expect(recentItems).toHaveLength(2);
    });

    it("should handle empty array", () => {
      expect(filterRecentItems([])).toHaveLength(0);
    });

    it("should handle items with invalid dates", () => {
      const itemsWithInvalidDates = [
        { last_modified: "invalid-date" },
        { last_modified: new Date().toISOString() },
      ];
      const recentItems = filterRecentItems(itemsWithInvalidDates);
      expect(recentItems).toHaveLength(1);
    });
  });
});
