import { useMemo } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';

import { Card } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';

// TODO (NL): Přidat podporu pro další MDX komponenty (např. grafy, tabulky)
// TODO (NL): Zlepšit fallback renderer pro případ selhání MDX
// TODO (NL): Implementovat lazy loading pro náročné komponenty
// TODO (NL): Přidat schéma komponent pro formát vytváření obsahu
const mdxComponents = {
  Card,
  Badge,
  Button,

  h1: (props: any) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
  p: (props: any) => <p className="my-3 leading-relaxed" {...props} />,
  strong: (props: any) => <strong className="font-semibold" {...props} />,
  em: (props: any) => <em {...props} />,
  code: (props: any) => {
    const { children, className } = props;
    const match = /language-(\w+)/.exec(className || '');
    return match ? (
        <pre className="bg-muted p-3 rounded-md overflow-x-auto my-4">
        <code className={className} {...props} />
      </pre>
    ) : (
        <code className="bg-muted px-1 rounded text-sm" {...props} />
    );
  },
  pre: (props: any) => <pre className="bg-muted p-3 rounded-md overflow-x-auto my-4" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 my-3" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 my-3" {...props} />,
  li: (props: any) => <li className="my-1" {...props} />,
  blockquote: (props: any) => (
      <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-3" {...props} />
  ),
  a: ({ href, ...props }: any) => {
    if (href && /^[A-Z][A-Z0-9_]*-\d+$/.test(href)) {
      const [projectCode, issueNumber] = href.split('-');
      return (
          <a
              href={`/projects/${projectCode}/issue/${projectCode}-${issueNumber}`}
              className="text-primary hover:underline"
              {...props}
          />
      );
    }
    return <a href={href} className="text-primary hover:underline" {...props} />;
  },
};

function SimpleMarkdownRenderer({ content }: { content: string }) {
  const processedContent = useMemo(() => {
    const cleanContent = content
        .replace(/^import .*$/gm, '')
        .replace(/^\s*\n/gm, '');

    const withoutJsxComponents = cleanContent
        .replace(/<Card.*?<\/Card>/gs, '<div class="p-4 my-4 border rounded-md bg-muted/20"><div class="font-bold">Důležité upozornění</div><div>Toto je interaktivní komponenta (nedostupná v jednoduchém zobrazení)</div></div>')
        .replace(/<Badge.*?>(.*?)<\/Badge>/g, '<span class="inline-block px-2 py-1 text-xs rounded-full bg-muted text-foreground">$1</span>')
        .replace(/<Button.*?>(.*?)<\/Button>/g, '<span class="inline-block px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground">$1</span>')
        .replace(/<([A-Z][A-Za-z0-9]*)\s*\/>/g, (match, tag) => {
          return `<div class="p-2 border border-dashed border-muted-foreground rounded-md text-xs italic text-muted-foreground">Komponenta <${tag} /> (zobrazena jako text)</div>`;
        })
    const html = withoutJsxComponents
        .replace(/^# (.+)$/gm, "<h1 class='text-3xl font-bold mt-6 mb-4'>$1</h1>")
        .replace(/^## (.+)$/gm, "<h2 class='text-2xl font-bold mt-5 mb-3'>$1</h2>")
        .replace(/^### (.+)$/gm, "<h3 class='text-xl font-bold mt-4 mb-2'>$1</h3>")
        .replace(/\*\*(.+?)\*\*/g, "<strong class='font-semibold'>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/\n\n/g, "</p><p class='my-3 leading-relaxed'>")
        .replace(/\n/g, "<br />")
        .replace(/^- (.+)$/gm, "<li>$1</li>")
        .replace(/<li>(.*?)<\/li>/g, (match) => `<ul class="list-disc pl-6 my-3">${match}</ul>`)
        .replace(/\`\`\`([\s\S]*?)\`\`\`/g, (match, code) =>
            `<pre class="bg-muted p-3 rounded-md overflow-x-auto my-4"><code>${code}</code></pre>`
        )
        .replace(/\`([^`]+)\`/g, "<code class='bg-muted px-1 rounded text-sm'>$1</code>")
        .replace(/([A-Z][A-Z0-9_]*-\d+)/g, '<a href="$1" class="text-primary hover:underline">$1</a>');

    return html;
  }, [content]);

  return (
      <div
          className="prose max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: `<p class='my-3 leading-relaxed'>${processedContent}</p>` }}
      />
  );
}

function MDXContent({ code }: { code: string }) {
  const Component = useMemo(() => {
    if (!code) return null;

    try {
      return getMDXComponent(code);
    } catch (error) {
      console.error('Chyba při kompilaci MDX kódu:', error);
      return null;
    }
  }, [code]);

  if (!Component) {
    return (
        <div className="p-4 border border-amber-200 bg-amber-50 text-amber-800 rounded-md">
          <h3 className="font-medium mb-1">Upozornění</h3>
          <p>Obsah MDX se nepodařilo zpracovat. Zobrazuji zjednodušenou verzi.</p>
        </div>
    );
  }

  return (
      <div className="mdx-content">
        <Component components={mdxComponents} />
      </div>
  );
}

export function MdxRenderer({ content, compiledSource }: { content: string, compiledSource?: string }) {
  if (compiledSource) {
    try {
      return <MDXContent code={compiledSource} />;
    } catch (error) {
      console.error('Chyba při renderování MDX:', error);
    }
  }

  return <SimpleMarkdownRenderer content={content} />;
}
