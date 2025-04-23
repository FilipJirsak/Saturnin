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
      fm = Object.fromEntries(
          match[1]
              .split("\n")
              .map((line) => {
                const [k, ...rest] = line.split(": ");
                let v = rest.join(": ");
                try { v = JSON.parse(v); } catch {}
                return [k, v];
              })
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
    fm = Object.fromEntries(
        match[1]
            .split("\n")
            .map((line) => {
              const [k, ...rest] = line.split(": ");
              let v = rest.join(": ");
              try { v = JSON.parse(v); } catch {}
              return [k, v];
            })
    );
    body = raw.slice(match[0].length);
  }

  if (newTitle) fm.title = newTitle;
  if (newAuthor) fm.author = newAuthor;
  if (newTags) fm.tags = newTags;
  fm.lastModified = new Date().toISOString();

  const updatedFront =
      "---\n" +
      Object.entries(fm)
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

export default router;
