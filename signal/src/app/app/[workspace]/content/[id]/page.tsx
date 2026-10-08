import Link from 'next/link';
import { notFound } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { ArrowLeft } from 'lucide-react';
import { getDb, schema } from '@/lib/db';
import { requireWorkspace, hasRole, isReadOnly } from '@/lib/workspace';
import { draftingAvailable } from '@/lib/providers/drafting';
import { Markdown } from '@/lib/markdown';
import { formatDate } from '@/lib/format';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/tools/shared';
import { BriefEditor } from './brief-editor';
import { STATUS } from '../status';

export const metadata = { title: 'Content brief' };

export default async function BriefPage({ params }: PageProps<'/app/[workspace]/content/[id]'>) {
  const { workspace: slug, id } = await params;
  const { workspace, role } = await requireWorkspace(slug);
  const db = await getDb();
  const [brief] = await db.select().from(schema.contentBriefs).where(and(eq(schema.contentBriefs.id, id), eq(schema.contentBriefs.workspaceId, workspace.id)));
  if (!brief) notFound();
  const [tone, label] = STATUS[brief.status];
  return (
    <>
      <PageHeader
        eyebrow={<Link href={`/app/${slug}/content`} className="inline-flex items-center gap-1 text-[13px] font-medium text-fg-muted hover:text-fg"><ArrowLeft className="size-3.5" aria-hidden />Content studio</Link>}
        title={<span className="text-[22px]">“{brief.question}”</span>}
        description={<span className="flex flex-wrap items-center gap-2"><Badge tone={tone}>{label}</Badge>Created {formatDate(brief.createdAt)}{brief.promptId && <Link href={`/app/${slug}/prompts/${brief.promptId}`} className="text-accent hover:underline">View prompt</Link>}</span>}
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="self-start">
          <CardHeader title="Brief" description="Compiled from your observations, sources, and fact sheet." action={<CopyButton text={brief.brief} label="Copy brief" />} />
          <CardBody><div className="prose-signal text-[14.5px]"><Markdown source={brief.brief} /></div></CardBody>
        </Card>
        <Card className="self-start">
          <CardBody>
            <BriefEditor workspaceId={workspace.id} slug={slug} briefId={brief.id} status={brief.status} draft={brief.draft ?? ''} draftModel={brief.draftModel} publishedUrl={brief.publishedUrl ?? ''} canEdit={hasRole(role, 'editor') && !isReadOnly(workspace)} aiAvailable={draftingAvailable()} />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
