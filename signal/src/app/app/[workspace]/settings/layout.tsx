import { PageHeader } from '@/components/app/page-header';
import { SettingsNav } from './settings-nav';

export default async function SettingsLayout({ children, params }: LayoutProps<'/app/[workspace]/settings'>) {
  const { workspace } = await params;
  return (
    <>
      <PageHeader title="Settings" description="Workspace configuration, team, billing, and audit history." />
      <SettingsNav slug={workspace} />
      {children}
    </>
  );
}
