import { describe, expect, it } from "vitest";
import { filterDocumentsBySearchTerm, searchDocuments } from "~/utils/knowledge/documentSearchUtils";
import type { DocumentItem } from "~/types/knowledge";

describe("documentSearchUtils", () => {
  const docs = [
    {
      id: "1",
      type: "document" as const,
      title: "Alpha",
      description: "desc",
      tags: ["foo"],
      lastModified: "",
      path: "/1",
    },
    {
      id: "2",
      type: "document" as const,
      title: "Beta",
      description: "desc2",
      tags: ["bar"],
      lastModified: "",
      path: "/2",
    },
    {
      id: "3",
      type: "folder" as const,
      title: "Folder",
      description: "",
      tags: [],
      lastModified: "",
      path: "/3",
      children: [
        {
          id: "4",
          type: "document" as const,
          title: "Gamma",
          description: "desc3",
          tags: ["baz"],
          lastModified: "",
          path: "/4",
        },
      ],
    },
  ] as DocumentItem[];

  it("searchDocuments finds by title, description, or tags", () => {
    expect(searchDocuments(docs, "Alpha")).toHaveLength(1);
    expect(searchDocuments(docs, "desc2")).toHaveLength(1);
    expect(searchDocuments(docs, "baz")).toHaveLength(1);
    expect(searchDocuments(docs, "")).toHaveLength(0);
  });

  it("filterDocumentsBySearchTerm preserves folder structure", () => {
    const filtered = filterDocumentsBySearchTerm(docs, "Gamma");
    expect(filtered.length).toBe(1);
    expect(filtered[0].type).toBe("folder");
    expect(filtered[0].children && filtered[0].children.length).toBe(1);
    expect(filtered[0].children && filtered[0].children[0].title).toBe("Gamma");
  });
});
