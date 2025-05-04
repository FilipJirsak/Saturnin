import { describe, expect, it } from "vitest";
import { cn, darkenColor, generateAvatar, getBreadcrumbs, getInitials, truncateText } from "~/utils/helpers";

describe("helpers", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      const result = cn("class1", "class2");
      expect(result).toBe("class1 class2");
    });

    it("should handle conditional classes", () => {
      const result = cn("base", "conditional");
      expect(result).toBe("base conditional");
    });

    it("should handle empty classes", () => {
      const result = cn("base", false, "");
      expect(result).toBe("base");
    });
  });

  describe("getBreadcrumbs", () => {
    const mockNavItems = [
      {
        title: "Dashboard",
        url: "/dashboard",
        items: [
          { title: "Statistics", url: "/statistics" },
          { title: "Activities", url: "/activities" },
        ],
      },
      {
        title: "Settings",
        url: "/settings",
        items: [
          { title: "Profile", url: "/settings/profile" },
        ],
      },
    ];

    it("should handle root path", () => {
      const breadcrumbs = getBreadcrumbs("/", mockNavItems);
      expect(breadcrumbs).toHaveLength(1);
      expect(breadcrumbs[0]).toEqual({
        label: "Inbox",
        path: "/",
        isLast: true,
      });
    });

    it("should handle dashboard paths", () => {
      const breadcrumbs = getBreadcrumbs("/statistics", mockNavItems);
      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[0]).toEqual({
        label: "Přehled",
        path: "/dashboard",
        isLast: false,
      });
      expect(breadcrumbs[1]).toEqual({
        label: "Statistiky",
        path: "/statistics",
        isLast: true,
      });
    });

    it("should handle profile settings paths", () => {
      const breadcrumbs = getBreadcrumbs("/settings/profile/edit", mockNavItems);
      expect(breadcrumbs).toHaveLength(3);
      expect(breadcrumbs[0]).toEqual({
        label: "Nastavení",
        path: "/settings",
        isLast: false,
      });
      expect(breadcrumbs[1]).toEqual({
        label: "Profil",
        path: "/settings/profile",
        isLast: false,
      });
      expect(breadcrumbs[2]).toEqual({
        label: "Edit",
        path: "/settings/profile/edit",
        isLast: true,
      });
    });

    it("should handle unknown paths", () => {
      const breadcrumbs = getBreadcrumbs("/unknown/path", mockNavItems);
      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[0]).toEqual({
        label: "Unknown",
        path: "/unknown",
        isLast: false,
      });
      expect(breadcrumbs[1]).toEqual({
        label: "Path",
        path: "/unknown/path",
        isLast: true,
      });
    });
  });

  describe("getInitials", () => {
    it("should get initials from full name", () => {
      expect(getInitials("John Doe")).toBe("JD");
    });

    it("should handle single name", () => {
      expect(getInitials("John")).toBe("J");
    });

    it("should handle multiple words", () => {
      expect(getInitials("John Jacob Smith")).toBe("JJS");
    });

    it("should handle empty string", () => {
      expect(getInitials("")).toBe("");
    });
  });

  describe("truncateText", () => {
    it("should truncate text longer than maxLength", () => {
      expect(truncateText("This is a long text", 10)).toBe("This is a ...");
    });

    it("should not truncate text shorter than maxLength", () => {
      expect(truncateText("Short", 10)).toBe("Short");
    });

    it("should handle empty string", () => {
      expect(truncateText("", 10)).toBe("");
    });

    it("should handle text equal to maxLength", () => {
      expect(truncateText("Exactly 10", 10)).toBe("Exactly 10");
    });
  });

  describe("darkenColor", () => {
    it("should darken a color by the default amount", () => {
      expect(darkenColor("#FFFFFF")).toBe("#e1e1e1");
    });

    it("should darken a color by a specified amount", () => {
      expect(darkenColor("#FFFFFF", 50)).toBe("#cdcdcd");
    });

    it("should handle colors without # prefix", () => {
      expect(darkenColor("FF0000", 50)).toBe("#cd0000");
    });

    it("should not allow values below 0", () => {
      expect(darkenColor("#000000", 30)).toBe("#000000");
    });

    it("should handle different color values correctly", () => {
      expect(darkenColor("#3498db", 40)).toBe("#1c80c3");
    });
  });

  describe("generateAvatar", () => {
    it("should generate a valid DiceBear avatar URL", () => {
      const seed = "test-user";
      const avatarUrl = generateAvatar(seed);

      expect(avatarUrl).toContain("https://api.dicebear.com/7.x/avataaars/svg");
      expect(avatarUrl).toContain(`seed=${seed}`);
      expect(avatarUrl).toContain("backgroundType=solid");
    });

    it("should generate different avatars for male and female", () => {
      const seed = "test-user";
      const maleAvatar = generateAvatar(seed, "male");
      const femaleAvatar = generateAvatar(seed, "female");

      expect(maleAvatar).toContain("facialHairProbability=80");
      expect(maleAvatar).toContain("top%5B%5D=shortCurly");
      expect(maleAvatar).toContain("backgroundColor=b6e3f4");

      expect(femaleAvatar).toContain("facialHairProbability=0");
      expect(femaleAvatar).toContain("top%5B%5D=bigHair");
      expect(femaleAvatar).toContain("backgroundColor=ffd5dc");
    });
  });
});
