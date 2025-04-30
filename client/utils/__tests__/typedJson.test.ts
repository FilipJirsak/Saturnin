import { describe, expect, it } from "vitest";
import { typedJson } from "~/utils/typedJson";

describe("typedJson", () => {
  it("should create a Response with JSON data", async () => {
    const data = { message: "test" };
    const response = typedJson(data);

    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get("Content-Type")).toBe("application/json");

    const json = await response.json();
    expect(json).toEqual(data);
  });

  it("should handle numeric status code", () => {
    const data = { message: "test" };
    const response = typedJson(data, 201);

    expect(response.status).toBe(201);
    expect(response.headers.get("Content-Type")).toBe("application/json");
  });

  it("should handle ResponseInit object", () => {
    const data = { message: "test" };
    const init = {
      status: 404,
      headers: {
        "X-Custom-Header": "value",
      },
    };
    const response = typedJson(data, init);

    expect(response.status).toBe(404);
    expect(response.headers.get("Content-Type")).toBe("application/json");
    expect(response.headers.get("X-Custom-Header")).toBe("value");
  });

  it("should preserve existing headers when using ResponseInit", () => {
    const data = { message: "test" };
    const init = {
      headers: {
        "Content-Type": "application/xml",
      },
    };
    const response = typedJson(data, init);

    expect(response.headers.get("Content-Type")).toBe("application/json");
  });
});
