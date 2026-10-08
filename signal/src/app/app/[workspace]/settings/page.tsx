import { requireWorkspace, hasRole } from '@/lib/workspace';
import { limitsFor } from '@/lib/plans';
import { liveEngines } from '@/lib/providers/live';
import { ENGINE_BY_ID } from '@/lib/engines';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { GeneralForm, DataSourceControl, DangerZone } from './general-forms';

export const metadata = { title: 'Settings' };

export default async function GeneralSettingsPage({ params }: PageProps<'/app/[workspace]/settings'>) {
  const { workspace: slug } = await params;
  const { workspace, role } = await requireWorkspace(slug);
  const limits = limitsFor(workspace.plan);
  const ws = { id: workspace.id, slug: workspace.slug, name: workspace.name, brandName: workspace.brandName, domain: workspace.domain, description: workspace.description, aliases: workspace.brandAliases.join(', '), engines: workspace.engines, runFrequency: workspace.runFrequency, dataMode: workspace.dataMode };
  const isAdmin = hasRole(role, 'admin');
  return (
    <div className="grid max-w-3xl gap-5">
      <Card>
        <CardHeader title="Workspace" description="How Signal identifies your brand in answers." />
        <CardBody><GeneralForm ws={ws} canEdit={isAdmin} allowedEngines={limits.engines} dailyAllowed={limits.cadence === 'daily'} /></CardBody>
      </Card>
      <Card id="data-source" className="scroll-mt-20">
        <CardHeader title="Data source" description="Sample and live observations are stored separately and never mixed in metrics." />
        <CardBody><DataSourceControl ws={ws} canEdit={isAdmin} liveAvailable={liveEngines().filter((e) => workspace.engines.includes(e)).map((e) => ENGINE_BY_ID[e].name)} /></CardBody>
      </Card>
      {hasRole(role, 'owner') && (
        <Card>
          <CardHeader title="Data and deletion" />
          <CardBody><DangerZone ws={ws} /></CardBody>
        </Card>
      )}
    </div>
  );
}
