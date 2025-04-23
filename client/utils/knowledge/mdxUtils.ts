import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { bundleMDX } from 'mdx-bundler';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import {MdxDocument} from "~/types/knowledge";

// TODO (NL): Implementovat vytváření, ukládání a mazání MDX souborů
// TODO (NL): Přidat podporu pro nahrávání obrázků a jejich správu v rámci MDX dokumentů
// TODO (NL): Napojit na skutečné API/databázi namísto práce s lokálním souborovým systémem
// TODO (NL): Přidat verzování dokumentů pro možnost návratu k předchozím verzím
// TODO (NL): Implementovat efektivnější cachování pro zrychlení načítání dokumentů

/**
 * Finds the MDX content directory and creates it if it doesn't exist.
 */
function findContentDirectory() {
  const contentDirectory = path.join(process.cwd(), 'client/content/documents');

  try {
    if (fs.existsSync(contentDirectory)) {
      console.log(`✅ Nalezen adresář dokumentů: ${contentDirectory}`);
      return contentDirectory;
    }

    console.log(`Vytvářím adresář pro dokumenty: ${contentDirectory}`);
    fs.mkdirSync(contentDirectory, { recursive: true });
    return contentDirectory;
  } catch (error) {
    console.error(`Chyba při práci s adresářem ${contentDirectory}:`, error);
    throw new Error(`Nelze najít ani vytvořit adresář pro dokumenty.`);
  }
}

const contentDirectory = findContentDirectory();

/**
 * Compiles MDX content string into executable code and extracts frontmatter.
 * @param source - Raw MDX source text, including frontmatter.
 * @returns An object containing the compiled code and parsed frontmatter data.
 */
export async function compileMdx(source: string) {
  try {
    const { data, content } = matter(source);

    const result = await bundleMDX({
      source: content,
      mdxOptions(options) {
        options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
        options.rehypePlugins = [...(options.rehypePlugins ?? []), rehypeHighlight];
        return options;
      },
      esbuildOptions(options) {
        options.resolveExtensions = ['.js', '.jsx', '.ts', '.tsx', '.mdx'];
        options.loader = {
          ...options.loader,
          '.js': 'jsx',
          '.ts': 'tsx',
        };
        options.define = {
          ...options.define,
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        };
        return options;
      }
    });

    return {
      code: result.code,
      frontmatter: data
    };
  } catch (error) {
    console.error("Chyba při kompilaci MDX:", error);
    return { code: null, frontmatter: {} };
  }
}

/**
 * Retrieves all filenames ending with .mdx in the content directory.
 * @returns Array of MDX filenames (including extension).
 */
export function getMdxFiles(): string[] {
  try {
    if (!fs.existsSync(contentDirectory)) {
      fs.mkdirSync(contentDirectory, { recursive: true });
      return [];
    }

    const files = fs.readdirSync(contentDirectory);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));

    console.log(`Nalezeno ${mdxFiles.length} MDX souborů`);
    return mdxFiles;
  } catch (error) {
    console.error('Chyba při čtení MDX souborů:', error);
    return [];
  }
}

/**
 * Loads and compiles a single MDX document identified by its slug.
 * @param slug - Filename without the .mdx extension.
 * @returns The MDX document object or null if not found.
 */
export async function getMdxDocumentBySlug(slug: string): Promise<MdxDocument | null> {
  try {
    const filePath = path.join(contentDirectory, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      console.warn(`Soubor ${filePath} neexistuje.`);
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    const compiledResult = await compileMdx(fileContent);

    return {
      id: slug,
      slug,
      title: data.title || 'Bez názvu',
      content,
      author: data.author,
      tags: data.tags || [],
      lastModified: data.lastModified,
      createdAt: data.createdAt,
      relatedIssues: data.relatedIssues || [],
      isShared: data.isShared || false,
      frontmatter: data,
      compiledSource: compiledResult?.code || undefined
    };
  } catch (error) {
    console.error(`Chyba při načítání dokumentu ${slug}:`, error);
    return null;
  }
}

/**
 * Loads and compiles all MDX documents in the content directory.
 * @returns Array of all parsed and compiled MDX documents.
 */
export async function getAllMdxDocuments(): Promise<MdxDocument[]> {
  const mdxFiles = getMdxFiles();

  if (mdxFiles.length === 0) {
    console.log('Nebyly nalezeny žádné MDX soubory.');
    return [];
  }

  const documentsPromises = mdxFiles.map(async (file) => {
    const slug = file.replace(/\.mdx$/, '');
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
    author: mdx.author || 'Neznámý autor',
    relatedIssues: mdx.relatedIssues || [],
    isShared: mdx.isShared || false,
  };
}
