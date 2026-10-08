import Link from 'next/link';
import { requireWorkspace, hasRole } from '@/lib/workspace';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { BrandingForm } from './branding-form';

export const metadata = { title: 'Report branding' };

export default async function BrandingPage({ params }: PageProps<'/app/[workspace]/settings/branding'>) {
  const { workspace: slug } = await params;
  const { workspace, role } = await requireWorkspace(slug);
  const eligible = workspace.plan === 'agency' || workspace.plan === 'trial';
  return (
    <div className="grid max-w-3xl gap-5">
      {!eligible && <Alert tone="info" title="White-label reports are an Agency plan feature">Present reports under your own brand to clients. <Link href={`/app/${slug}/settings/billing`} className="font-semibold underline">Upgrade to Agency</Link></Alert>}
      {workspace.plan === 'trial' && <Alert tone="info">White-label reports are part of the Agency plan. You can try them during your trial.</Alert>}
      <Card>
        <CardHeader title="White-label reports" description="Applies to reports in the app and to shared report links." />
        <CardBody>
          <BrandingForm workspaceId={workspace.id} canEdit={eligible && hasRole(role, 'admin')} values={{ name: workspace.reportBrandName ?? '', color: workspace.reportAccentColor ?? '', logo: workspace.reportLogoUrl ?? '', hide: workspace.hideSignalBranding }} />
        </CardBody>
      </Card>
    </div>
  );
}
