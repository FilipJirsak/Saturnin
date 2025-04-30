import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MdxDocument, NewDocument } from "~/types/knowledge";

//TODO (NL): Pročistit!!!

/**
 * Finds the MDX content directory and creates it if it doesn't exist.
 */
function findContentDirectory() {
  const possiblePaths = [
    path.join(process.cwd(), "client/content/documents"),
    path.join(process.cwd(), "content/documents"),
    path.join(process.cwd(), "../client/content/documents"),
  ];

  for (const contentDirectory of possiblePaths) {
    try {
      if (fs.existsSync(contentDirectory)) {
        console.log(`✅ Nalezen adresář dokumentů: ${contentDirectory}`);
        return contentDirectory;
      }
    } catch (error) {
      console.error(`Chyba při kontrole adresáře ${contentDirectory}:`, error);
    }
  }

  const contentDirectory = possiblePaths[0];
  console.log(`Vytvářím adresář pro dokumenty: ${contentDirectory}`);
  fs.mkdirSync(contentDirectory, { recursive: true });
  return contentDirectory;
}

let contentDirectory = "";
if (typeof window === "undefined") {
  contentDirectory = findContentDirectory();
} else {
  console.warn("Běžíme v prohlížeči, fs operace nebudou fungovat");
}

/**
 * Retrieves all filenames ending with .mdx in the content directory.
 * @returns Array of MDX filenames (including extension).
 */
export function getMdxFiles(): string[] {
  if (!contentDirectory || typeof fs === "undefined" || !fs.existsSync) {
    console.warn("getMdxFiles: Běžíme v prohlížeči, vracím prázdné pole");
    return [];
  }

  try {
    if (!fs.existsSync(contentDirectory)) {
      fs.mkdirSync(contentDirectory, { recursive: true });
      return [];
    }

    const files = fs.readdirSync(contentDirectory);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    console.log(`Nalezeno ${mdxFiles.length} MDX souborů`);
    return mdxFiles;
  } catch (error) {
    console.error("Chyba při čtení MDX souborů:", error);
    return [];
  }
}

/**
 * Loads and parses a single MDX document identified by its slug.
 * @param slug - Filename without the .mdx extension.
 * @returns The MDX document object or null if not found.
 */
export async function getMdxDocumentBySlug(slug: string): Promise<MdxDocument | null> {
  if (!contentDirectory || typeof fs === "undefined" || !fs.existsSync) {
    console.warn(`getMdxDocumentBySlug: Běžíme v prohlížeči, nelze načíst dokument ${slug}`);
    return null;
  }

  try {
    const filePath = path.join(contentDirectory, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      console.warn(`Soubor ${filePath} neexistuje.`);
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);

    return {
      id: slug,
      slug,
      title: data.title || "Bez názvu",
      content,
      author: data.author,
      tags: data.tags || [],
      lastModified: data.lastModified,
      createdAt: data.createdAt,
      relatedIssues: data.relatedIssues || [],
      isShared: data.isShared || false,
      frontmatter: data,
    };
  } catch (error) {
    console.error(`Chyba při načítání dokumentu ${slug}:`, error);
    return null;
  }
}

/**
 * Loads and parses all MDX documents in the content directory.
 * @returns Array of all parsed MDX documents.
 */
export async function getAllMdxDocuments(): Promise<MdxDocument[]> {
  if (!contentDirectory || typeof fs === "undefined" || !fs.existsSync) {
    console.warn("getAllMdxDocuments: Běžíme v prohlížeči, vracím prázdné pole");
    return [];
  }

  const mdxFiles = getMdxFiles();

  if (mdxFiles.length === 0) {
    console.log("Nebyly nalezeny žádné MDX soubory.");
    return [];
  }

  const documentsPromises = mdxFiles.map(async (file) => {
    const slug = file.replace(/\.mdx$/, "");
    try {
      return await getMdxDocumentBySlug(slug);
    } catch (error) {
      console.error(`Chyba při načítání dokumentu ${slug}:`, error);
      return null;
    }
  });

  const documents = await Promise.all(documentsPromises);
  return documents.filter((doc): doc is MdxDocument => doc !== null);
}

/**
 * Converts an MdxDocument into a simplified internal document format.
 * @param mdx - The MDX document to convert.
 */
export function mdxToDocument(mdx: MdxDocument): any {
  return {
    id: mdx.id,
    title: mdx.title,
    content: mdx.content,
    tags: mdx.tags || [],
    lastModified: mdx.lastModified || mdx.createdAt || new Date().toISOString(),
    createdAt: mdx.createdAt || new Date().toISOString(),
    author: mdx.author || "Neznámý autor",
    relatedIssues: mdx.relatedIssues || [],
    isShared: mdx.isShared || false,
  };
}

/**
 * Generates a unique slug for a new document based on its title.
 * If a document with the same slug already exists, a number is appended.
 * @param title - The document title used to generate the slug.
 * @returns A unique slug for the MDX document.
 */
export function generateUniqueSlug(title: string): string {
  if (!contentDirectory || typeof fs === "undefined" || !fs.existsSync) {
    console.warn("generateUniqueSlug: Běžíme v prohlížeči, vracím základní slug");
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  const baseSlug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const mdxFiles = getMdxFiles();
  const existingSlugs = new Set(mdxFiles.map((file) => file.replace(/\.mdx$/, "")));

  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let newSlug = `${baseSlug}-${counter}`;

  while (existingSlugs.has(newSlug)) {
    counter++;
    newSlug = `${baseSlug}-${counter}`;
  }

  return newSlug;
}

/**
 * Creates a new MDX document based on the provided data.
 * @param documentData - Data for the new document.
 * @returns The created document object or null in case of error.
 */
export async function createMdxDocument(documentData: NewDocument): Promise<MdxDocument | null> {
  if (!contentDirectory || typeof fs === "undefined" || !fs.existsSync) {
    console.warn("createMdxDocument: Běžíme v prohlížeči, nelze vytvořit dokument");
    return null;
  }

  try {
    const now = new Date().toISOString();
    const slug = generateUniqueSlug(documentData.title);

    const body = documentData.content ??
      `# ${documentData.title}---

# ${documentData.title}

${documentData.summary || ""}

## Obsah dokumentu

Zde začni psát obsah tvého dokumentu...
`;

    const frontmatter = {
      title: documentData.title,
      author: documentData.author,
      tags: documentData.tags,
      createdAt: now,
      lastModified: now,
      relatedIssues: [],
      isShared: false,
    };

    const fileStr = matter.stringify(body, frontmatter);
    const filePath = path.join(contentDirectory, `${slug}.mdx`);
    fs.writeFileSync(filePath, fileStr, "utf8");

    return await getMdxDocumentBySlug(slug);
  } catch (error) {
    console.error("Chyba při vytváření MDX dokumentu:", error);
    return null;
  }
}

/**
 * Updates an existing MDX document.
 * @param slug - Identifier of the document to update.
 * @param updatedData - Updated document data.
 * @returns The updated document or null in case of error.
 */
export async function updateMdxDocument(
  slug: string,
  updatedData: Partial<MdxDocument>,
): Promise<MdxDocument | null> {
  const existing = await getMdxDocumentBySlug(slug);
  if (!existing) return null;

  const now = new Date().toISOString();
  const frontmatter = {
    ...existing.frontmatter,
    title: updatedData.title ?? existing.title,
    author: updatedData.author ?? existing.author,
    tags: updatedData.tags ?? existing.tags,
    relatedIssues: updatedData.relatedIssues ?? existing.relatedIssues,
    isShared: updatedData.isShared ?? existing.isShared,
    createdAt: existing.createdAt,
    lastModified: now,
  };

  const content = updatedData.content ?? existing.content;

  const yamlStr = matter.stringify(content, frontmatter);
  const filePath = path.join(contentDirectory, `${slug}.mdx`);
  fs.writeFileSync(filePath, yamlStr, "utf-8");

  if (updatedData.title && updatedData.title !== existing.title) {
    const newSlug = generateUniqueSlug(updatedData.title);
    const newFilePath = path.join(contentDirectory, `${newSlug}.mdx`);
    fs.renameSync(filePath, newFilePath);
    return await getMdxDocumentBySlug(newSlug);
  }

  return await getMdxDocumentBySlug(slug);
}

/**
 * Deletes an MDX document by its slug.
 * @param slug - Identifier of the document to delete.
 * @returns True on success, false on error.
 */
export async function deleteMdxDocument(slug: string): Promise<boolean> {
  if (!contentDirectory || typeof fs === "undefined" || !fs.existsSync) {
    console.warn(`deleteMdxDocument: Běžíme v prohlížeči, nelze smazat dokument ${slug}`);
    return false;
  }

  try {
    const filePath = path.join(contentDirectory, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      console.warn(`Soubor ${filePath} neexistuje, nelze smazat.`);
      return false;
    }

    fs.unlinkSync(filePath);
    console.log(`Dokument ${slug}.mdx byl úspěšně smazán.`);
    return true;
  } catch (error) {
    console.error(`Chyba při mazání dokumentu ${slug}:`, error);
    return false;
  }
}

/**
 * Moves a document to another "folder" by updating its tags.
 * @param slug - Identifier of the document to move.
 * @param targetFolderTag - Tag of the target folder.
 * @param keepExistingTags - Whether to keep existing tags (true) or replace them (false).
 * @returns The updated document or null in case of error.
 */
export async function moveDocumentToFolder(
  slug: string,
  targetFolderTag: string,
  keepExistingTags: boolean = true,
): Promise<MdxDocument | null> {
  if (!contentDirectory || typeof fs === "undefined" || !fs.existsSync) {
    console.warn(`moveDocumentToFolder: Běžíme v prohlížeči, nelze přesunout dokument ${slug}`);
    return null;
  }

  try {
    const document = await getMdxDocumentBySlug(slug);

    if (!document) {
      console.error(`Dokument se slugem "${slug}" nebyl nalezen.`);
      return null;
    }

    let updatedTags: string[];

    if (keepExistingTags) {
      updatedTags = [...(document.tags || [])];

      updatedTags = updatedTags.filter((tag) => tag !== targetFolderTag);
    } else {
      updatedTags = [];
    }

    updatedTags.unshift(targetFolderTag);

    console.log(`Přesouvám dokument "${slug}" do složky s tagem "${targetFolderTag}" s tagy:`, updatedTags);

    return await updateMdxDocument(slug, { tags: updatedTags });
  } catch (error) {
    console.error(`Chyba při přesouvání dokumentu ${slug} do složky s tagem ${targetFolderTag}:`, error);
    return null;
  }
}
