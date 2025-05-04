import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  deleteMindMap,
  generateMindMapThumbnail,
  getMindMapsFromLocalStorage,
  saveMindMapToLocalStorage,
} from "~/utils/knowledge/mindmapUtils";

if (typeof globalThis.window === "undefined") {
  // @ts-ignore
  globalThis.window = globalThis;
}

if (typeof globalThis.localStorage === "undefined") {
  let store: Record<string, string> = {};
  globalThis.localStorage = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (i: number) => Object.keys(store)[i] ?? null,
    get length() {
      return Object.keys(store).length;
    },
  } as Storage;
}

if (typeof globalThis.sessionStorage === "undefined") {
  let store: Record<string, string> = {};
  globalThis.sessionStorage = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (i: number) => Object.keys(store)[i] ?? null,
    get length() {
      return Object.keys(store).length;
    },
  } as Storage;
}

describe("mindmapUtils", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    // @ts-ignore
    window.__MINDMAPS_DATA = undefined;
  });

  it("generateMindMapThumbnail returns color if present", () => {
    expect(generateMindMapThumbnail({ color: "#fff" })).toBe("#fff");
  });

  it("generateMindMapThumbnail returns a color from NODE_COLORS for title", () => {
    const color = generateMindMapThumbnail({ title: "Test" });
    expect(typeof color).toBe("string");
    expect(color.length > 0).toBe(true);
  });

  it("saveMindMapToLocalStorage and getMindMapsFromLocalStorage work together", () => {
    const mindmap = {
      id: "1",
      title: "Test",
      description: "",
      tags: [],
      thumbnail: "",
      createdAt: "",
      updatedAt: "",
      author: "",
      nodeCount: 1,
      nodes: [],
      connections: [],
      color: "#fff",
      isPublic: false,
      viewMode: "network" as const,
    };
    saveMindMapToLocalStorage(mindmap);
    const maps = getMindMapsFromLocalStorage();
    expect(maps.length).toBe(1);
    expect(maps[0].id).toBe("1");
  });

  it("getMindMapsFromLocalStorage returns empty array if nothing is stored", () => {
    localStorage.clear();
    sessionStorage.clear();
    // @ts-ignore
    window.__MINDMAPS_DATA = undefined;
    expect(getMindMapsFromLocalStorage()).toEqual([]);
  });

  it("deleteMindMap removes a mindmap from storage", async () => {
    const mindmap = {
      id: "2",
      title: "ToDelete",
      description: "",
      tags: [],
      thumbnail: "",
      createdAt: "",
      updatedAt: "",
      author: "",
      nodeCount: 1,
      nodes: [],
      connections: [],
      color: "#fff",
      isPublic: false,
      viewMode: "network" as const,
    };
    saveMindMapToLocalStorage(mindmap);
    expect(getMindMapsFromLocalStorage().length).toBe(1);
    await deleteMindMap("2");
    expect(getMindMapsFromLocalStorage().length).toBe(0);
  });
});
