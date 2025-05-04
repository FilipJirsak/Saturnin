import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";

const router = new Hono();
router.use(cors());

const CONTENT_DIR = `${Deno.cwd()}/client/content/documents`;

try {
  await Deno.mkdir(CONTENT_DIR, { recursive: true });
} catch (err) {
  if (!(err instanceof Deno.errors.AlreadyExists)) {
    console.error("Chyba při vytváření adresáře:", err);
    throw err;
  }
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/^-+|-+$/g, "");
}

router.get("/documents", async (c) => {
  const slugs: string[] = [];
  for await (const entry of Deno.readDir(CONTENT_DIR)) {
    if (entry.isFile && entry.name.endsWith(".mdx")) {
      slugs.push(entry.name.replace(/\.mdx$/, ""));
    }
  }
  return c.json({ ok: true, slugs });
});

router.get("/documents/:slug", async (c) => {
  const slug = c.req.param("slug");
  const filePath = `${CONTENT_DIR}/${slug}.mdx`;
  try {
    const raw = await Deno.readTextFile(filePath);
    const match = raw.match(/^---\n([\s\S]*?)---\n\n/);
    let fm = {};
    let body = raw;
    if (match) {
      const validLines = match[1]
        .split("\n")
        .filter((line) => line.trim() && line.includes(": "));

      fm = Object.fromEntries(
        validLines.map((line) => {
          const colonIndex = line.indexOf(": ");
          const k = line.substring(0, colonIndex).trim();
          let v = line.substring(colonIndex + 2).trim();
          try {
            v = JSON.parse(v);
          } catch {}
          return [k, v];
        }),
      );
      body = raw.slice(match[0].length);
    }
    return c.json({ ok: true, document: { slug, frontmatter: fm, content: body } });
  } catch {
    return c.json({ ok: false, error: "Dokument nenalezen" }, 404);
  }
});

router.post("/documents", async (c) => {
  const data = await c.req.json();
  const title = String(data.title);
  const content = String(data.content || "");
  const author = String(data.author || "Neznámý");
  const tags = Array.isArray(data.tags) ? data.tags : [];

  const slug = slugify(title);
  const now = new Date().toISOString();

  const front = `---
title: "${title}"
author: "${author}"
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
createdAt: "${now}"
lastModified: "${now}"
---\n\n`;

  const filePath = `${CONTENT_DIR}/${slug}.mdx`;
  await Deno.writeTextFile(filePath, front + content);
  return c.json({ ok: true, id: slug });
});

router.put("/documents/:slug", async (c) => {
  const slug = c.req.param("slug");
  const filePath = `${CONTENT_DIR}/${slug}.mdx`;

  try {
    await Deno.stat(filePath);
  } catch {
    return c.json({ ok: false, error: "Dokument nenalezen" }, 404);
  }

  const data = await c.req.json();
  const newContent = data.content as string | undefined;
  const newTitle = data.title as string | undefined;
  const newAuthor = data.author as string | undefined;
  const newTags = data.tags as string[] | undefined;

  const raw = await Deno.readTextFile(filePath);
  const match = raw.match(/^---\n([\s\S]*?)---\n\n/);
  let fm: Record<string, any> = {};
  let body = raw;

  if (match) {
    const validLines = match[1]
      .split("\n")
      .filter((line) => {
        const trimmed = line.trim();
        return trimmed && trimmed.includes(": ");
      });

    fm = Object.fromEntries(
      validLines.map((line) => {
        const colonIndex = line.indexOf(": ");
        const k = line.substring(0, colonIndex).trim();
        let v = line.substring(colonIndex + 2).trim();
        try {
          v = JSON.parse(v);
        } catch {}
        return [k, v];
      }),
    );

    body = raw.slice(match[0].length);
  }

  if (newTitle) fm.title = newTitle;
  if (newAuthor) fm.author = newAuthor;
  if (newTags) fm.tags = newTags;
  fm.lastModified = new Date().toISOString();

  const cleanFrontmatter = Object.fromEntries(
    Object.entries(fm).filter(([k]) => k.trim()),
  );

  const updatedFront = "---\n" +
    Object.entries(cleanFrontmatter)
      .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
      .join("\n") +
    "\n---\n\n";

  const finalBody = newContent !== undefined ? newContent : body;
  await Deno.writeTextFile(filePath, updatedFront + finalBody);
  return c.json({ ok: true });
});

router.delete("/documents/:slug", async (c) => {
  const slug = c.req.param("slug");
  const filePath = `${CONTENT_DIR}/${slug}.mdx`;
  try {
    await Deno.remove(filePath);
    return c.json({ ok: true });
  } catch {
    return c.json({ ok: false, error: "Dokument nenalezen nebo nelze smazat" }, 404);
  }
});

router.put("/documents/:slug/move", async (c) => {
  const slug = c.req.param("slug");
  const filePath = `${CONTENT_DIR}/${slug}.mdx`;

  try {
    await Deno.stat(filePath);
  } catch {
    return c.json({ ok: false, error: "Dokument nenalezen" }, 404);
  }

  const data = await c.req.json();
  const targetFolderTag = data.targetFolderTag as string;
  const keepTags = Boolean(data.keepTags);

  if (!targetFolderTag) {
    return c.json({ ok: false, error: "Je požadován cílový tag složky" }, 400);
  }

  const raw = await Deno.readTextFile(filePath);
  const match = raw.match(/^---\n([\s\S]*?)---\n\n/);
  let fm: Record<string, any> = {};
  let body = raw;

  if (match) {
    const validLines = match[1]
      .split("\n")
      .filter((line) => {
        const trimmed = line.trim();
        return trimmed && trimmed.includes(": ");
      });

    fm = Object.fromEntries(
      validLines.map((line) => {
        const colonIndex = line.indexOf(": ");
        const k = line.substring(0, colonIndex).trim();
        let v = line.substring(colonIndex + 2).trim();
        try {
          v = JSON.parse(v);
        } catch {}
        return [k, v];
      }),
    );

    body = raw.slice(match[0].length);
  }

  let updatedTags: string[];

  if (keepTags) {
    updatedTags = Array.isArray(fm.tags) ? fm.tags.filter((tag) => tag !== targetFolderTag) : [];
    updatedTags.unshift(targetFolderTag);
  } else {
    updatedTags = [targetFolderTag];
  }

  fm.tags = updatedTags;
  fm.lastModified = new Date().toISOString();

  const cleanFrontmatter = Object.fromEntries(
    Object.entries(fm).filter(([k]) => k.trim()),
  );

  const updatedFront = "---\n" +
    Object.entries(cleanFrontmatter)
      .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
      .join("\n") +
    "\n---\n\n";

  await Deno.writeTextFile(filePath, updatedFront + body);
  return c.json({ ok: true });
});

export default router;
