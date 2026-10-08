import * as React from 'react';
import Link from 'next/link';

// A deliberately small Markdown subset for first-party content: ## / ### headings, paragraphs,
// "-" and "1." lists, simple tables, **bold**, `code`, and [links](url). It renders React nodes,
// never raw HTML, so content cannot inject markup.

export function headingId(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function inline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${i++}`;
    if (match[2]) nodes.push(<strong key={key}>{match[2]}</strong>);
    else if (match[3]) nodes.push(<code key={key}>{match[3]}</code>);
    else if (match[4] && match[5]) {
      const href = match[5];
      if (href.startsWith('/') || href.startsWith('#')) nodes.push(<Link key={key} href={href}>{match[4]}</Link>);
      else if (href.startsWith('https://')) nodes.push(<a key={key} href={href} rel="noopener noreferrer" target="_blank">{match[4]}</a>);
      else nodes.push(match[4]);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ source }: { source: string }) {
  const blocks = source.trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, b) => {
        const key = `b${b}`;
        const lines = block.split('\n');
        if (block.startsWith('### ')) {
          const text = block.slice(4).trim();
          return <h3 key={key} id={headingId(text)}>{inline(text, key)}</h3>;
        }
        if (block.startsWith('## ')) {
          const text = block.slice(3).trim();
          return <h2 key={key} id={headingId(text)}>{inline(text, key)}</h2>;
        }
        if (lines.every((l) => /^- /.test(l))) {
          return <ul key={key}>{lines.map((l, i) => <li key={i}>{inline(l.slice(2), `${key}-${i}`)}</li>)}</ul>;
        }
        if (lines.every((l) => /^\d+\. /.test(l))) {
          return <ol key={key}>{lines.map((l, i) => <li key={i}>{inline(l.replace(/^\d+\. /, ''), `${key}-${i}`)}</li>)}</ol>;
        }
        if (lines.length >= 2 && lines.every((l) => l.trim().startsWith('|'))) {
          const rows = lines.filter((l) => !/^\|\s*-/.test(l.trim())).map((l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
          const [head, ...body] = rows;
          return (
            <div key={key} className="overflow-x-auto rounded-xl border border-border">
              <table>
                <thead><tr>{head!.map((c, i) => <th key={i} scope="col">{inline(c, `${key}-h${i}`)}</th>)}</tr></thead>
                <tbody>{body.map((r, ri) => <tr key={ri}>{r.map((c, ci) => <td key={ci}>{inline(c, `${key}-${ri}-${ci}`)}</td>)}</tr>)}</tbody>
              </table>
            </div>
          );
        }
        return <p key={key}>{inline(lines.join(' '), key)}</p>;
      })}
    </>
  );
}

/** Extracts ## headings for an on-page table of contents. */
export function outline(source: string) {
  return [...source.matchAll(/^## (.+)$/gm)].map((m) => ({ text: m[1]!.trim(), id: headingId(m[1]!.trim()) }));
}

/** Strips Markdown syntax for plain-text outputs such as llms-full.txt and JSON-LD. */
export function plainText(source: string) {
  return source.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');
}
