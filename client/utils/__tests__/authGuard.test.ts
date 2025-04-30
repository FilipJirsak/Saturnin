import { describe, expect, it, vi } from "vitest";
import { requireAuth, requireGuest } from "~/utils/authGuard";
import { redirect } from "@remix-run/node";

vi.mock("@remix-run/node", () => ({
  redirect: vi.fn(),
}));

describe("authGuard", () => {
  describe("requireAuth", () => {
    it("should redirect to login when not authenticated", async () => {
      const mockRequest = new Request("http://localhost/test?simulateAuth=false");
      const mockArgs = { request: mockRequest } as any;

      await requireAuth(mockArgs);
      expect(redirect).toHaveBeenCalledWith("/login?redirectTo=%2Ftest");
    });

    it("should return userId when authenticated", async () => {
      const mockRequest = new Request("http://localhost/test?simulateAuth=true");
      const mockArgs = { request: mockRequest } as any;

      const result = await requireAuth(mockArgs);
      expect(result).toEqual({ userId: "user-123" });
    });
  });

  describe("requireGuest", () => {
    it("should redirect to home when authenticated", async () => {
      const mockRequest = new Request("http://localhost/login?simulateAuth=true");
      const mockArgs = { request: mockRequest } as any;

      await requireGuest(mockArgs);
      expect(redirect).toHaveBeenCalledWith("/");
    });

    it("should return null when not authenticated", async () => {
      const mockRequest = new Request("http://localhost/login?simulateAuth=false");
      const mockArgs = { request: mockRequest } as any;

      const result = await requireGuest(mockArgs);
      expect(result).toBeNull();
    });
  });
});
