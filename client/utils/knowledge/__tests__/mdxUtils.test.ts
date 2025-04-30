import { afterEach, describe, expect, it, vi } from "vitest";
import * as fs from "fs";
import { generateUniqueSlug, getMdxDocumentBySlug, getMdxFiles, mdxToDocument } from "~/utils/knowledge/mdxUtils";

vi.mock("fs", () => {
  let files: string[] = [];
  let fileContent: string = "";
  let exists = true;

  const mockFs = {
    existsSync: vi.fn(() => exists),
    readdirSync: vi.fn(() => files),
    readFileSync: vi.fn(() => fileContent),
    writeFileSync: vi.fn(),
    mkdirSync: vi.fn(),
    __setMockFiles: (f: string[]) => {
      files = f;
    },
    __setMockContent: (c: string) => {
      fileContent = c;
    },
    __setExists: (e: boolean) => {
      exists = e;
    },
  };

  return {
    ...mockFs,
    default: mockFs,
  };
});

const fsMock = fs as any;

describe("mdxUtils", () => {
  afterEach(() => {
    fsMock.__setMockFiles([]);
    fsMock.__setMockContent("");
    fsMock.__setExists(true);
  });

  it("mdxToDocument converts MDX document to internal format", () => {
    const mdx = {
      id: "1",
      slug: "test",
      title: "Test",
      content: "Hello",
      tags: ["foo"],
      lastModified: "2024-01-01",
      createdAt: "2024-01-01",
      author: "Author",
      relatedIssues: [],
      isShared: false,
      frontmatter: {},
    };
    const doc = mdxToDocument(mdx);
    expect(doc.id).toBe("1");
    expect(doc.title).toBe("Test");
    expect(doc.tags).toContain("foo");
    expect(doc.author).toBe("Author");
  });

  it("generateUniqueSlug returns a slugified string", () => {
    const slug = generateUniqueSlug("Hello World!");
    expect(typeof slug).toBe("string");
    expect(slug).toMatch(/hello-world/);
  });

  it("getMdxFiles returns only .mdx files", () => {
    fsMock.__setMockFiles(["a.mdx", "b.txt", "c.mdx"]);
    fsMock.__setExists(true);
    const files = getMdxFiles();
    expect(files).toEqual(["a.mdx", "c.mdx"]);
  });

  it("getMdxFiles returns empty array if directory does not exist", () => {
    fsMock.__setExists(false);
    const files = getMdxFiles();
    expect(files).toEqual([]);
  });

  it("getMdxDocumentBySlug returns null if file does not exist", async () => {
    fsMock.__setExists(false);
    const doc = await getMdxDocumentBySlug("notfound");
    expect(doc).toBeNull();
  });

  it("getMdxDocumentBySlug parses file if exists", async () => {
    fsMock.__setExists(true);
    fsMock.__setMockContent("---\ntitle: Test\nauthor: Author\n---\nHello");
    const doc = await getMdxDocumentBySlug("test");
    expect(doc?.title).toBe("Test");
    expect(doc?.author).toBe("Author");
    expect(doc?.content).toBe("Hello");
  });
});
