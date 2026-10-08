import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { PenLine } from 'lucide-react';
import { getDb, schema } from '@/lib/db';
import { requireWorkspace, hasRole, isReadOnly } from '@/lib/workspace';
import { promptsData } from '@/lib/queries';
import { relativeTime } from '@/lib/format';
import { PageHeader } from '@/components/app/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { NewBrief } from './new-brief';
import { STATUS } from './status';

export const metadata = { title: 'Content studio' };

export default async function ContentPage({ params }: PageProps<'/app/[workspace]/content'>) {
  const { workspace: slug } = await params;
  const { workspace, role } = await requireWorkspace(slug);
  const db = await getDb();
  const [briefs, prompts] = await Promise.all([
    db.select().from(schema.contentBriefs).where(eq(schema.contentBriefs.workspaceId, workspace.id)).orderBy(desc(schema.contentBriefs.updatedAt)),
    promptsData(workspace, { days: 30, engine: 'all', topic: 'all' }),
  ]);
  const canEdit = hasRole(role, 'editor') && !isReadOnly(workspace);
  const options = prompts.filter((p) => p.prompt.active).sort((a, b) => (a.summary.mention.value ?? 1) - (b.summary.mention.value ?? 1)).map((p) => ({ id: p.prompt.id, text: p.prompt.text, mention: p.summary.mention.value }));

  return (
    <>
      <PageHeader
        title="Content studio"
        description="Evidence-based briefs for pages that answer the questions where engines leave you out, with optional AI drafts and publish tracking."
        actions={canEdit && <NewBrief workspaceId={workspace.id} prompts={options} />}
      />
      {briefs.length === 0 ? (
        <Card><EmptyState icon={<PenLine />} title="No briefs yet" description="Start with a prompt where competitors appear and you don’t. Signal compiles the sources engines cite, your facts, and a citable structure." /></Card>
      ) : (
        <Card className="divide-y divide-border">
          {briefs.map((b) => {
            const [tone, label] = STATUS[b.status];
            return (
              <Link key={b.id} href={`/app/${slug}/content/${b.id}`} className="flex items-center gap-4 px-5 py-4 transition hover:bg-bg-subtle">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-subtle text-accent"><PenLine className="size-5" aria-hidden /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14.5px] font-medium text-fg">{b.title}</span>
                  <span className="block text-[12.5px] text-fg-muted">Updated {relativeTime(b.updatedAt)}{b.draft ? ' · draft attached' : ''}{b.publishedUrl ? ` · ${b.publishedUrl}` : ''}</span>
                </span>
                <Badge tone={tone}>{label}</Badge>
              </Link>
            );
          })}
        </Card>
      )}
    </>
  );
}
