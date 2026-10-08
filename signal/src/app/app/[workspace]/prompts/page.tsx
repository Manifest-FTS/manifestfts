import { requireWorkspace, hasRole, isReadOnly } from '@/lib/workspace';
import { parseFilters, promptsData, workspaceTopics } from '@/lib/queries';
import { limitsFor } from '@/lib/plans';
import { PageHeader } from '@/components/app/page-header';
import { FilterScope } from '@/components/app/filters';
import { PromptTable } from './prompt-table';

export const metadata = { title: 'Prompts' };

export default async function PromptsPage({ params, searchParams }: PageProps<'/app/[workspace]/prompts'>) {
  const { workspace: slug } = await params;
  const { workspace, role } = await requireWorkspace(slug);
  const filters = parseFilters(await searchParams);
  const [rows, topics] = await Promise.all([promptsData(workspace, filters), workspaceTopics(workspace.id)]);
  const limit = limitsFor(workspace.plan).prompts;
  return (
    <>
      <PageHeader title="Prompts" description={`The questions Signal asks every engine on each run. ${rows.filter((r) => r.prompt.active).length} of ${limit} active prompts used on your plan.`} />
      <FilterScope topics={topics}>
        <PromptTable
          slug={slug}
          workspaceId={workspace.id}
          topics={topics}
          canEdit={hasRole(role, 'editor') && !isReadOnly(workspace)}
          rows={rows.map((r) => ({
            id: r.prompt.id, text: r.prompt.text, topic: r.prompt.topic, intent: r.prompt.intent, active: r.prompt.active,
            mention: { value: r.summary.mention.value, low: r.summary.mention.low, high: r.summary.mention.high, n: r.summary.n },
            citation: r.summary.citation.value, avgPosition: r.summary.avgPosition, engines: r.engines,
          }))}
        />
      </FilterScope>
    </>
  );
}
