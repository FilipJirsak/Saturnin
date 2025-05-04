import { describe, expect, it } from "vitest";
import {
  formatCurrentDate,
  getDaysInMonth,
  getLocalDateString,
  getWeekDays,
  issueToEvent,
  navigateDate,
} from "~/utils/calendarUtils";
import type { IssueFull } from "~/types";

describe("calendarUtils", () => {
  describe("getLocalDateString", () => {
    it("should format date correctly", () => {
      const date = new Date("2024-01-01T00:00:00Z");
      expect(getLocalDateString(date)).toBe("2024-01-01");
    });

    it("should handle single digit months and days", () => {
      const date = new Date("2024-09-05T00:00:00Z");
      expect(getLocalDateString(date)).toBe("2024-09-05");
    });
  });

  describe("issueToEvent", () => {
    const mockIssue: IssueFull = {
      code: "TEST-1",
      title: "Test Issue",
      summary: "Test summary",
      state: "new",
      last_modified: "2024-01-01T14:30:00Z",
    };

    it("should convert issue to event with correct properties", () => {
      const event = issueToEvent(mockIssue);
      expect(event.id).toBe("TEST-1");
      expect(event.name).toBe("Test Issue");
      expect(event.time).toBe("15:30");
      expect(event.href).toBe("#issue-TEST-1");
      expect(event.colorClass).toContain("bg-blue-50");
    });

    it("should handle missing last_modified date", () => {
      const issueWithoutDate = { ...mockIssue, last_modified: "" };
      const event = issueToEvent(issueWithoutDate);
      expect(event.time).toBe("09:00");
    });

    it("should handle invalid date", () => {
      const issueWithInvalidDate = { ...mockIssue, last_modified: "invalid-date" };
      const event = issueToEvent(issueWithInvalidDate);
      expect(event.time).toBe("09:00");
    });

    it("should use summary as fallback for title", () => {
      const issueWithoutTitle = { ...mockIssue, title: "" };
      const event = issueToEvent(issueWithoutTitle);
      expect(event.name).toBe("Test summary");
    });

    it('should use "Bez názvu" as last resort for name', () => {
      const issueWithoutTitleAndSummary = { ...mockIssue, title: "", summary: "" };
      const event = issueToEvent(issueWithoutTitleAndSummary);
      expect(event.name).toBe("Bez názvu");
    });
  });

  describe("getDaysInMonth", () => {
    it("should generate correct number of days for January 2024", () => {
      const date = new Date("2024-01-01");
      const days = getDaysInMonth(date, []);
      expect(days).toHaveLength(35); // 5 weeks
    });

    it("should mark current month days correctly", () => {
      const date = new Date("2024-01-01");
      const days = getDaysInMonth(date, []);
      const januaryDays = days.filter((day) => day.isCurrentMonth);
      expect(januaryDays).toHaveLength(31);
    });

    it("should mark today correctly", () => {
      const today = new Date();
      const days = getDaysInMonth(today, []);
      const todayDay = days.find((day) => day.isToday);
      expect(todayDay).toBeDefined();
      expect(todayDay?.date).toBe(getLocalDateString(today));
    });

    it("should distribute events to correct days", () => {
      const date = new Date("2024-01-01");
      const events = [
        {
          id: "1",
          name: "Test Event",
          time: "14:30",
          datetime: "2024-01-01T14:30:00Z",
          href: "#test",
          colorClass: "test-class",
        },
      ];
      const days = getDaysInMonth(date, events);
      const dayWithEvent = days.find((day) => day.date === "2024-01-01");
      expect(dayWithEvent?.events).toHaveLength(1);
      expect(dayWithEvent?.events[0].id).toBe("1");
    });
  });

  describe("formatCurrentDate", () => {
    it("should format month view correctly", () => {
      const date = new Date("2024-01-01");
      const result = formatCurrentDate("month", date);
      expect(result).toBe("leden 2024");
    });

    it("should format week view correctly", () => {
      const date = new Date("2024-01-01");
      const result = formatCurrentDate("week", date);
      expect(result).toBe("1. - 7. ledna 2024");
    });

    it("should format day view correctly", () => {
      const date = new Date("2024-01-01");
      const result = formatCurrentDate("day", date);
      expect(result).toBe("1. ledna 2024");
    });
  });

  describe("getWeekDays", () => {
    it("should return 7 days starting from Monday", () => {
      const date = new Date("2024-01-01");
      const weekDays = getWeekDays(date);
      expect(weekDays).toHaveLength(7);
      expect(weekDays[0].day).toBe("Po");
      expect(weekDays[6].day).toBe("Ne");
    });

    it("should mark today correctly", () => {
      const today = new Date();
      const weekDays = getWeekDays(today);
      const todayDay = weekDays.find((day) => day.isToday);
      expect(todayDay).toBeDefined();
      expect(todayDay?.date).toBe(getLocalDateString(today));
    });
  });

  describe("navigateDate", () => {
    it("should navigate month correctly", () => {
      const date = new Date("2024-01-01");
      const nextMonth = navigateDate(date, "month", "next");
      expect(nextMonth.getMonth()).toBe(1);
      expect(nextMonth.getFullYear()).toBe(2024);

      const prevMonth = navigateDate(date, "month", "prev");
      expect(prevMonth.getMonth()).toBe(11);
      expect(prevMonth.getFullYear()).toBe(2023);
    });

    it("should navigate week correctly", () => {
      const date = new Date("2024-01-01");
      const nextWeek = navigateDate(date, "week", "next");
      expect(nextWeek.getDate()).toBe(8);

      const prevWeek = navigateDate(date, "week", "prev");
      expect(prevWeek.getDate()).toBe(25);
    });

    it("should navigate day correctly", () => {
      const date = new Date("2024-01-01");
      const nextDay = navigateDate(date, "day", "next");
      expect(nextDay.getDate()).toBe(2);

      const prevDay = navigateDate(date, "day", "prev");
      expect(prevDay.getDate()).toBe(31);
      expect(prevDay.getMonth()).toBe(11);
    });
  });
});
