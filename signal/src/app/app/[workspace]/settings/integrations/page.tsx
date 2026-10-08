import { requireWorkspace, hasRole } from '@/lib/workspace';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { DestinationsForm, IndexNowPanel } from './integration-forms';

export const metadata = { title: 'Integrations' };

export default async function IntegrationsPage({ params }: PageProps<'/app/[workspace]/settings/integrations'>) {
  const { workspace: slug } = await params;
  const { workspace, role } = await requireWorkspace(slug);
  const isAdmin = hasRole(role, 'admin');
  return (
    <div className="grid max-w-3xl gap-5">
      <Card>
        <CardHeader title="Slack and webhooks" description="Send run results, readiness audits, and accuracy flags to your team’s tools." />
        <CardBody>
          <DestinationsForm workspaceId={workspace.id} slack={workspace.slackWebhookUrl ?? ''} webhook={workspace.webhookUrl ?? ''} secret={isAdmin ? workspace.webhookSecret : null} canEdit={isAdmin} />
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="IndexNow" description={`Notify search engines instantly when pages on ${workspace.domain} change.`} />
        <CardBody><IndexNowPanel workspaceId={workspace.id} domain={workspace.domain} keyValue={workspace.indexnowKey} canEdit={hasRole(role, 'editor')} /></CardBody>
      </Card>
      <Card>
        <CardHeader title="AI traffic" description="Install the tracking snippet to measure visits from AI assistants." />
        <CardBody><a href={`/app/${slug}/traffic`} className="text-[13.5px] font-medium text-accent hover:underline">Open AI traffic setup</a></CardBody>
      </Card>
    </div>
  );
}
